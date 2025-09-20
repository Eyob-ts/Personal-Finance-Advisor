<?php

namespace App\Services\Finance;

use App\Models\Finance\Budget as FinanceBudget;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\Finance\Budget;

class ReportService
{
    public function generateSummary($startDate = null, $endDate = null)
    {
        $user = Auth::user();

        $query = Transaction::with('category')
            ->where('user_id', $user->id);

        if ($startDate) $query->whereDate('date', '>=', $startDate);
        if ($endDate) $query->whereDate('date', '<=', $endDate);

        $transactions = $query->get();

        $incomeTotal = $transactions->where('type', 'income')->sum('amount');
        $expenseTotal = $transactions->where('type', 'expense')->sum('amount');

        $categoryBreakdown = $transactions->where('type', 'expense')
            ->groupBy('category.name')
            ->map(function ($group) {
                return $group->sum('amount');
            });

        // Compare to budgets
        $budgets = Budget::where('user_id', $user->id)->get();

        $budgetComparison = $budgets->map(function ($budget) use ($transactions) {
            $spent = $transactions->where('category_id', $budget->category_id)->sum('amount');
            return [
                'category_id' => $budget->category_id,
                'category_name' => optional($budget->category)->name,
                'budgeted' => $budget->amount,
                'spent' => $spent,
                'remaining' => $budget->amount - $spent,
            ];
        });

        // Add Goals Summary
    $goalsSummary = $user->goals->map(function ($goal) {
        // Calculate progress
        $progress = $goal->target_amount > 0
            ? round(($goal->current_amount / $goal->target_amount) * 100)
            : 0;

        return [
            'title' => $goal->title,
            'target_amount' => $goal->target_amount,
            'current_amount' => $goal->current_amount,
            'progress_percentage' => $progress,
        ];
    });

    // Return final response structure
    return [
        'total_income' => $incomeTotal,
        'total_expense' => $expenseTotal,
        'net_balance' => $incomeTotal - $expenseTotal,
        'category_breakdown' => $categoryBreakdown,
        'budget_comparison' => $budgetComparison,
        'goals_summary' => $goalsSummary, // Include goals summary here
    ];

        // return [
        //     'total_income' => $incomeTotal,
        //     'total_expense' => $expenseTotal,
        //     'net_balance' => $incomeTotal - $expenseTotal,
        //     'category_breakdown' => $categoryBreakdown,
        //     'budget_comparison' => $budgetComparison,
        // ];
    }
}
