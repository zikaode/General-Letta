---
description: User's technical environment and platform setup, including tools, infrastructure, and architecture
---

# Technical Environment

## Platform
- **OS**: Windows (PowerShell as primary shell)
- **RAM**: ~8 GB (machine enters low-memory mode during heavy tasks)
- **Node.js**: Used with ES modules (type: module in package.json)
- **FFmpeg**: Installed via npm (v9.0.1, gyan.dev build)
- **Web server**: Laragon

## Letta Architecture
- **Two-agent setup**: Cloud agent (Tutor, on api.letta.com) and Local agent (Letta Code, running on local backend)
- Cloud agent memory stored on Letta Cloud
- Local agent memory stored on local machine
- Agent picker shows both agents; switching between them does NOT share memory
- letta CLI commands query both cloud and local backends

## API / Integration Notes
- Cartesia TTS API:
  - Uses Authorization: Bearer header (NOT X-API-Key)
  - Requires Cartesia-Version header (e.g., 2026-03-01)
  - Model: sonic-3.6 or sonic-3.5
  - Voice parameter: voice.id (string ID, not object)
  - Output format: container wav, encoding pcm_s16, sample_rate 44100
  - PowerShell struggles with nested JSON quotes -- use Node.js for complex API calls
- Cartesia STT API (for word-level timestamping):
  - Endpoint: POST `/stt` (NOT `/stt/transcribe` — returns 404)
  - Use for transcription-based caption timing instead of synthetic TTS timings
- No letta secrets CLI subcommand -- use .env files for keys (local only)
- BGM alternatives (when HeyGen not available):
  - OpenGameArt.org (CC0 ambient/space tracks, e.g. "Space Graveyard")
  - Wikimedia Commons audio files

## Known Issues & Workarounds (learned 2026-09-09 to 2026-09-10)
- **Subagent orchestrator loop bug (CRITICAL, 2026-09-10)**: Subagents can create their own orchestrator scripts that restart generate.js once per image instead of running the whole batch. Symptoms: many browser windows opening, login retries, wasted MAI rate limits, massive slowdowns. Always verify subagent behavior before deploying -- check that they use existing scripts directly, not wrappers. Fix: remove rogue orchestrators (kill processes + delete files), use run-image-batch.cjs launcher (one browser, one run, all prompts).
- **MAI login session management (2026-09-10)**: MAI Image (Microsoft AI) login via auto-close browser windows does not reliably save playwright-state.json. Cookie auth expires and generator asks for re-login every run. Fix: improve login.js to save state on every detected login (not just when stable), use aggressive polling. Give user time to manually log in.
- **MAI rate limits**: MAI-Image-2.6 has image generation rate limits. During a 98-frame project, hit limit mid-generation (~39/98 images). Mitigation: render available segments independently while waiting, batch remaining images after limit reset, use run-image-batch.cjs to avoid wasting limits on loops.
- **Stale HTML conflict after script version changes (2026-09-10)**: When moving from script v1→v2, frame numbering shifts. Old build-frames writes files with v1 names (e.g., "08-udah-santai-aja.html"), but v2 expects different names (e.g., "08-fakta-pertama-ya.html"). These stale files persist and conflict with v2 numbering. Fix: fully clean frames/ directory before rebuild when switching scripts. Always regenerate frame-defs from the new script version.
- **playwright-image-generator requires `headless: false`**: Setting `headless: true` causes ALL images to fail ("No valid image captured"). Always use `headless: false` — a visible browser window opens but renders work.
- **PowerShell Set-Content UTF-8 BOM**: `Set-Content -Encoding UTF8` writes a BOM prefix that breaks JSON parsers. Fix: use Node.js `fs.writeFileSync` without BOM, or `Write-Output | Out-File -Encoding ASCII`.
- **HyperFrames `check` false positives**: Navigation timeout at t=0s on index.html (font/image loading, JS errors) — doesn't always prevent successful render. Assessment loop can score visual quality independently of `check` exit code.
- **Long task management on Windows**: Bash tool caps at 600s. For tasks exceeding this (image generation: 20-36 min, render: 8-16 min), use `Start-Process` with detached processes and file-based monitoring (check run dirs, log files, output files).

