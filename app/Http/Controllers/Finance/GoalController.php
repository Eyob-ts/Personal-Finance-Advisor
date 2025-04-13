<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\StoreGoalRequest;
use App\Http\Requests\Finance\UpdateGoalRequest;
use App\Models\Finance\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    public function index()
    {
        $goals = Auth::user()->goals()->latest()->get();
        return response()->json($goals);
    }

    public function store(StoreGoalRequest $request)
    {
        $goal = Auth::user()->goals()->create($request->validated());

        return response()->json([
            'message' => 'Goal created successfully',
            'goal' => $goal,
        ], 201);
    }

    public function show(Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($goal);
    }

    public function update(UpdateGoalRequest $request, Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $goal->update($request->validated());
        return response()->json([
            'message' => 'Goal updated successfully',
            'goal' => $goal,
        ]);
    }

    public function destroy(Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $goal->delete();
        return response()->json(['message' => 'Goal deleted successfully']);
    }
}
