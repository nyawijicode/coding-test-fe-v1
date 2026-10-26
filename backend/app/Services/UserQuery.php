<?php

namespace App\Services;

use App\Models\AppUser;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserQuery
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['q'] ?? ''));
        $requestedPerPage = (int) ($filters['per_page'] ?? 20);
        $perPage = in_array($requestedPerPage, [10, 20, 50], true)
            ? $requestedPerPage
            : 20;

        return AppUser::query()
            ->when($search !== '', fn ($query) => $query->search($search))
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->orderBy('id')
            ->paginate($perPage)
            ->withQueryString();
    }
}
