<?php

use App\Models\AppUser;
use App\Models\Product;
use Illuminate\Support\Facades\Http;

function fakeDummyJson(): void
{
    Http::fake([
        'dummyjson.com/products*' => Http::response([
            'products' => [
                [
                    'id' => 1,
                    'title' => 'Produk Uji',
                    'description' => '<p>Deskripsi uji</p>',
                    'category' => 'beauty',
                    'brand' => 'Merek Uji',
                    'price' => 12.5,
                    'rating' => 4.75,
                    'stock' => 8,
                    'thumbnail' => 'https://cdn.example.com/thumb.jpg',
                    'images' => ['https://cdn.example.com/1.jpg'],
                ],
            ],
        ]),
        'dummyjson.com/users*' => Http::response([
            'users' => [
                [
                    'id' => 7,
                    'firstName' => 'Emily',
                    'lastName' => 'Johnson',
                    'email' => 'emily@example.com',
                    'phone' => '+1 555 0100',
                    'image' => 'https://cdn.example.com/avatar.jpg',
                    'password' => 'secret-password',
                    'ssn' => '123-45-6789',
                    'bank' => ['iban' => 'DE89370400440532013000'],
                    'company' => ['name' => 'Perusahaan Uji'],
                    'address' => ['city' => 'Jakarta'],
                ],
            ],
        ]),
    ]);
}

it('imports products and sanitizes users', function () {
    fakeDummyJson();

    $this->artisan('dummyjson:import')->assertSuccessful();

    expect(Product::count())->toBe(1)
        ->and(AppUser::count())->toBe(1);

    $product = Product::first();
    expect($product->title)->toBe('Produk Uji')
        ->and($product->description)->toBe('Deskripsi uji')
        ->and($product->images)->toBe(['https://cdn.example.com/1.jpg']);

    $user = AppUser::first();
    expect($user->company_name)->toBe('Perusahaan Uji')
        ->and($user->city)->toBe('Jakarta')
        ->and($user->getAttributes())->not->toHaveKeys(['password', 'ssn', 'bank']);
});

it('is idempotent when run repeatedly', function () {
    fakeDummyJson();

    $this->artisan('dummyjson:import')->assertSuccessful();
    $this->artisan('dummyjson:import')->assertSuccessful();

    expect(Product::count())->toBe(1)
        ->and(AppUser::count())->toBe(1);
});

it('reports failure when dummyjson is unreachable', function () {
    Http::fake([
        'dummyjson.com/*' => Http::response([], 500),
    ]);

    $this->artisan('dummyjson:import')->assertFailed();
});
