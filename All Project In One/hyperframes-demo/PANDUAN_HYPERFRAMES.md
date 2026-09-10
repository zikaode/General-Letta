# 🎬 Panduan & Rangkuman Kapabilitas HyperFrames

> **HyperFrames** adalah framework video generasi baru berbasis teknologi web standar (**HTML, CSS, JavaScript, dan GSAP**) yang dikembangkan oleh tim HeyGen. Framework ini memungkinkan developer, desainer, dan AI agent untuk merancang, melihat pratinjau (*preview*), dan merender video berkualitas tinggi (MP4) secara terprogram (*programmatic video generation*).

---

## 📌 Daftar Isi
1. [Prinsip Kerja & Arsitektur Utama](#1-prinsip-kerja--arsitektur-utama)
2. [Apa Saja yang Bisa Dilakukan HyperFrames?](#2-apa-saja-yang-bisa-dilakukan-hyperframes)
3. [Tabel Atribut Kunci (Sintaks Wajib)](#3-tabel-atribut-kunci-sintaks-wajib)
4. [Efek Visual & Animasi yang Didukung](#4-efek-visual--animasi-yang-didukung)
5. [Pengelolaan Audio & Integrasi AI (TTS)](#5-pengelolaan-audio--integrasi-ai-tts)
6. [Fitur Unggulan Studio & Validasi Mutu](#6-fitur-unggulan-studio--validasi-mutu)
7. [Perbandingan: HyperFrames vs Tools Lain](#7-perbandingan-hyperframes-vs-tools-lain)
8. [Lembar Contekan Perintah CLI (Cheat Sheet)](#8-lembar-contekan-perintah-cli-cheat-sheet)

---

## 1. Prinsip Kerja & Arsitektur Utama

Secara arsitektural, HyperFrames bekerja seperti **"Browser Headless yang Mengambil Tangkapan Layar Per Frame"** lalu menggabungkannya dengan audio melalui FFmpeg:

```
[ Kode HTML + CSS + GSAP ] ➔ [ Chrome Headless (BeginFrame API) ] ➔ [ Render Frame-by-Frame ] ➔ [ FFmpeg Muxer ] ➔ [ Video MP4 ]
```

- **Deterministik Penuh:** Tidak mengandalkan *screen recording* realtime. Jika komputer lambat, hasil video tetap mulus 30fps atau 60fps tanpa ada frame yang melompat (*zero dropped frames*).
- **DOM Asli:** Semua elemen di video adalah elemen HTML biasa (`<h1>`, `<div>`, `<img>`, `<video>`, `<svg>`).

---

## 2. Apa Saja yang Bisa Dilakukan HyperFrames?

Berikut adalah rangkuman kapabilitas nyata yang bisa Anda bangun dengan HyperFrames:

### A. Video Explainer & Presentasi Otomatis
- Menjelaskan materi pembelajaran, algoritma, atau konsep teknis dengan animasi terstruktur.
- Pembuatan presentasi otomatis, pitch deck, atau laporan statistik bulanan berbasis data dinamis.

### B. Otomatisasi Konten Media Sosial (Shorts / Reels / TikTok)
- Menghasilkan puluhan video otomatis hanya dengan mengubah teks atau data JSON (misalnya video edukasi, fakta unik, quotes harian).
- Mengubah format rasio aspek dengan mudah: Landscape (16:9), Portrait / Vertikal (9:16), atau Square (1:1).

### C. Pemotongan & Penggabungan Video (*Video Slicing & Montage*)
- Memotong (*trim*) video luar tanpa perlu software editing terpisah via atribut `data-media-start` dan `data-duration`.
- Menggabungkan beberapa klip cuplikan menjadi satu alur montase video utuh.

### D. Motion Graphics & Visualisasi Data
- Animasi penghitung angka langsung (*counter count-up*), grafik batang, dan dial radial.
- Tipografi kinetik (*kinetic typography*) dengan variasi *fade*, *slide*, *elastic bounce*, dan *3D tilt*.

### E. AI Voiceover & Subtitle Generator
- Menggabungkan suara narasi AI (seperti Cartesia TTS, ElevenLabs, OpenAI Audio) dengan takarir/subtitle animasi (*captions*) yang tersinkronisasi presisi per detik.

---

## 3. Tabel Atribut Kunci (Sintaks Wajib)

HyperFrames mengendalikan alur waktu (*timing*) elemen video melalui atribut HTML khusus:

| Atribut | Target Elemen | Fungsi & Kegunaan | Contoh |
| :--- | :--- | :--- | :--- |
| `data-composition-id` | Root container | Menentukan ID unik komposisi video. | `data-composition-id="master"` |
| `data-start` | Semua elemen visual | Detik ke berapa elemen mulai muncul di layar. | `data-start="3.5"` |
| `data-duration` | Semua elemen visual | Durasi (dalam detik) elemen tampil. | `data-duration="5.0"` |
| `data-media-start` | `<video>`, `<audio>` | Titik potong awal (*in-point / offset*) media asli. | `data-media-start="12.0"` |
| `data-volume` | `<audio>`, `<video>` | Gain / kenyaringan suara (0 = mute, 1 = 100%, >1 = boost). | `data-volume="0.3"` |
| `data-composition-src`| `<div>` embed | Memanggil sub-adegan modular dari folder `compositions/`. | `data-composition-src="compositions/intro.html"` |
| `class="clip"` | Elemen berwaktu | Memberi tahu framework bahwa elemen ini adalah klip scene terisolasi. | `<div class="scene clip" ...>` |

---

## 4. Efek Visual & Animasi yang Didukung

Karena berbasis web modern, HyperFrames mendukung hampir **seluruh fitur CSS3, WebGL, dan GSAP**:

1. **CSS 3D Transforms:** Efek kartu 3D, pembalikan 180° (*card flip*), kedalaman sumbu Z (*parallax depth*), dan perspektif kamera sinematik.
2. **Geometric & Clip-Path Masking:** Transisi masker lingkaran (*iris reveal*), pemotong diagonal (*split wipe*), dan bentuk poligon kustom.
3. **Glassmorphism:** Efek kaca buram transparan menggunakan `backdrop-filter: blur(...)` dan batas gradien menyala (*glowing border*).
4. **Organic Shape Morphing:** Perubahan bentuk wadah dinamis melalui manipulasi kurva sudut `border-radius`.
5. **Cyberpunk & Glitch:** Pemisahan warna spektrum RGB (*chromatic aberration*), getaran digital (*jitter*), dan kilatan *neon strobe*.
6. **SVG Stroke Drawing:** Animasi menggambar garis atau ikon secara bertahap menggunakan `stroke-dashoffset`.

---

## 5. Pengelolaan Audio & Integrasi AI (TTS)

- **Multi-Track Layering:** Anda dapat memutar musik latar (*BGM*) bersamaan dengan suara narator (*Voiceover*) dan efek suara transisi (*SFX*) di trek berbeda.
- **Ducking & Muting:** Suara bawaan video dapat dinonaktifkan (`muted`), sementara musik latar diturunkan volumenya saat narator berbicara.
- **Normalisasi Audio (LUFS):** CLI bawaan `npx hyperframes normalize-audio` otomatis menghitung dan menyesuaikan kenyaringan suara standar penyiaran agar tidak pecah (*anti-clipping*).
- **TTS API Integrations:** Sangat kompatibel dengan API suara generatif AI seperti Cartesia (`sonic-3.6`), ElevenLabs, maupun Whisper untuk deteksi transkrip kata.

---

## 6. Fitur Unggulan Studio & Validasi Mutu

HyperFrames bukan sekadar compiler render, tetapi memiliki ekosistem pengembangan yang canggih:

### 1. Browser Live Studio (`npm run dev`)
- Antarmuka visual di `http://localhost:3002` lengkap dengan *timeline scrubber*, *canvas preview*, dan *inspector*.
- Anda dapat menggeser durasi klip langsung di browser, dan perubahannya otomatis tersimpan ke file HTML.

### 2. Quality & Accessibility Linter (`npm run check`)
Sebelum dirender, linter bawaan memeriksa:
- **Lint:** Memastikan sintaks animasi GSAP dan struktur DOM tidak memiliki potensi *stale visibility*.
- **Runtime:** Memeriksa ketersediaan aset media dan kecocokan durasi audio.
- **Contrast (WCAG AA):** Memastikan teks memiliki rasio kontras minimal 4.5:1 terhadap latar belakang agar selalu nyaman dibaca.
- **Layout & Motion:** Mendeteksi overflow dan pergerakan elemen yang keluar batas.

---

## 7. Perbandingan: HyperFrames vs Tools Lain

| Parameter | Adobe Premiere / After Effects | Remotion (React) | **HyperFrames** |
| :--- | :--- | :--- | :--- |
| **Bahasa Utama** | GUI Manual / ExtendScript | TypeScript / React | **HTML, CSS, JS murni, GSAP** |
| **Kompatibilitas AI** | Sulit diotomatisasi AI agent | Baik, namun perlu build React | **Sangat Ramah AI (Zero-build HTML murni)** |
| **Live Visual Studio** | Ya (Software desktop berat) | Pemutar web lokal | **Studio Web interaktif bawaan (`npm run dev`)** |
| **Kecepatan Iterasi** | Lambat (Perlu render manual) | Perlu compile bundler | **Instan (Cukup refresh file HTML)** |
| **Kebutuhan Sistem** | RAM/GPU sangat tinggi | Node.js + NPM | **Ringan (Dapat berjalan di PC standar)** |

---

## 8. Lembar Contekan Perintah CLI (Cheat Sheet)

Jalankan perintah ini di dalam folder proyek Anda:

```bash
# 1. Menjalankan Visual Studio Live Preview di Browser
npm run dev
# Buka di: http://localhost:3002

# 2. Memeriksa Integritas, Animasi, dan Kontras Video (Linter)
npm run check

# 3. Merender Video ke Format MP4 (Menggunakan Profile Aman RAM)
npx hyperframes render -o renders/output.mp4 --low-memory-mode

# 4. Merender Komposisi Tertentu Saja
npx hyperframes render -c ./compositions/nama-file.html -o renders/output.mp4

# 5. Melihat Daftar Komposisi yang Ada
npx hyperframes compositions

# 6. Memeriksa Kesiapan Dependensi Sistem (Chrome, FFmpeg, Node.js)
npx hyperframes doctor

# 7. Membaca Dokumentasi Bawaan di Terminal
npx hyperframes docs data-attributes
npx hyperframes docs gsap
npx hyperframes docs rendering
```

---

*Dokumen ini dibuat otomatis sebagai panduan referensi lengkap penggunaan HyperFrames di proyek Anda.*
