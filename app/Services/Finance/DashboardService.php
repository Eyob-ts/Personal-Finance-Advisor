<?php

namespace App\Services\Finance;

use App\Models\transaction;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;

class DashboardService
{
    /**
     * get financial summary for current month.
    */
    public function getSummary(User $user)
    {
        $income=transaction::where('user_id', $user->id)
        ->where('type', 'income')
        ->whereMonth('transaction_date', now()->month)
        ->sum('amount');

        $expense=transaction::where('user_id', $user->id)
        ->where('type', 'expense')
        ->whereMonth('transaction_date', now()->month)
        ->sum('amount');

        return [
            'balance'=>$user->balance ?? 0,
            'monthly_income' => $income,
            'monthly_expense' => $expense,
            'savings' => $income - $expense
        ];
    }
    /**
     * Get the 5 most recent transactions.
    */

    public function getRecentTransactions(User $user, int $limit = 5){
        return transaction::where('user_id', $user->id)
        ->latest('transaction_date')
        ->take($limit)
        ->get();
    }

    /**
     * get total expenses grouped by category.
    */

    public function getSpendingByCategory (User $user){
        $totalsByCategory = DB::table('transactions')
    ->select('category_id', DB::raw('SUM(amount) as total'))
    ->where('user_id', $user->id)
    ->where('type', 'expense')
    ->groupBy('category_id')
    ->get();

    return $totalsByCategory->mapWithKeys(function ($item) {
        return [$item->category_id => $item->total];
    });
    }

     /**
     * Get monthly income and expense trend for last 6 months.
     */
    public function getMonthlyTrend(User $user)
    {
        return collect(range(0, 5))->map(function ($i) use ($user) {
            $month = now()->subMonths($i)->startOfMonth();
            $income = transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereBetween('transaction_date', [$month, $month->copy()->endOfMonth()])
                ->sum('amount');

            $expense = transaction::where('user_id', $user->id)
                ->where('type', 'expense')
                ->whereBetween('transaction_date', [$month, $month->copy()->endOfMonth()])
                ->sum('amount');

            return [
                'month' => $month->format('M Y'),
                'income' => $income,
                'expense' => $expense,
            ];
        })->reverse()->values();
    }


}
