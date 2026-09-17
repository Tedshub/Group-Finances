---
name: claymorphism-ui
description: Panduan gaya desain Claymorphism UI (permukaan lembut, bayangan ganda, warna pastel, elemen 3D playful) untuk membangun website atau aplikasi. Gunakan skill ini setiap kali user meminta desain dengan gaya "claymorphism", "clay ui", "soft UI 3D", "playful pastel dashboard", atau menunjukkan referensi visual dengan kartu melengkung, bayangan lembut ganda, dan ikon 3D bulat seperti roket/kalender/ceklis. Cocok untuk landing page, dashboard, aplikasi mobile, dan onboarding screen bergaya ramah dan modern.
---

# Claymorphism UI Design Skill

Panduan ini merangkum sistem desain **Claymorphism** — gaya UI yang membuat elemen terlihat seperti dibentuk dari tanah liat (clay) lembut: permukaan membulat, bayangan ganda (terang + gelap) yang memberi kesan timbul/tenggelam, dan palet warna pastel yang hangat. Referensi visual: layar onboarding, dashboard planner, dan kalender dengan ikon 3D (roket, kalender, grafik).

Gunakan panduan ini sebagai **resep desain**, bukan aturan kaku — sesuaikan palet warna dengan brief spesifik user, tapi pertahankan prinsip inti: permukaan lembut, kedalaman halus, warna pastel, elemen 3D, dan nuansa ramah.

## 5 Prinsip Inti

1. **Soft Surfaces** — permukaan halus dan terasa mudah didekati (approachable). Tidak ada sudut tajam sama sekali.
2. **Subtle Depth** — bayangan lembut dan highlight yang memberi kedalaman tanpa terasa berat/keras.
3. **Pastel Colors** — palet warna tenang dan modern, saturasi sedang-rendah, tidak neon.
4. **3D-like Elements** — objek/ikon dengan gradasi dan highlight yang terasa dimensional dan playful, bukan flat icon biasa.
5. **Friendly Vibes** — keseluruhan desain terasa hangat dan mengundang, bukan korporat/dingin.

## Palet Warna

Base warna diambil dari referensi: latar lavender pucat dengan aksen biru/ungu, dan aksen kontras pastel untuk kategori/status.

```css
:root {
  /* Background */
  --clay-bg: #E7E9FA;        /* lavender pucat, latar utama */
  --clay-surface: #F5F6FC;   /* permukaan kartu netral */
  --clay-white: #FFFFFF;     /* kartu terang/highlight */

  /* Primary accent (biru — CTA, elemen utama) */
  --clay-blue: #5B7FF0;
  --clay-blue-light: #8FA6F5;
  --clay-blue-dark: #4A68CC;

  /* Secondary accents (kategori/status) */
  --clay-purple: #8C7EF0;    /* Design / Work */
  --clay-yellow: #FDBB4E;    /* Meeting / warning */
  --clay-coral: #FF6B7A;     /* Date / urgent */
  --clay-teal: #4FD1C5;      /* Sports / success */

  /* Text */
  --clay-text-dark: #2B2B3D;
  --clay-text-muted: #8B8FA8;

  /* Shadow pair (kunci efek clay) */
  --clay-shadow-dark: rgba(163, 177, 227, 0.55);
  --clay-shadow-light: rgba(255, 255, 255, 0.85);
}
```

Aturan pakai warna:
- Latar selalu pastel netral (lavender/abu kebiruan sangat muda) — jangan putih polos, jangan gelap.
- Satu warna aksen primer (biasanya biru) untuk CTA dan elemen paling penting.
- 3–4 warna aksen sekunder untuk membedakan kategori (badge, tag, progress bar) — masing-masing pastel jenuh sedang, bukan neon.
- Teks utama hampir hitam tapi bukan `#000` murni (pakai `--clay-text-dark`), teks sekunder abu keunguan lembut.

## Sistem Bayangan (jantung dari efek Clay)

Efek clay dibuat dari **dua bayangan berlawanan arah**: satu gelap (bawah-kanan, seolah cahaya dari atas-kiri) dan satu terang (atas-kiri, sebagai highlight). Ini yang membuat elemen terasa "timbul" dari latar seperti dibentuk tangan.

```css
/* Elemen "terangkat" (default: kartu, tombol, ikon) */
.clay-raised {
  background: var(--clay-surface);
  border-radius: 24px;
  box-shadow:
    8px 8px 16px var(--clay-shadow-dark),
    -8px -8px 16px var(--clay-shadow-light);
}

/* Elemen "ditekan" (state aktif, input field, tab terpilih) */
.clay-pressed {
  background: var(--clay-surface);
  border-radius: 24px;
  box-shadow:
    inset 6px 6px 12px var(--clay-shadow-dark),
    inset -6px -6px 12px var(--clay-shadow-light);
}

/* Elemen kecil (badge, icon chip) — bayangan lebih tipis */
.clay-chip {
  border-radius: 16px;
  box-shadow:
    4px 4px 8px var(--clay-shadow-dark),
    -4px -4px 8px var(--clay-shadow-light);
}

/* Floating action button — bayangan lebih tebal + sedikit glow warna */
.clay-fab {
  border-radius: 50%;
  box-shadow:
    6px 6px 14px var(--clay-shadow-dark),
    -6px -6px 14px var(--clay-shadow-light),
    0 4px 12px rgba(91, 127, 240, 0.35);
}
```

