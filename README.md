
## Struktur

```
tugas12/
├── backend/    (NestJS + TypeORM + JWT + bcrypt)
└── frontend/   (React + Vite + React Router + Axios)
```

## Fitur yang sudah diimplementasikan


**1. Flow autentikasi JWT (backend)**
`AuthController` menerima request → `AuthService.register/login` memverifikasi
data user via bcrypt → jika valid, `JwtService.sign(payload)` membuat token
berisi `{ sub: userId, email, name }` yang ditandatangani dengan `JWT_SECRET`.

**2. Cara kerja JWT Guard**
`JwtAuthGuard` (custom, di `auth/jwt-auth.guard.ts`) mengambil token dari
header `Authorization: Bearer <token>`, memverifikasinya dengan
`jwtService.verifyAsync()`. Jika valid, payload di-attach ke `request.user`
dan request dilanjutkan; jika tidak, melempar `UnauthorizedException` (401).

**3. Cara kerja Axios interceptor**
`api.interceptors.request.use()` di `axiosInstance.js` berjalan sebelum
setiap request dikirim — ia mengambil `accessToken` dari `localStorage` dan
menyisipkannya ke header `Authorization`. Response interceptor menangkap
error 401 secara global, menghapus token, dan redirect ke `/login`.

**4. Cara kerja ProtectedRoute**
Komponen ini mengecek apakah ada `user` (dari `AuthContext`) dan token di
`localStorage`. Jika tidak ada, `<Navigate to="/login" />` dipanggil sebelum
komponen anak (`ProductList`) dirender — mencegah akses tanpa login.
