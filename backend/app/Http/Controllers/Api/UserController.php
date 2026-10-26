<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\RespondsWithPagination;
use App\Http\Requests\UserIndexRequest;
use App\Http\Resources\UserResource;
use App\Models\AppUser;
use App\Services\UserQuery;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    use RespondsWithPagination;

    public function index(UserIndexRequest $request, UserQuery $query): JsonResponse
    {
        return $this->paginatedResponse(
            $query->paginate($request->validated()),
            UserResource::class
        );
    }

    public function show(AppUser $user): JsonResponse
    {
        return response()->json(['data' => new UserResource($user)]);
    }
}
