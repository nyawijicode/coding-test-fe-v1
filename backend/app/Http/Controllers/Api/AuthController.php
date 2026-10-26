<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\AuthUserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Hash dummy dengan cost yang sama agar waktu respons login tetap seragam
     * ketika email tidak terdaftar (mencegah user enumeration).
     */
    private const DUMMY_HASH = '$2y$12$E4uJJVBIBnk.rP15nFJRO.aGfl1MP7ZoMMHQJtnej8DWS3PN7ZRJK';

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $user = User::query()->where('email', $credentials['email'])->first();

        $passwordMatches = Hash::check(
            $credentials['password'],
            $user?->getAuthPassword() ?? self::DUMMY_HASH
        );

        if (! $user || ! $passwordMatches) {
            Log::channel('security')->warning('auth.login.failed', [
                'email_hash' => hash('sha256', $credentials['email']),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'Email atau kata sandi tidak sesuai',
            ], 422);
        }

        Auth::guard('web')->login($user);

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        RateLimiter::clear($this->throttleKey($credentials['email'], $request->ip()));

        Log::channel('security')->info('auth.login.succeeded', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        return response()->json(['data' => new AuthUserResource($user)]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new AuthUserResource($request->user()),
        ]);
    }

    public function logout(Request $request): Response
    {
        $userId = $request->user()?->id;

        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        Log::channel('security')->info('auth.logout', [
            'user_id' => $userId,
            'ip' => $request->ip(),
        ]);

        return response()->noContent();
    }

    private function throttleKey(string $email, ?string $ip): string
    {
        return Str::transliterate(Str::lower($email)).'|'.$ip;
    }
}
