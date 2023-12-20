<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register','me','isAdmin']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }
    public function updateRole(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $request->validate([
            'role' => 'required|in:admin,user', // Add any other validation rules as needed
        ]);

        $user->role = $request->input('role');
        $user->save();

        return response()->json(['message' => 'User role updated successfully']);
    }

    public function index (){
        $user = User::all();
        return response()->json([
            'status'=>200,
            'user'=>$user,

        ]);
    }

    public function register()
    {
        $credentials = request(['name','email', 'password','phonenumber']);
        //$credentials['password'] = bycrpt($credentials['password']);
        User :: create($credentials);
        return response()->json('sucess');
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => auth() -> user(),
        ]);
    }
    public function isAdmin(Request $request) {
        if ($request->user() && $request->user()->role === 'admin') {
            return response()->json(['isAdmin' => true]);
        }
        return response()->json(['isAdmin' => false]);
    }
}