# General-Letta — Setup & Informasi Proyek

Workspace produksi video explainer Indonesia (HyperFrames + Cartesia TTS) dan
cadangan memori agen **Tutor**. Repo ini private: `github.com/zikaode/General-Letta`.

---

## 1. Prasyarat (install dulu)

| Tool | Versi terpakai | Fungsi |
|---|---|---|
| Node.js | v24.14.1 | menjalankan semua skrip pipeline |
| npm | 11.11.0 | dependency |
| FFmpeg | 9.0.1 | audio/video (crop, concat, mux) — wajib ada di `PATH` |
| FFprobe | (bundel FFmpeg) | inspeksi durasi/stream |
| HyperFrames | 0.8.33 (via `npx`) | komposisi & render frame → video |
| Chrome / Chromium | any | generate gambar (Playwright) + preview caption |

Setelah clone, install dependency Node di root:
```powershell
cd D:\General-Letta
npm install        # memasang playwright (satu-satunya dependency)
```

---

## 2. Struktur repo

```
General-Letta/
├── SETUP.md                  ← file ini
├── package.json              ← dependency: playwright
├── .gitignore                ← mengecualikan video/audio berat & rahasia
└── All Project In One/
    ├── agent-memory-export/  ← snapshot memori agen Tutor (portable backup)
    ├── hyperframes-demo/     ← demo/scratch awal HyperFrames
    └── Letta-Playground/
        └── videos/
            ├── bintang-menjelaskan-bintang/   (selesai — astronomi)
            ├── sel-unit-kehidupan/            (selesai — biologi sel)
            └── kucing-fakta-unik/             (aktif — 97 frame, gaya chibi)
```

Setiap folder proyek video berisi: `SCRIPT*.md`, `STORYBOARD.md`, skrip pipeline
(`generate-audio*.cjs`, `transcribe-words*.cjs`, `gen-frame-defs.cjs`,
`inject-images.cjs`, `assess-composition.cjs`, dll.), `compositions/`, dan `assets/`.

---

## 3. Rahasia & kredensial (TIDAK ikut ter-commit)

Ini sengaja di-`.gitignore` / tidak masuk repo — isi ulang di mesin baru:

- **Cartesia API key** — dipakai `generate-audio*.cjs` (TTS `sonic-3.6`) &
  `transcribe-words*.cjs` (STT `ink-whisper`). Di-hardcode di skrip proyek;
  pindahkan manual atau set sebagai env var lalu sesuaikan skrip.
- **`playwright-state.json`** (session login generator gambar MAI) — berada di
  `.kilo/agent/playwright-image-generator/` (folder `.kilo/` tidak ikut ter-commit).
  Tanpa ini, generate gambar akan minta login ulang di browser.
- **`.letta/`** — pengaturan lokal Letta Code (machine-specific).

> Jangan pernah commit API key atau session-state ke repo.

---

## 4. Pipeline video (ringkas)

Alur tiap proyek (lihat skill `explainer-video-pipeline` di
`agent-memory-export/skills/` untuk detail lengkap + aturan suara/gambar):

1. **Script** — `SCRIPT-vN.md`, satu kalimat per frame. Aturan sonic-3.6:
   kata ulang ditulis dua kata berkutip tanpa hyphen (`"gara gara"`).
2. **TTS** — `node generate-audio-v2.cjs` → `assets/audio/frame-XX.wav`
   (Cartesia `sonic-3.6`, `speed 1.1`, Bahasa Indonesia).
3. **STT** — `node transcribe-words-v2.cjs` → `audio_meta.json` (word timestamps).
4. **Storyboard + frame** — `node make-trimmed.cjs` / `gen-frame-defs.cjs` +
   `build-frames.cjs` → `compositions/frames/*.html`.
5. **Gambar AI** — `node run-image-batch.cjs gen-config-batchN.json <offset>`
   (butuh `playwright-state.json`; gaya chibi via `gen-image-prompts.cjs`).
6. **Inject + caption** — `node inject-images.cjs` lalu `captions.mjs build`
   (skin standar: `.hyperframes/caption-skin.html`).
7. **Assessment** — `node assess-composition.cjs` → skor ≥ 8 sebelum render.
8. **Render** — `npx hyperframes render --skill=faceless-explainer --quality high --workers 1 --output renders/X.mp4`

Output render (`renders/`), audio mentah (`*.wav`), dan binary berat **tidak**
dilacak git — regenerable, jadi repo tetap ramping.

---

## 5. Restore di komputer baru

```powershell
git clone https://github.com/zikaode/General-Letta.git
cd General-Letta
npm install
# isi ulang rahasia: Cartesia API key di skrip proyek + playwright-state.json
# pastikan ffmpeg ada di PATH:  ffmpeg -version
```

Untuk mengembalikan **memori agen** ke agen Letta lain, lihat
`All Project In One/agent-memory-export/README.md`.

---

## 6. GitHub / push

Remote: `origin = https://github.com/zikaode/General-Letta.git` (branch `main`).

> **Catatan push besar:** koneksi ini tidak kuat mengirim satu POST HTTPS >100 MB.
> Push awal dipecah jadi batch kecil (teks dulu, lalu media per ~8–15 MB).
> Untuk perubahan harian yang kecil, `git push` biasa akan lancar. Jika suatu saat
> perlu push banyak file besar sekaligus, pecah jadi beberapa commit dan push bertahap.
