# Cara Menyiapkan Environment GitHub dan Railway

Panduan ini menjelaskan cara membuat environment agar project bisa dipush ke GitHub dan dipublish ke Railway.

## 1. Siapkan repository GitHub

1. Login ke GitHub.
2. Buat repository baru, misalnya `latihan-berat-app`.
3. Jangan centang template tambahan jika project lokal sudah ada.
4. Salin URL repository, contoh:

```text
https://github.com/USERNAME/latihan-berat-app.git
```

## 2. Push dari komputer lokal

Jalankan dari folder project:

```bash
git remote add origin https://github.com/USERNAME/latihan-berat-app.git
git branch -M main
git push -u origin main
```

Jika `origin` sudah ada, ganti URL-nya:

```bash
git remote set-url origin https://github.com/USERNAME/latihan-berat-app.git
git push -u origin main
```

## 3. Jika GitHub meminta login/token

GitHub biasanya tidak menerima password biasa untuk `git push` via HTTPS. Gunakan Personal Access Token (PAT):

1. Buka **GitHub Settings**.
2. Pilih **Developer settings**.
3. Pilih **Personal access tokens**.
4. Buat token baru dengan akses repository.
5. Saat `git push` meminta password, paste token tersebut sebagai password.

Jangan commit token ke repository dan jangan simpan token di file project.

## 4. Push langsung dari Codex / environment agent

Codex bisa push langsung hanya jika environment sudah punya salah satu dari ini:

- Remote GitHub `origin` sudah diset.
- Kredensial GitHub tersedia di environment.
- SSH key atau GitHub token sudah dikonfigurasi.

Cek remote dengan:

```bash
git remote -v
```

Jika output kosong, berarti belum ada remote GitHub. Tambahkan remote seperti langkah nomor 2.

## 5. Publish ke Railway dari GitHub

1. Login ke Railway.
2. Pilih **New Project**.
3. Pilih **Deploy from GitHub repo**.
4. Hubungkan akun GitHub jika diminta.
5. Pilih repository `latihan-berat-app`.
6. Railway akan membaca `railway.json` dan menjalankan:
   - Build command: `npm run build`
   - Start command: `npm start`
7. Setelah deploy selesai, buka domain Railway yang diberikan.

## 6. Environment variable Railway

Project ini tidak butuh environment variable wajib. Railway otomatis memberi `PORT`, dan server sudah membaca `process.env.PORT`.

Jika nanti ingin menambahkan variabel seperti API key, simpan di Railway melalui menu **Variables**, bukan di file project.

## 7. Checklist sebelum push

Jalankan:

```bash
npm ci
npm run build
git status
```

Pastikan `git status` hanya menampilkan file yang memang ingin dicommit, lalu:

```bash
git add .
git commit -m "Prepare app for deployment"
git push
```
