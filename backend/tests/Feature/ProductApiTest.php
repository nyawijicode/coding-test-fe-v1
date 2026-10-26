<?php

use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    Sanctum::actingAs(User::factory()->create());
});

it('paginates products with metadata', function () {
    Product::factory()->count(25)->create();

    $this->getJson('/api/v1/products?per_page=10&page=2')
        ->assertOk()
        ->assertJsonCount(10, 'data')
        ->assertJsonPath('meta.current_page', 2)
        ->assertJsonPath('meta.per_page', 10)
        ->assertJsonPath('meta.total', 25)
        ->assertJsonPath('meta.last_page', 3);
});

it('searches products by title', function () {
    Product::factory()->create(['title' => 'Sepatu Lari Ringan']);
    Product::factory()->create(['title' => 'Jam Tangan Kulit']);

    $this->getJson('/api/v1/products?q=sepatu')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Sepatu Lari Ringan');
});

it('filters products by category and sorts by price', function () {
    Product::factory()->create(['category' => 'laptops', 'price' => 100]);
    Product::factory()->create(['category' => 'laptops', 'price' => 300]);
    Product::factory()->create(['category' => 'beauty', 'price' => 900]);

    $this->getJson('/api/v1/products?category=laptops&sort=price&order=desc')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.price', 300)
        ->assertJsonPath('data.1.price', 100);
});

it('rejects invalid list parameters', function () {
    $this->getJson('/api/v1/products?per_page=500')
        ->assertStatus(422)
        ->assertJsonValidationErrors('per_page');

    $this->getJson('/api/v1/products?sort=password')
        ->assertStatus(422)
        ->assertJsonValidationErrors('sort');

    $this->getJson('/api/v1/products?page=0')
        ->assertStatus(422)
        ->assertJsonValidationErrors('page');
});

it('returns distinct categories', function () {
    Product::factory()->create(['category' => 'laptops']);
    Product::factory()->create(['category' => 'beauty']);
    Product::factory()->create(['category' => 'beauty']);

    $this->getJson('/api/v1/products/categories')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0', 'beauty')
        ->assertJsonPath('data.1', 'laptops');
});

it('shows a product and returns 404 for unknown ids', function () {
    $product = Product::factory()->create();

    $this->getJson("/api/v1/products/{$product->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $product->id)
        ->assertJsonStructure(['data' => ['id', 'title', 'price', 'rating', 'stock', 'images']]);

    $this->getJson('/api/v1/products/999999')
        ->assertNotFound()
        ->assertJsonPath('message', 'Data tidak ditemukan.');
});