## Faceless Explainer Pipeline (HyperFrames)
- Uses `faceless-explainer` skill under `~/.agents/skills/faceless-explainer/`
- Workflow: Step 0 setup → Step 1 brief → Step 2 design → Step 3 storyboard → Step 3.1 audio → Step 4 visual design → Step 5 frames → Step 6 render
- Critical: `audio.mjs sync-durations` MUST run after TTS generation, before frame building — skips this and frame durations won't match actual audio length (causes out-of-sync video)
- `audio.mjs` handles: TTS narration, word timings, BGM lookup, duration syncing
- Captions: `captions.mjs build` uses `audio_meta.json` + `STORYBOARD.md` + caption skin
- Assembly: `assemble-index.mjs` → `transitions` (inject/check) → render
- Frame worker: dispatched per-frame via `frame-packets.mjs`

## Video Project Stack
- **bintang-menjelaskan-bintang** (astronomy): 10 frames, 1m45s, Coral preset, Wikimedia SVGs
- **sel-unit-kehidupan** (biology): 18 frames, ~4 min, Coral palette, AI-generated cell illustrations
- **kucing-fakta-unik** (cat facts): 97 frames, ~10 min, orange tabby cat character, image-hero + fact-title design, 0.4s explicit jeda (TTS adds trailing silence), script v2 with natural conversational Indonesian
- **Clean-image-hero design** (learned 2026-09-10): Image-hero frames use plain images as background only, WITHOUT accent bars or decorative motion graphics. Graphics keep only on title frames (fact titles, hook, closing) where large text needs framing. Removes template feel — images stand on their own. Implemented by setting elements=[] in gen-frame-defs.cjs for hero frames.
- Common tools: captions.mjs, assemble-index.mjs, audio.mjs, transitions.mjs
- Frame-keyed audio structure (audio_meta.json)
- Uses Cartesia TTS (sonic-3.6 or sonic-3.5) for Indonesian voiceover
- Uses Kokoro (offline fallback, voice: am_michael)
- Renders to renders/ directory
- **BGM**: CC0 tracks from OpenGameArt when HeyGen unavailable
- **Visual assets**: Wikimedia Commons SVGs (astronomy/science) + MAI-Image-2.6 AI images (cell organelles)
- **Word-level captions**: Cartesia STT (`/stt` endpoint) for real transcription timestamps
- **Render warnings**: `escaped_container` and `missing editable id` from hyperframes are non-fatal

## Caption system (learned 2026-09-10)
- `caption_groups.json` is an **OUTPUT debug file**, NOT input. `captions.mjs` calculates groups itself from `audio_meta.json` voices[].words using frame starts derived from STORYBOARD.md.
- When `captions.mjs` reports "no usable words", the issue is almost always STORYBOARD.md format — it must have frontmatter `format: 1920x1080` + per-frame `## Frame N — title` sections with `- duration: Xs`.
- Frame starts come from parsing STORYBOARD frame durations cumulatively. If STORYBOARD has no frames (or empty `manifest.frames`), base is null and captions fail silently.
- Caption groups are 3–4 word phrases, NOT per-frame text blocks.

## Render monitoring (learned 2026-09-10)
- WMI render launching (`Invoke-CimMethod Win32_Process Create`) produces fully detached processes that survive launcher timeouts.
- Clean monitor approach: detect output file appearing (>1MB) = success, process disappearing without output = failure. Check every 30 seconds.
- For very long renders (18+ frames), expect 8-16+ minutes on 8GB RAM. Monitor log files rather than relying on foreground process.
- Render progress: single-worker capture at 78% took 11 hours for 6903 frames (~4 min video). Slower than expected but steady.

## Video build guides
- Full reusable pipeline: [[skills/explainer-video-pipeline/SKILL.md]]
- bintang-menjelaskan-bintang build notes: [[reference/bintang-video-project.md]]
- Low-memory render recipe: `PRODUCER_LOW_MEMORY_MODE=true`, `TMP/TEMP=D:\hf-temp`, `--workers 1`, 30fps (never 24fps — causes seam). Single-viewport streaming avoids the stitch artifact.