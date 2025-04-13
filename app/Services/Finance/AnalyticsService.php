<?php

namespace App\Services\Finance;

use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\Finance\Budget;
use App\Models\Finance\Goal;

class AnalyticsService
{
    public function generateAnalytics($startDate = null, $endDate = null)
    {
        $user = Auth::user();

        // Fetch transactions
        $query = Transaction::where('user_id', $user->id);

        if ($startDate) $query->whereDate('date', '>=', $startDate);
        if ($endDate) $query->whereDate('date', '<=', $endDate);

        $transactions = $query->get();

        // Income vs Expense Analytics
        $incomeTotal = $transactions->where('type', 'income')->sum('amount');
        $expenseTotal = $transactions->where('type', 'expense')->sum('amount');
        $netBalance = $incomeTotal - $expenseTotal;

        // Expense Breakdown by Category
        $categoryAnalytics = $transactions->where('type', 'expense')
            ->groupBy('category.name')
            ->map(function ($group) {
                return $group->sum('amount');
            });

        // Budget Analytics (Budget vs Actuals)
        $budgets = Budget::where('user_id', $user->id)->get();
        $budgetAnalytics = $budgets->map(function ($budget) use ($transactions) {
            $spent = $transactions->where('category_id', $budget->category_id)->sum('amount');
            return [
                'category_name' => optional($budget->category)->name,
                'budgeted' => $budget->amount,
                'spent' => $spent,
                'remaining' => $budget->amount - $spent,
            ];
        });

        // Goal Analytics (Progress towards each goal)
        $goalAnalytics = $user->goals->map(function ($goal) {
            $progress = $goal->target_amount > 0
                ? round(($goal->current_amount / $goal->target_amount) * 100)
                : 0;

            return [
                'title' => $goal->title,
                'progress_percentage' => $progress,
                'current_amount' => $goal->current_amount,
                'target_amount' => $goal->target_amount,
            ];
        });

        return [
            'income_total' => $incomeTotal,
            'expense_total' => $expenseTotal,
            'net_balance' => $netBalance,
            'category_analytics' => $categoryAnalytics,
            'budget_analytics' => $budgetAnalytics,
            'goal_analytics' => $goalAnalytics,
        ];
    }
}
