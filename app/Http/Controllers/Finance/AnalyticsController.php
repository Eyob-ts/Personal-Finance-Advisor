<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Services\Finance\AnalyticsService;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function showAnalytics($startDate = null, $endDate = null)
    {
        $analytics = $this->analyticsService->generateAnalytics($startDate, $endDate);

        return response()->json([
            'message' => 'Analytics generated successfully',
            'data' => $analytics,
        ]);
    }
}
