<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Auth::user()->categories;
        return response()->json($categories);
    }

    /**
     * store
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = Auth::user()->categories()->create($request->validated());

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * update the categories
     */

    public function update(UpdateCategoryRequest $request, category $category)
{
    // Optional: check ownership
    if ($category->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $category->update($request->validated());

    return response()->json([
        'message' => 'Category updated successfully',
        'data' => $category,
    ]);
}
/**
 * Delete the categories
 */

public function destroy(Category $category)
{
    // Optional: check ownership
    if ($category->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $category->delete();

    return response()->json(['message' => 'Category deleted successfully']);
}

}
