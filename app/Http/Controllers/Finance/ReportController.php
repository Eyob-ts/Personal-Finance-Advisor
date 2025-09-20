<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Services\Finance\ReportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(Request $request)
    {
        $data = $this->reportService->generateSummary(
            $request->query('start_date'),
            $request->query('end_date')
        );

        return response()->json([
            'message' => 'Report generated successfully',
            'data' => $data
        ]);
    }
}
