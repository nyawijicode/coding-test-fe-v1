<?php

namespace App\Services;

/**
 * Memetakan payload DummyJSON ke kolom database.
 *
 * Hanya field yang diizinkan yang dibaca. Field sensitif seperti password,
 * ssn, bank, crypto, dan ein tidak pernah masuk ke array hasil.
 */
class DummyJsonMapper
{
    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array<int, array<string, mixed>>
     */
    public function products(array $items): array
    {
        $rows = [];
        $timestamp = now();

        foreach ($items as $item) {
            if (! isset($item['id'], $item['title'])) {
                continue;
            }

            $images = array_values(array_filter(
                is_array($item['images'] ?? null) ? $item['images'] : [],
                'is_string'
            ));

            $rows[] = [
                'external_id' => (int) $item['id'],
                'title' => mb_substr(trim(strip_tags((string) $item['title'])), 0, 255),
                'description' => isset($item['description'])
                    ? trim(strip_tags((string) $item['description']))
                    : null,
                'category' => mb_substr(trim((string) ($item['category'] ?? 'lainnya')), 0, 100),
                'brand' => filled($item['brand'] ?? null)
                    ? mb_substr(trim((string) $item['brand']), 0, 120)
                    : null,
                'price' => round(max(0, (float) ($item['price'] ?? 0)), 2),
                'rating' => round(min(5, max(0, (float) ($item['rating'] ?? 0))), 2),
                'stock' => max(0, (int) ($item['stock'] ?? 0)),
                'thumbnail' => filled($item['thumbnail'] ?? null)
                    ? (string) $item['thumbnail']
                    : ($images[0] ?? null),
                'images' => json_encode($images, JSON_UNESCAPED_SLASHES),
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        return $rows;
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array<int, array<string, mixed>>
     */
    public function users(array $items): array
    {
        $rows = [];
        $timestamp = now();

        foreach ($items as $item) {
            if (! isset($item['id'], $item['email'], $item['firstName'])) {
                continue;
            }

            $rows[] = [
                'external_id' => (int) $item['id'],
                'first_name' => mb_substr(trim((string) $item['firstName']), 0, 120),
                'last_name' => filled($item['lastName'] ?? null)
                    ? mb_substr(trim((string) $item['lastName']), 0, 120)
                    : null,
                'email' => mb_substr(trim((string) $item['email']), 0, 255),
                'phone' => filled($item['phone'] ?? null)
                    ? mb_substr(trim((string) $item['phone']), 0, 40)
                    : null,
                'avatar' => filled($item['image'] ?? null) ? (string) $item['image'] : null,
                'company_name' => filled(data_get($item, 'company.name'))
                    ? mb_substr(trim((string) data_get($item, 'company.name')), 0, 160)
                    : null,
                'city' => filled(data_get($item, 'address.city'))
                    ? mb_substr(trim((string) data_get($item, 'address.city')), 0, 120)
                    : null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        return $rows;
    }
}
