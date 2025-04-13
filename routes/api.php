<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);

// Protected Routes (require auth)

/**
 * Account
 */

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('accounts', AccountController::class);
});

/**
 * Category
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class);
});

/**
 * todo transaction
 */

 Route::middleware('auth:sanctum')->group(function () {
    // Transactions CRUD
    Route::apiResource('transactions', TransactionController::class);

    // Transaction summary (optional stats)
    Route::get('transactions/summary', [TransactionController::class, 'summary']);

    // User balance
    Route::get('/balance', function () {
        return response()->json([
            'balance' => auth()->user()->balance,
        ]);
    });
});

/**
 * User
 */



// Health check
Route::get('/', function () {
    return response()->json(['status' => 'API Ready']);
});
