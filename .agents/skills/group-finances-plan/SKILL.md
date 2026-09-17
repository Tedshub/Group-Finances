---
name: group-finances-plan
description: Rencana implementasi fitur Tabungan (Savings), Penganggaran (Budgeting), Laporan Keuangan (Statements), dan Pengaturan (Settings) untuk aplikasi Group Finances.
---

# Implementation Plan: Group Finances Roadmap

Rencana implementasi esensial untuk 4 fitur utama pada aplikasi Group Finances: **Tabungan**, **Penganggaran**, **Laporan Keuangan**, dan **Pengaturan**.

---

## 1. Fitur Tabungan (`/savings`)
> **Tujuan:** Membantu anggota grup mengumpulkan dana bersama untuk target tertentu (misal: liburan, kas darurat, qurban, proyek bersama).

### Fitur Utama:
1. **Target Tabungan (Savings Goals):**
   - Nama target tabungan, deskripsi singkat, nominal target (Rp), tanggal deadline, dan ikon/warna badge.
   - Pilihan cakupan: Tabungan Grup (bersama) atau Tabungan Pribadi.
2. **Progress & Milestone Tracker:**
   - Visual progress bar persentase terkumpul, sisa dana yang dibutuhkan, dan hitungan mundur hari menuju target.
3. **Setor Dana (Deposit Tabungan):**
   - Form input setoran dana oleh anggota.
   - Otomatis mencatat transaksi pemasukan/alokasi khusus tabungan.
4. **Riwayat Kontribusi Anggota:**
   - Daftar riwayat siapa saja anggota yang sudah menyetor, nominal, dan tanggal setoran.
5. **Pencairan / Selesai (Withdraw / Complete):**
   - Tombol tutup target tabungan jika target telah tercapai atau ditarik untuk keperluan grup.

### Kebutuhan Database Ringkas:
- Tabel `savings_goals`: `id`, `relation_id`, `created_by`, `title`, `target_amount`, `current_amount`, `deadline`, `status` (`active`, `completed`, `cancelled`).
- Tabel `savings_contributions`: `id`, `savings_goal_id`, `user_id`, `amount`, `note`, `date`.

---

## 2. Fitur Penganggaran (`/budgeting` / `/saving-goals`)
> **Tujuan:** Mengontrol dan membatasi pengeluaran grup per kategori per periode (bulanan) agar keuangan tetap sehat dan tidak defisit.

### Fitur Utama:
1. **Alokasi Anggaran Bulanan per Kategori:**
   - Menetapkan plafon maksimal pengeluaran untuk setiap kategori (misal: Makan & Minum Rp 2.500.000, Tagihan/Listrik Rp 800.000, Transportasi Rp 500.000).
2. **Monitoring Real-time (Budget Meter):**
   - Perbandingan antara **Anggaran Direncanakan** vs **Realisasi Pengeluaran Aktual** (diambil otomatis dari tabel `transactions`).
3. **Indikator Status (Alerts Neo-Brutalist):**
   - **Aman (< 70%):** Bar hijau/kuning.
   - **Waspada (70% - 90%):** Bar oranye, peringatan sisa budget menipis.
   - **Overbudget (> 100%):** Bar merah mencolok dengan badge peringatan kelebihan pengeluaran.
4. **Ringkasan & Evaluasi Periode:**
   - Pemilih bulan/tahun (selector periode).
   - Total budget keseluruhan vs total terpakai dan sisa kuota belanja grup.

### Kebutuhan Database Ringkas:
- Tabel `budgets`: `id`, `relation_id`, `category_id`, `amount` (plafon), `month` (1-12), `year` (YYYY).

---

## 3. Fitur Laporan Keuangan (`/statements` / `/reports`)
> **Tujuan:** Menyajikan transparansi arus kas, analisis analitik, dan arsip audit yang dapat diunduh oleh semua anggota.

### Fitur Utama:
1. **Ringkasan Arus Kas (Cash Flow Summary):**
   - Kartu metrik: Total Pemasukan Bersih, Total Pengeluaran, Surplus/Defisit Periode, dan Saldo Kumulatif.
   - Filter rentang waktu: Hari Ini, Bulan Ini, 3 Bulan Terakhir, Tahun Ini, atau Custom Range tanggal.
2. **Grafik Visual & Distribusi Pengeluaran:**
   - Donut/Pie Chart: Proporsi pengeluaran berdasarkan kategori.
   - Bar/Line Chart: Tren fluktuasi pemasukan dan pengeluaran per minggu/bulan.
3. **Peringkat & Kontribusi Anggota (Member Breakdown):**
   - Tabel transparansi siapa anggota yang paling banyak mengeluarkan uang untuk keperluan grup dan siapa yang paling banyak mencatat pemasukan.
4. **Export Laporan (Unduh Data):**
   - **Export PDF:** Lembar rekapitulasi laporan resmi dengan kop grup keuangan.
   - **Export Excel / CSV:** Data mentah transaksi lengkap untuk keperluan pembukuan spreadsheet.

### Kebutuhan Backend Ringkas:
- Controller query agregasi (`DB::raw` grouping by category & month).
- Library export: `barryvdh/laravel-dompdf` (PDF) & `maatwebsite/excel` (Excel/CSV).

---

## 4. Fitur Pengaturan (`/settings`)
> **Tujuan:** Pusat konfigurasi akun pribadi, manajemen grup hubungan, dan preferensi sistem.

### Fitur Utama:
1. **Pengaturan Akun & Keamanan (Profile Settings):**
   - Ubah nama profil, email, foto profil/avatar inisial.
   - Ubah password & autentikasi.
2. **Preferensi Hubungan Keuangan (Relation Settings):**
   - Ubah nama hubungan dan deskripsi grup.
   - **Regenerate Kode Undangan:** Buat kode undangan baru jika kode lama bocor/ingin diganti.
   - **Atur Hak Akses Anggota:** Menentukan apakah anggota biasa boleh menambah/edit kategori atau hanya owner.
3. **Manajemen Kategori Kustom:**
   - Tambah, edit, dan nonaktifkan kategori pemasukan & pengeluaran khusus untuk grup tersebut (selain kategori default).
4. **Notifikasi & Notifikasi Chat:**
   - Toggle notifikasi saat ada transaksi baru dicatat anggota lain.
   - Toggle peringatan saat anggaran kategori mencapai batas 90%.

### Kebutuhan Database Ringkas:
- Tabel `categories`: Tambahkan kolom `relation_id` (nullable, jika null = kategori global, jika ada relation_id = custom category grup).
- Kolom preferensi di tabel `user_relation` atau `relations`: `settings` (JSON) untuk opsi toggle.

---

## Roadmap Urutan Pengerjaan yang Direkomendasikan:
1. **Tahap 1 - Pengaturan (`/settings`):** Sebagai pondasi personalisasi grup dan manajemen kategori kustom.
2. **Tahap 2 - Tabungan (`/savings`):** Fitur paling sering diminta untuk kolaborasi dana bersama.
3. **Tahap 3 - Penganggaran (`/saving-goals`):** Mengikat kategori transaksi yang sudah ada dengan batas kuota belanja.
4. **Tahap 4 - Laporan Keuangan (`/statements`):** Mengagregasikan seluruh data transaksi, tabungan, dan anggaran ke dalam grafik dan file export.
