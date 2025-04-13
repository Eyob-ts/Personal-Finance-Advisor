<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return only the user's transactions
        $transactions = Auth::user()->transactions()
            ->with(['account', 'category']) // Eager load relationships
            ->latest()
            ->get();

        return response()->json($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {


    // Create the transaction
    $transaction = Auth::user()->transactions()->create($request->validated());

    // Update the account balance based on transaction type
    if ($transaction->type === 'income') {
        $transaction->account->increment('balance', $transaction->amount);
    } else {
        $transaction->account->decrement('balance', $transaction->amount);
    }

    // Return the created transaction
    return response()->json($transaction, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, transaction $transaction)
    {
        if ($transaction->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    // Save the updated transaction details
    $transaction->update($request->validated());

    // If the transaction type or amount has changed, update the account balance accordingly
    if ($transaction->wasChanged('amount') || $transaction->wasChanged('type')) {
        // Adjust the account balance based on the new transaction details
        if ($transaction->type === 'income') {
            $transaction->account->increment('balance', $transaction->amount);
        } else {
            $transaction->account->decrement('balance', $transaction->amount);
        }
    }

    // Return the updated transaction with a success message
    return response()->json([
        'message' => 'Transaction updated successfully',
        'transaction' => $transaction,
    ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

    // 1. Find the transaction (with ownership check)
    $transaction = Transaction::where('user_id', auth()->id())
                            ->findOrFail($id);

    // 2. Adjust account balance
    $account = $transaction->account;
    if ($transaction->type === 'income') {
        $account->balance -= $transaction->amount;
    } else {
        $account->balance += $transaction->amount;
    }
    $account->save();

    // 3. Delete transaction
    $transaction->delete();

    return response()->json([
        'message' => 'Transaction deleted successfully'
    ]);
    }
}
