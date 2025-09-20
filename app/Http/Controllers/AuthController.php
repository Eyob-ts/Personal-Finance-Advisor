<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     *Register
     */
    public function register(Request $request)
    {
        $field = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email | unique:users',
            'password' => 'required|string|confirmed',
        ]);

        $user = User::create($field);
        $token = $user->createToken($request->name);

        return [
            'user' => $user,
            'token' => $token->plainTextToken
        ];
    }
    /**
     *Login
     */
    public function login(Request $request)
    {

        $field = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $field['email'])->first();

        if (!$user || !Hash::check($field['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid Credentials'
            ], 401);
        }

        $token = $user->createToken($user->name);

        return [
            'user' => $user,
            'token' => $token->plainTextToken
        ];
    }

    /**
     * Get the authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
{
    try {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User is not authenticated.',
            ], 401);
        }

        $token = $user->currentAccessToken();

        if (!$token) {
            return response()->json([
                'status' => false,
                'message' => 'No active access token found.',
            ], 400);
        }

        $token->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logout successful.',
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => false,
            'message' => 'Something went wrong during logout.',
            'error' => $e->getMessage(), // optional, good for dev
        ], 500);
    }
}



    /**
     * getuser
     */
    // public function getUser(Request $request)
    // {
    //     return response()->json([
    //         'message' => 'Get User'
    //     ]);
    // }
}
