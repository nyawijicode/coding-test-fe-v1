<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    RateLimiter::clear('admin@example.com|127.0.0.1');
});

it('logs in with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'password' => 'Admin#12345',
    ]);

    $this->withHeader('Origin', 'http://localhost:5173')
        ->postJson('/api/v1/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'Admin#12345',
        ])
        ->assertOk()
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.email', 'admin@example.com')
        ->assertJsonMissingPath('data.password');

    $this->assertAuthenticatedAs($user);
});

it('rejects invalid credentials with a generic message', function () {
    User::factory()->create([
        'email' => 'admin@example.com',
        'password' => 'Admin#12345',
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@example.com',
        'password' => 'WrongPassword1',
    ])
        ->assertStatus(422)
        ->assertJsonPath('message', 'Email atau kata sandi tidak sesuai')
        ->assertJsonMissingPath('errors');
});

it('validates login input', function () {
    $this->postJson('/api/v1/auth/login', [
        'email' => 'bukan-email',
        'password' => 'pendek',
    ])
        ->assertStatus(422)
        ->assertJsonPath('message', 'Data tidak valid.')
        ->assertJsonValidationErrors(['email', 'password'])
        ->assertJsonPath('errors.email.0', 'Format email tidak valid.')
        ->assertJsonPath('errors.password.0', 'Kata sandi minimal 8 karakter.');
});

it('throttles repeated login attempts', function () {
    User::factory()->create(['email' => 'admin@example.com']);

    foreach (range(1, 5) as $attempt) {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'WrongPassword1',
        ]);
    }

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@example.com',
        'password' => 'WrongPassword1',
    ]);

    $response->assertStatus(429)->assertHeader('Retry-After');
});

it('returns 401 for protected endpoints without a session', function () {
    $this->getJson('/api/v1/products')->assertUnauthorized();
    $this->getJson('/api/v1/auth/me')->assertUnauthorized();
});

it('returns the authenticated profile', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->getJson('/api/v1/auth/me')
        ->assertOk()
        ->assertJsonPath('data.email', $user->email);
});

it('logs out a stateful session and blocks protected endpoints afterwards', function () {
    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'password' => 'Admin#12345',
    ]);

    $origin = 'http://localhost:5173';

    $this->withHeader('Origin', $origin)
        ->postJson('/api/v1/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'Admin#12345',
        ])
        ->assertOk();

    $this->withCookie(config('session.cookie'), $this->app['session']->getId())
        ->withHeader('Origin', $origin)
        ->getJson('/api/v1/auth/me')
        ->assertOk()
        ->assertJsonPath('data.id', $user->id);

    $this->postJson('/api/v1/auth/logout')->assertNoContent();

    // Simulasikan request baru: guard di-reset seperti pada proses PHP berikutnya.
    $this->app['auth']->forgetGuards();

    $this->withCookie(config('session.cookie'), $this->app['session']->getId())
        ->withHeader('Origin', $origin)
        ->getJson('/api/v1/products')
        ->assertUnauthorized();
});
