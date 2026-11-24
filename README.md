# Weight Training Agent (MVP)

Aplikasi web (bisa dibuka di HP) untuk latihan beban:

- **Perpustakaan latihan**: 876 latihan dengan demo gerakan beranimasi (posisi awal ⇄ akhir), tombol video tutorial YouTube, instruksi, alat, dan otot yang dilatih. Bisa cari dan filter per otot, alat, dan level.
- **Peta otot**: otot utama dan pendukung diwarnai di gambar tubuh depan/belakang. Di beranda jadi heatmap jumlah set per otot minggu ini.
- **Program**: Full Body Pemula (3x/minggu, dumbel) dan Upper/Lower Menengah (4x/minggu, gym).
- **Log workout**: catat beban, repetisi, dan centang set. Ada timer istirahat dan estimasi 1RM.
- **Progressive overload otomatis**: beban sesi berikutnya diisi dari riwayat (naik kalau semua set tuntas, tahan kalau belum, deload 10% kalau gagal 2x berturut-turut).
- **AI Coach**: chat berbahasa Indonesia yang membaca profil dan riwayat latihan kamu. Pakai Claude kalau `ANTHROPIC_API_KEY` diset; kalau tidak, pakai coach offline berbasis aturan.

Data latihan pengguna di versi ini disimpan di browser (localStorage). Bisa diekspor ke JSON dari halaman Riwayat.

## Coba langsung (tanpa install)

Buka **https://hafidbudiman-wq.github.io/latihan-berat-app/** di HP atau laptop.

Versi ini dibangun otomatis oleh GitHub Actions (`.github/workflows/pages.yml`) setiap ada push ke `main`. Karena GitHub Pages tidak punya server, AI coach di sana jalan mode offline (berbasis aturan). Semua fitur lain sama.

## Menjalankan di komputer

```bash
npm install
cp .env.example .env.local   # opsional: isi ANTHROPIC_API_KEY untuk AI coach
npm run dev                  # buka http://localhost:3000
```

Perintah lain: `NEXT_PUBLIC_STATIC_EXPORT=1 npm run build` (build statis ke folder `out/`, hapus dulu `app/api`), `npm test` (unit test logika progresi & coach), `npm run typecheck`, `npm run build`, `npm run import:exercises` (unduh ulang dataset latihan).

Variabel lingkungan:

| Nama | Wajib | Keterangan |
|---|---|---|
| `ANTHROPIC_API_KEY` | Tidak | Mengaktifkan AI coach. Tanpa ini coach jalan offline. |
| `COACH_MODEL` | Tidak | Model Claude untuk coach. Default `claude-opus-5-5`. |

## Struktur

```
app/            halaman (Next.js App Router) + API /api/coach, /api/exercises
components/     Nav, BodyMap (peta otot), ExercisePicker, tombol mulai/tambah sesi
lib/            logika: progression.ts, coach.ts, programs.ts, muscles.ts, storage.ts
data/           exercises.json (dari free-exercise-db)
scripts/        import-exercises.mjs
cmrp-trainer/   (proyek lain yang sudah ada sebelumnya, tidak diubah)
```

## Rencana berikutnya (setelah review)

1. Login + database (mis. Supabase/Postgres) supaya data tersinkron antar perangkat.
2. Video demo gerakan dan tampilan 3D otot (referensi: Fitness-OS).
3. Cek form lewat kamera dengan MediaPipe Pose.
4. Terjemahan instruksi latihan ke Bahasa Indonesia.
5. PWA (bisa di-install di Android) dan deploy.

## Sumber open source

Lihat [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
