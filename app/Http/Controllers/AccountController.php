<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class AccountController extends Controller
{
   /**
     * Display a listing of accounts.
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        return $request->user()->accounts()->latest()->get();
    }
    /**
     * Store a newly created account.
     *
     * @param StoreAccountRequest $request
     * @return JsonResponse
     */
    public function store(StoreAccountRequest $request)
{
    $request->user()->accounts()->create($request->validated());

    return response()->json(['message' => 'Account created successfully'], 201);
}

   /**
     * Display the specified account.
     *

     */
    public function show(Account $account)
{
    return response()->json($account);
}

    public function update(UpdateAccountRequest $request, Account $account)
    {
        // Ensure the user owns the account
        if ($account->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $account->update($request->validated());

        return response()->json([
            'message' => 'Account updated successfully.',
            'data' => $account
        ]);
    }
    /**
     * Remove the specified account.
     *
     */
    public function destroy(Account $account)
{
    $account->delete();

    return response()->json([
        'message' => 'Account deleted successfully.',
    ]);
}

}
