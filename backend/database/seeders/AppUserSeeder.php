<?php

namespace Database\Seeders;

use App\Models\AppUser;
use App\Services\DummyJsonMapper;
use Illuminate\Database\Seeder;
use RuntimeException;

class AppUserSeeder extends Seeder
{
    public function run(DummyJsonMapper $mapper): void
    {
        $path = database_path('seeders/data/users.json');

        if (! is_file($path)) {
            throw new RuntimeException("Snapshot pengguna tidak ditemukan: {$path}");
        }

        $items = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        $rows = $mapper->users(is_array($items) ? $items : []);

        foreach (array_chunk($rows, 250) as $chunk) {
            AppUser::query()->upsert(
                $chunk,
                ['external_id'],
                ['first_name', 'last_name', 'email', 'phone', 'avatar', 'company_name', 'city', 'updated_at']
            );
        }

        $this->command?->info('Pengguna di-seed: '.count($rows));
    }
}
