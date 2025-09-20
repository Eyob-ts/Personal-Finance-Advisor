<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Services\Finance\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function summary()
    {
        return response()->json(
            $this->dashboardService->getSummary(auth()->user())
        );
    }

    public function recent()
    {
        return response()->json(
            $this->dashboardService->getRecentTransactions(auth()->user())
        );
    }

    public function spendingByCategory()
    {
        return response()->json(
            $this->dashboardService->getSpendingByCategory(auth()->user())
        );
    }

    public function monthlyTrend()
    {
        return response()->json(
            $this->dashboardService->getMonthlyTrend(auth()->user())
        );
    }
}
