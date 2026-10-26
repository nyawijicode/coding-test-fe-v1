# Backend — Katalog Data

API Laravel 11 + MySQL untuk aplikasi Katalog Data. Dokumentasi lengkap (setup, arsitektur, kontrak API, keamanan, dan pengujian) ada di [README utama](../README.md).

## Ringkasan

- Sanctum SPA cookie auth (`/sanctum/csrf-cookie`, `/api/v1/auth/*`).
- Produk dan pengguna DummyJSON diimpor ke MySQL lewat `php artisan dummyjson:import`.
- Rate limit login 5/menit dan API 60/menit, sort whitelist, Form Request, API Resource.

## Perintah singkat

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

```bash
php artisan test
./vendor/bin/pint --test
```

Untuk langkah lengkap, akun demo, dan catatan keamanan, lihat [README utama](../README.md).
