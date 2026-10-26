<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Services\DummyJsonMapper;
use Illuminate\Database\Seeder;
use RuntimeException;

class ProductSeeder extends Seeder
{
    public function run(DummyJsonMapper $mapper): void
    {
        $path = database_path('seeders/data/products.json');

        if (! is_file($path)) {
            throw new RuntimeException("Snapshot produk tidak ditemukan: {$path}");
        }

        $items = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        $rows = $mapper->products(is_array($items) ? $items : []);

        foreach (array_chunk($rows, 250) as $chunk) {
            Product::query()->upsert(
                $chunk,
                ['external_id'],
                ['title', 'description', 'category', 'brand', 'price', 'rating', 'stock', 'thumbnail', 'images', 'updated_at']
            );
        }

        $this->command?->info('Produk di-seed: '.count($rows));
    }
}