Aturan penting:
- Jangan pernah pakai bayangan satu arah biasa (`box-shadow: 0 4px 10px rgba(0,0,0,.2)`) — itu flat/material design, bukan clay.
- Arah cahaya harus konsisten di seluruh halaman (biasanya dari kiri-atas).
- Elemen yang lebih "penting" (FAB, kartu hero) dapat bayangan lebih tebal/jauh; elemen kecil (badge) dapat bayangan tipis.
- Untuk state hover, kurangi jarak/blur bayangan sedikit agar elemen terasa "turun" mendekat.

## Radius & Spacing

- Border-radius besar dan konsisten: kartu besar `24–32px`, tombol/pill `9999px` (full-round) atau `16–20px`, ikon chip `16–20px`.
- Tidak ada elemen bersudut tajam sama sekali — bahkan navigasi bawah dan search bar full-rounded.
- Spacing lapang: padding kartu `20–28px`, gap antar kartu `16–20px`. Clay butuh ruang bernapas agar bayangan lembutnya terlihat.

## Tipografi

- Sans-serif geometris/rounded yang ramah: contoh **Poppins, Quicksand, Nunito, Inter, atau SF Rounded**. Hindari serif atau font tajam/kaku.
- Heading tebal (600–700), ukuran besar dan hangat, bukan bombastis.
- Body text medium-weight, warna `--clay-text-muted`, ukuran nyaman dibaca (15–16px).
- Angka besar (tanggal, statistik) boleh sangat besar dan bold sebagai focal point kartu (lihat kalender "18" di referensi).

## Pola Komponen Umum

**Kartu/Card**: `.clay-raised` + ikon 3D di pojok kiri (dalam chip kecil berwarna pastel) + judul + deskripsi singkat.

**Navigasi bawah (mobile)**: pill horizontal `clay-raised` berisi 2–3 ikon, dengan satu tombol aksi bulat (`clay-fab`) yang sedikit menonjol/overlap ke atas dari pill.

**Kalender/date picker**: sel tanggal berbentuk rounded-square, tanggal aktif memakai `.clay-pressed` atau warna solid dengan bayangan clay di dalam kartu besar `.clay-raised`.

**Progress bar/timeline**: batang horizontal rounded-full, dengan blok warna pastel per kategori dan panjang proporsional terhadap durasi — bukan gradient tajam.

**Badge/tag kategori**: pill kecil `.clay-chip` dengan warna solid pastel + ikon/emoji kecil (mis. 🎨 Work, 🎯 Leisure).

**Ikon**: gunakan ilustrasi 3D bergaya "clay/soft" (bentuk membulat, gradasi halus, highlight lembut) — bukan line-icon flat. Jika tidak ada aset 3D, simulasikan dengan ikon dalam chip bulat berwarna pastel + sedikit gradient radial untuk kesan volume.

## ASCII Wireframe Referensi (mobile dashboard)

```
┌─────────────────────────┐
│  Nama User        🔔    │  <- header, avatar/notif clay-chip
│  ┌─────────────────────┐│
│  │ 🔍 Search...        ││  <- clay-pressed search bar
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │  < Bulan >           ││
│  │  [ grid kalender ]   ││  <- clay-raised card besar
│  │  ● tanggal aktif      ││
│  └─────────────────────┘│
│  Aktivitas      See all  │
│  🎨 Work   🏖 Leisure     │  <- clay-chip list
│  ┌───┐  ┌───┐  ┌───┐    │
│  🏠   ➕   📅            │  <- bottom nav pill + FAB
└─────────────────────────┘
```

## Do's & Don'ts

**Do:**
- Bayangan ganda (terang + gelap) di setiap elemen "raised".
- Palet pastel lembut dengan satu aksen biru/ungu dominan.
- Border-radius besar & konsisten di semua elemen.
- Ikon/ilustrasi 3D playful sebagai focal point (hero, empty state).
- Ruang lapang antar elemen agar bayangan lembut tetap terbaca.

**Don't:**
- Jangan pakai bayangan satu arah / drop-shadow keras khas material design.
- Jangan pakai warna neon jenuh tinggi atau kontras hitam pekat.
- Jangan pakai sudut tajam atau border tegas (hindari `border: 1px solid #000`).
- Jangan campur dengan gaya glassmorphism (blur transparan) — clay itu solid & buram, bukan tembus pandang.
- Jangan terlalu banyak bayangan bertumpuk di elemen kecil — bikin berat secara visual.

## Saat Membangun UI Nyata (HTML/React)

Ikuti juga skill `frontend-design` untuk prinsip tipografi, hierarki, dan proses eksplorasi desain secara umum. Skill ini (`claymorphism-ui`) menentukan *bahasa visual* (warna, bayangan, bentuk); `frontend-design` menentukan *proses* (brief → token plan → kritik → build). Gabungkan keduanya: pakai token warna/bayangan clay di atas, tapi tetap lakukan brainstorm layout & signature element sesuai brief spesifik user agar hasilnya tidak generik.

Referensi teknis cepat: gunakan CSS variables di atas sebagai starting point, lalu sesuaikan hex warna aksen dengan brand/brief yang diminta user (mis. jika brief soal aplikasi kesehatan, ganti aksen biru→hijau mint, tapi pertahankan struktur bayangan gandanya).