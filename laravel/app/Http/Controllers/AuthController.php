<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['message' => 'Incorrect email or password.'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Create an account and log the new user in.
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|email|max:191|unique:users,email',
            'phonenumber' => ['required', 'string', 'max:20', 'regex:/^\+?[0-9 ]{8,20}$/'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        // The password is hashed by the "hashed" cast on the User model.
        $user = User::create($data);

        return $this->respondWithToken(auth()->login($user), 201);
    }

    /**
     * Get the authenticated User.
     */
    public function me(): JsonResponse
    {
        return response()->json($this->profile(auth()->user()));
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = auth()->user();

        $data = $request->validate([
            'name' => 'required|string|max:191',
            'email' => ['required', 'email', 'max:191', Rule::unique('users', 'email')->ignore($user->id)],
            'phonenumber' => ['required', 'string', 'max:20', 'regex:/^\+?[0-9 ]{8,20}$/'],
            'password' => ['nullable', 'confirmed', Password::min(8)],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($this->profile($user));
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     */
    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     */
    protected function respondWithToken(string $token, int $status = 200): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $this->profile(auth()->user()),
        ], $status);
    }

    protected function profile(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phonenumber' => $user->phonenumber,
            'role' => $user->role ?? 'user',
            'created_at' => $user->created_at,
            'books_count' => $user->books()->count(),
            'wishes_count' => $user->wishes()->count(),
        ];
    }
}
