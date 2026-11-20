<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/register — Sign Up screen
    public function register(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        // Only validated fields are mass-assigned, so public registration cannot
        // grant a privileged role or any other trusted attribute.
        $user = User::create($data);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // POST /api/login — "Username or Email" + Password
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $field = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (! Auth::attempt([$field => $request->login, 'password' => $request->password])) {
            throw ValidationException::withMessages([
                'login' => ['Invalid username/email or password.'],
            ]);
        }

        $user = User::where($field, $request->login)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // GET /api/me — current user (sidebar name and settings)
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // PUT /api/profile — Settings screen
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'username' => ['required', 'string', 'max:50', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $user->username = $data['username'];
        $user->email = $data['email'];

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        return response()->json($user->fresh());
    }

    // POST /api/logout — revoke the current token
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
