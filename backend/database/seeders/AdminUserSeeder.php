<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = Str::lower(trim((string) env('ADMIN_EMAIL', 'admin@example.com')));
        $password = (string) env('ADMIN_PASSWORD', 'Admin#12345');
        $name = (string) env('ADMIN_NAME', 'Admin Katalog');

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]
        );

        $this->command?->info("Akun admin siap: {$email}");
    }
}
