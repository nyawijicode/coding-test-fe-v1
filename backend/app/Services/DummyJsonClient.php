<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class DummyJsonClient
{
    private const BASE_URL = 'https://dummyjson.com';

    /**
     * @return array<int, array<string, mixed>>
     */
    public function products(): array
    {
        return $this->fetch('products');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function users(): array
    {
        return $this->fetch('users');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function fetch(string $resource): array
    {
        $response = Http::acceptJson()
            ->timeout(45)
            ->retry(2, 750)
            ->get(self::BASE_URL."/{$resource}?limit=0");

        $this->ensureSuccessful($response, $resource);

        $items = $response->json($resource);

        if (! is_array($items)) {
            throw new RuntimeException("Respons DummyJSON untuk {$resource} tidak valid.");
        }

        return array_values(array_filter($items, 'is_array'));
    }

    private function ensureSuccessful(Response $response, string $resource): void
    {
        if ($response->successful()) {
            return;
        }

        throw new RuntimeException(
            "Gagal mengambil {$resource} dari DummyJSON (HTTP {$response->status()})."
        );
    }
}
