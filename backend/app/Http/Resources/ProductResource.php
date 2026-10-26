<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'brand' => $this->brand,
            'price' => (float) $this->price,
            'rating' => (float) $this->rating,
            'stock' => $this->stock,
            'thumbnail' => $this->thumbnail,
            'images' => $this->images ?? [],
        ];
    }
}
