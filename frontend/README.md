# Frontend — Katalog Data

SPA React 18 + TypeScript + Vite untuk aplikasi Katalog Data. Dokumentasi lengkap (setup, arsitektur, kontrak API, keamanan, dan pengujian) ada di [README utama](../README.md).

## Ringkasan

- TanStack Query v5 + Axios untuk data fetching, React Router v6 untuk routing.
- React Hook Form + Zod untuk form, TanStack Table untuk tabel produk/pengguna.
- Tailwind CSS + komponen bergaya shadcn/ui, lucide-react, font Inter.

## Perintah singkat

```bash
npm install
npm run dev
```

```bash
npm run test
npm run lint
npm run build
```

Dev server berjalan di `http://localhost:5173` dan mem-proxy `/api` serta `/sanctum` ke `http://127.0.0.1:8000`. Untuk langkah lengkap dan akun demo, lihat [README utama](../README.md).
