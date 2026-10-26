<?php

namespace App\Console\Commands;

use App\Models\AppUser;
use App\Models\Product;
use App\Services\DummyJsonClient;
use App\Services\DummyJsonMapper;
use Illuminate\Console\Command;
use Throwable;

class ImportDummyJson extends Command
{
    protected $signature = 'dummyjson:import
                            {--fresh : Hapus data katalog lama sebelum impor}
                            {--skip-products : Jangan impor produk}
                            {--skip-users : Jangan impor pengguna}';

    protected $description = 'Impor produk dan pengguna dari DummyJSON ke MySQL (idempoten)';

    public function handle(DummyJsonClient $client, DummyJsonMapper $mapper): int
    {
        if ($this->option('fresh')) {
            Product::query()->delete();
            AppUser::query()->delete();
            $this->warn('Data katalog lama dihapus.');
        }

        try {
            if (! $this->option('skip-products')) {
                $this->importProducts($client->products(), $mapper);
            }

            if (! $this->option('skip-users')) {
                $this->importUsers($client->users(), $mapper);
            }
        } catch (Throwable $exception) {
            $this->error('Impor gagal: '.$exception->getMessage());

            return self::FAILURE;
        }

        return self::SUCCESS;
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function importProducts(array $items, DummyJsonMapper $mapper): void
    {
        $rows = $mapper->products($items);

        foreach (array_chunk($rows, 250) as $chunk) {
            Product::query()->upsert(
                $chunk,
                ['external_id'],
                ['title', 'description', 'category', 'brand', 'price', 'rating', 'stock', 'thumbnail', 'images', 'updated_at']
            );
        }

        $this->info('Produk diimpor: '.count($rows));
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function importUsers(array $items, DummyJsonMapper $mapper): void
    {
        $rows = $mapper->users($items);

        foreach (array_chunk($rows, 250) as $chunk) {
            AppUser::query()->upsert(
                $chunk,
                ['external_id'],
                ['first_name', 'last_name', 'email', 'phone', 'avatar', 'company_name', 'city', 'updated_at']
            );
        }

        $this->info('Pengguna diimpor: '.count($rows));
    }
}
