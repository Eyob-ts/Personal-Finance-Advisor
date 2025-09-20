<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\StoreBudgetRequest;
use App\Http\Requests\Finance\UpdateBudgetRequest;
use App\Models\Finance\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Auth::user()->budgets()
            ->with('category')
            ->latest()
            ->get();

        return response()->json($budgets);
    }


    public function store(StoreBudgetRequest $request)
    {
        $budget = Auth::user()->budgets()->create($request->validated());

        return response()->json([
            'message' => 'Budget created successfully',
            'budget' => $budget->load('category')
        ], 201);
    }

    public function show(Budget $budget)
    {
        if ($budget->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($budget->load('category'));
    }

    public function update(UpdateBudgetRequest $request, Budget $budget)
    {
        if ($budget->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $budget->update($request->validated());

        return response()->json([
            'message' => 'Budget updated successfully',
            'budget' => $budget->load('category')
        ]);
    }

    public function destroy(Budget $budget)
    {
        if ($budget->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $budget->delete();

        return response()->json(['message' => 'Budget deleted successfully']);
    }



}
