---
description: How the "bintang-menjelaskan-bintang" explainer video was built — project paths, assets, scripts, and the final render recipe. Companion to the explainer-video-pipeline skill.
---

## Proyek "kucing-fakta-unik" (aktif, belum selesai)
Path: `D:\General-Letta\All Project In One\Letta-Playground\videos\kucing-fakta-unik\`

**Dua versi script** (penting, jangan tertukar):
- `SCRIPT.md` = v1, 98 frame, hook 8 frame, fakta mulai di 9/24/34/41/48/56/62/67/74/81/87, penutup 94–98
- `SCRIPT-v2.md` = v2 (dipakai sekarang), 97 frame, hook 7 frame, fakta mulai di 8/23/32/39/46/54/60/65/72/79/85, penutup 92–97. Natural punctuation untuk TTS.
- Gambar v1 (39 PNG) di-backup di `assets/img-v1-backup/` — dinomori menurut v1. Untuk render v2, gambar dipetakan ulang per-scene via `remap-images.cjs`.

**Perbaikan diterapkan user**:
- Jeda antar frame: 0.4s (BUKAN 1s — TTS sudah punya trailing silence ~0.5s, jadi 1s terasa 1.5s+). GAP ada di gen-storyboard.cjs, make-trimmed.cjs, gen-caption-groups.cjs.
- Frame hero = gambar BERSIH, tanpa accent bar/dot (repetitif kalau tiap frame). Hanya judul fakta/hook/penutup yang punya teks besar. Di gen-frame-defs.cjs (else branch elements=[]).
- Script v2 lebih natural, variasi pembuka (tidak "Coba bayangin deh" berulang), ellipsis untuk jeda dramatis.

**Status render** (per 2026-09-10): `renders/kucing-v2-seg1.mp4` = 30 frame (hook+Fakta1+Fakta2 awal), 160s, TTS v2, jeda 0.4s, assessment 10/10. SEGMEN INI SUDAH SELESAI dan bagus.

**KEPUTUSAN (user, 2026-09-10): regenerate SEMUA 97 gambar dengan gaya CHIBI baru** (user kasih referensi gambar chibi kucing oranye: mata besar glossy, outline hitam tebal, blush, pastel). Gambar lama gaya realistis (39 PNG) dipindah ke `assets/img-v1-backup/`, `assets/img/` dikosongkan untuk chibi. Style anchor chibi sudah terpasang di gen-image-prompts.cjs (97 prompts, 3 batch: 33/33/31). JANGAN campur gaya lama+baru — video harus satu gaya.

**Voice (sonic-3.6, 2026-09-10)**: script bersih kata ulang (guling-guling→berguling, tiba-tiba→mendadak, dll), serious tone (tanda seru jarang), `generation_config: { speed: 1.1 }` di generate-audio-v2.cjs. Model id sonic-3.6.

**RESUME saat limit MAI reset (satu tombol)**:
1. `node prepare-full-render.cjs` → TTS 97 (sonic-3.6) + STT + rebuild 97 frame (Cartesia, BUKAN MAI — bisa jalan kapan saja)
2. Generate 97 gambar chibi: `node run-image-batch.cjs gen-config-batch1.json 0`, lalu `... gen-config-batch2.json 33`, `... gen-config-batch3.json 66`
3. `node prepare-full-render.cjs --assemble` → inject + captions + assemble + assessment
4. Render WMI-detached → `renders/kucing-full.mp4`

**Render partial segments**: Testing with partial render (frame 1–30) validates quality before committing to full generation. Saves TTS limits and confirms pipeline correctness. Use when TTS/API quotas are constrained.

**Hard-won fixes**:
- Image generator loop bug: subagent menulis `gen-orchestrator.cjs` yang relaunch browser per gambar. generate.js asli sudah benar (satu browser loop semua prompt). Solusi: jalankan generate.js SEKALI per batch via `run-image-batch.cjs`. Orchestrator sudah dihapus.
- MAI login auto-close: login.js lama hanya save state SEKALI setelah "stabil" → context mati sebelum save. Diperbaiki: save tiap kali login terdeteksi + reopen page on same context jika auto-close.
- captions.mjs membaca `audio_meta.json` voices[].words + frame starts dari STORYBOARD.md (format `## Frame N` + `- duration: Xs`). caption_groups.json adalah OUTPUT debug, bukan input. Jeda antar frame masuk lewat durasi frame (audio+GAP), captions.mjs menghitung offset kumulatif sendiri.
- assess transitions harus exclude `el-captions` (layer overlay, bukan scene) dan pakai toleransi 0.2s untuk floating point.


# bintang-menjelaskan-bintang — build notes

Final video: `renders/video-final-v7.mp4` (28.4 MB, 1m 45s, 1920×1080 @30fps).

## Paths

- Project: `D:\General-Letta\All Project In One\Letta-Playground\videos\bintang-menjelaskan-bintang\`
  (moved from the old `C:\laragon\www\...` — that path is now empty)
- Image generator: `D:\General-Letta\.kilo\agent\playwright-image-generator\`
- faceless-explainer scripts: `C:\Users\USER\.agents\skills\faceless-explainer\scripts\`

## Scripts in project root

- `inject-images.cjs` — image as dimmed **background** (z-0, brightness 0.5),
  flat bg faded to 0.25, motion graphics kept. Idempotent with `remove-images.cjs`.
- `remove-images.cjs` — strips injected CSS/HTML/JS, restores frame.
- `transcribe-words.cjs` — Cartesia STT word timestamps.
- `update-frames.cjs` — frame timing updates.

## Per-frame audio durations (s)

1:9.6, 2:10, 3:12.72, 4:11.44, 5:11.92, 6:12.56, 7:10.56, 8:12.64, 9:11.52, 10:2.48.
Crossfades 0.5s at boundaries. Total 105.44s = 3164 frames @30fps.

## Image mapping (assets/img/frame-NN.png)

01 night sky · 02 star cross-section · 03 H-fusion · 04 nebula · 05 elements ·
06 supernova · 07 human silhouette · 08 sun+earth · 09 star field · 10 twinkling star.

All cropped to 16:9 (`crop=1024:576:0:224,scale=1920:1080`) because the
generator only outputs 1024×1024.

## Final render recipe (what worked)

```powershell
$env:PRODUCER_LOW_MEMORY_MODE = "true"
$env:TMP = $env:TEMP = "D:\hf-temp"
npx hyperframes render --skill=faceless-explainer --quality high --workers 1 --output renders/video.mp4
```

4m 37s, no seam. `--fps 24` was faster but caused a seam — don't use it.

## Mistakes to not repeat

- Hiding all motion graphics so only the image shows → user: "motion grafik
  hilang sepenuhnya". Always keep the frame's own clips visible.
- Small centered image panels with text overlay → user: "Gambar terlalu kecil,
  teks menutupi". Go fullscreen background instead.
- White pill-box captions → user: "caption kurang cantik, background kotak
  putih". Use film-style subtitle (see caption-skin.html).
- Fullscreen image with Ken Burns `scale()` → renderer seam. Keep images static.
- Multi-worker render → disk capture, ~26 GB temp, blows past the 600s Bash cap.
