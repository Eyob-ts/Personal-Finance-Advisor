<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);

// Protected Routes (require auth)

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('accounts', AccountController::class);
});

//Category
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class);
});


// Health check
Route::get('/', function () {
    return response()->json(['status' => 'API Ready']);
});
