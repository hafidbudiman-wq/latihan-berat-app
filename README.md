# Latihan Berat App

Aplikasi web sederhana untuk membuat rekomendasi awal latihan berdasarkan berat badan, tinggi badan, usia, tujuan, level, dan jumlah hari latihan per minggu.

> Catatan: rekomendasi di aplikasi ini adalah panduan awal, bukan pengganti dokter, fisioterapis, atau personal trainer.

## Fitur

- Estimasi BMI dan kategori berat badan.
- Estimasi kalori target harian.
- Rekomendasi protein dan air harian.
- Jadwal latihan mingguan sesuai jumlah hari latihan.
- Daftar gerakan prioritas untuk muscle building, strength, atau kesehatan.
- Static Node server dengan endpoint health check `/health` untuk Railway.

## Struktur file

```text
.
├── .github/workflows/ci.yml  # GitHub Actions build check
├── public/                   # File aplikasi yang disajikan ke browser
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── scripts/build.js          # Copy public/ ke dist/ untuk validasi build
├── server.js                 # Static server Node.js
├── railway.json              # Konfigurasi Railway
├── Procfile                  # Alternatif start command platform hosting
├── package.json
└── README.md
```

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## Build produksi

```bash
npm run build
```

Build akan membuat folder `dist/` dari isi `public/`. Folder `dist/` tidak perlu di-commit karena sudah masuk `.gitignore`.

## Upload ke GitHub

Jika repository GitHub belum dibuat:

```bash
git init
git add .
git commit -m "Initial workout planner app"
git branch -M main
git remote add origin https://github.com/USERNAME/latihan-berat-app.git
git push -u origin main
```

Jika repository GitHub sudah ada dan remote `origin` sudah diset:

```bash
git add .
git commit -m "Update workout planner app"
git push
```

## Deploy Railway

Aplikasi ini sudah punya `railway.json`. Di Railway:

1. Pilih **New Project**.
2. Pilih **Deploy from GitHub repo**.
3. Pilih repo `latihan-berat-app`.
4. Railway akan menjalankan:
   - Build command: `npm run build`
   - Start command: `npm start`
5. Health check tersedia di `/health`.

## Panduan environment GitHub & Railway

Panduan detail untuk membuat repository GitHub, menyiapkan token/remote, push dari environment Codex, dan publish ke Railway tersedia di [`docs/GITHUB_RAILWAY_SETUP.md`](docs/GITHUB_RAILWAY_SETUP.md).

## Environment

Tidak ada environment variable wajib. Railway otomatis menyediakan `PORT`, dan `server.js` sudah membaca `process.env.PORT`.
