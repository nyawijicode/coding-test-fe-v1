<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'external_id' => fake()->unique()->numberBetween(10000, 999999),
            'title' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['smartphones', 'laptops', 'skincare', 'groceries']),
            'brand' => fake()->company(),
            'price' => fake()->randomFloat(2, 5, 2000),
            'rating' => fake()->randomFloat(2, 1, 5),
            'stock' => fake()->numberBetween(0, 200),
            'thumbnail' => fake()->imageUrl(400, 400, 'product'),
            'images' => [fake()->imageUrl(800, 800, 'product')],
        ];
    }
}
