<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProductQuery
{
    public const SORTS = ['title', 'price', 'rating', 'stock', 'category'];

    public const ORDERS = ['asc', 'desc'];

    public const PER_PAGE = [10, 20, 50];

    /**
     * @param  array<string, mixed>  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['q'] ?? ''));
        $category = trim((string) ($filters['category'] ?? ''));
        $sort = in_array($filters['sort'] ?? null, self::SORTS, true)
            ? $filters['sort']
            : 'title';
        $order = ($filters['order'] ?? null) === 'desc' ? 'desc' : 'asc';
        $requestedPerPage = (int) ($filters['per_page'] ?? 20);
        $perPage = in_array($requestedPerPage, self::PER_PAGE, true)
            ? $requestedPerPage
            : 20;

        $query = Product::query()
            ->when($search !== '', fn ($query) => $query->searchTitle($search))
            ->when($category !== '', fn ($query) => $query->where('category', $category))
            ->orderBy($sort, $order);

        if ($sort !== 'title') {
            $query->orderBy('title');
        }

        return $query
            ->orderBy('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * @return Collection<int, string>
     */
    public function categories(): Collection
    {
        return Product::query()
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');
    }
}
