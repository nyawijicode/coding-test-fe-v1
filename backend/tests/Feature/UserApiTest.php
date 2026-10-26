<?php

use App\Models\AppUser;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    Sanctum::actingAs(User::factory()->create());
});

it('paginates users with metadata', function () {
    AppUser::factory()->count(12)->create();

    $this->getJson('/api/v1/users?per_page=10')
        ->assertOk()
        ->assertJsonCount(10, 'data')
        ->assertJsonPath('meta.total', 12)
        ->assertJsonPath('meta.last_page', 2);
});

it('searches users by name or email', function () {
    AppUser::factory()->create([
        'first_name' => 'Emily',
        'last_name' => 'Johnson',
        'email' => 'emily@example.com',
    ]);
    AppUser::factory()->create([
        'first_name' => 'Michael',
        'last_name' => 'Williams',
        'email' => 'michael@example.com',
    ]);

    $this->getJson('/api/v1/users?q=emily')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.full_name', 'Emily Johnson');
});

it('never exposes sensitive dummyjson fields', function () {
    $user = AppUser::factory()->create();

    $this->getJson("/api/v1/users/{$user->id}")
        ->assertOk()
        ->assertJsonMissingPath('data.password')
        ->assertJsonMissingPath('data.ssn')
        ->assertJsonMissingPath('data.bank')
        ->assertJsonStructure(['data' => [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone', 'avatar', 'company_name', 'city',
        ]]);
});

it('validates user list parameters', function () {
    $this->getJson('/api/v1/users?per_page=1000')
        ->assertStatus(422)
        ->assertJsonValidationErrors('per_page');
});
