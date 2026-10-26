<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\RespondsWithPagination;
use App\Http\Requests\ProductIndexRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductQuery;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    use RespondsWithPagination;

    public function index(ProductIndexRequest $request, ProductQuery $query): JsonResponse
    {
        return $this->paginatedResponse(
            $query->paginate($request->validated()),
            ProductResource::class
        );
    }

    public function categories(ProductQuery $query): JsonResponse
    {
        return response()->json(['data' => $query->categories()]);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(['data' => new ProductResource($product)]);
    }
}
