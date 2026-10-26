<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'external_id',
        'title',
        'description',
        'category',
        'brand',
        'price',
        'rating',
        'stock',
        'thumbnail',
        'images',
    ];

    protected function casts(): array
    {
        return [
            'external_id' => 'integer',
            'price' => 'decimal:2',
            'rating' => 'float',
            'stock' => 'integer',
            'images' => 'array',
        ];
    }

    public function scopeSearchTitle($query, string $term)
    {
        $escaped = addcslashes($term, '%_\\');

        return $query->where('title', 'like', "%{$escaped}%");
    }
}
