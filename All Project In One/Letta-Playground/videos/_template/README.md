# _template — Starter Video Project

Salin folder ini untuk membuat video explainer baru:
`Copy-Item -Recurse .\videos\_template .\videos\<nama-project-baru>`

## Isi
- `generate-audio-v2.cjs` — TTS Cartesia sonic-3.6 (Bahasa Indonesia, speed 1.1)
- `transcribe-words-v2.cjs` — STT ink-whisper → `audio_meta.json` (word timestamps)
- `gen-storyboard.cjs` / `gen-durations.cjs` — STORYBOARD.md + durasi (gap 0.4s)
- `gen-frame-defs.cjs` / `build-frames.cjs` — frame HTML dari defs
- `gen-image-prompts.cjs` — prompt gambar (ganti style anchor per project)
- `run-image-batch.cjs` / `process-images.cjs` — batch generate + crop 16:9
- `inject-images.cjs` / `remove-images.cjs` — gambar sebagai background dimmed
- `gen-caption-groups.cjs` — grup kata caption
- `assess-composition.cjs` — quality gate visual (threshold ≥ 8)
- `prepare-full-render.cjs` — one-button resume render penuh
- `.hyperframes/caption-skin.html` — skin caption standar (semi-dark pill,
  active word karaoke coral, Inter 700). Edit file ini untuk restyle semua video.
- `hyperframes.json`, `package.json` — config

## Yang HARUS diisi per project baru
1. `SCRIPT.md` — satu kalimat per frame, format `N. teks`. Aturan:
   kata ulang dua kata berkutip tanpa hyphen (`"gara gara"`).
2. Style anchor di `gen-image-prompts.cjs` — gaya hand-drawn brush + stickman
   (lihat skill `explainer-video-pipeline` §2.5) atau gaya lain sesuai project.
3. `NUM_FRAMES` / frame count di script jika hardcoded — sesuaikan.
4. Cartesia API key di `generate-audio-v2.cjs` + `transcribe-words-v2.cjs`.
5. Brand tokens (warna accent/ink) di `compositions/frame.md` — dipakai caption skin.

## Urutan kerja (ringkas)
1. Tulis SCRIPT.md → user review
2. **Audio gate**: spot-check TTS 3–5 baris berisiko dulu (skill §1.5)
3. Full TTS → STT → storyboard → frames → gambar (batch 30–35) → inject → captions
4. Assessment ≥ 8 → render (WMI-detached, workers 1) → BGM mix (skill §6.5)
5. Log ke registry: `node pipeline\track.cjs project add <slug> ...`

Lihat skill `explainer-video-pipeline` (memori agen Tutor) untuk detail
lengkap + tabel troubleshooting.
