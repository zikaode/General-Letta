---
name: explainer-video-pipeline
description: End-to-end pipeline for Indonesian animated explainer videos — script, Cartesia TTS voiceover, word-synced captions, HyperFrames composition with AI image backgrounds, render, and seam-artifact fix. Use when the user asks to make, fix, or re-render an explainer/educational video with the HyperFrames + faceless-explainer stack.
---

# Explainer Video Pipeline (HyperFrames + Cartesia + AI images)

Reusable workflow learned from the "bintang-menjelaskan-bintang" project. The
user's machine is resource-constrained (~8 GB RAM) — every step below is tuned
for that. Follow this order; each stage feeds the next.

## Hard-won fixes (from kucing-fakta-unik — 97-frame scaling)

- **SCRIPT.md format matters for frame parsing**: `generate-audio.cjs` expects lines matching `/^\d+\.\s/` (e.g., "1. text"). If your SCRIPT.md uses `01 | text` format, the script skips all lines. Update the parser regex to match your format, or reformat SCRIPT.md.
- **NUM_FRAMES is hardcoded in scripts**: Several scripts (generate-audio.cjs, transcribe-words.cjs) have `NUM_FRAMES = 18` baked in. Update this to match your actual frame count before running, or better yet, derive it dynamically from the script/storyboard.
- **Jeda (gap) technique for pacing**: For longer videos, set explicit gap to 0.4s in scripts. TTS (sonic-3.5/3.6) adds ~0.1-0.86s trailing silence per frame, so effective total gap is ~0.5-1.26s per frame (target ~0.8-0.9s total). Apply to STORYBOARD.md: each frame's duration = its audio duration + 0.4s (except last frame). Avoid 1s explicit gap — combined with TTS trailing silence this creates ~1.5-1.86s effective gaps, too long for pacing.
- **Captions.mjs relies on STORYBOARD.md, not caption_groups.json**: `caption_groups.json` is an OUTPUT debug file. The actual input is STORYBOARD.md parsed for frame starts. If captions fail with "no usable words", check STORYBOARD.md has proper format (frontmatter `format: 1920x1080`, per-frame `## Frame N — title` with `- duration: Xs`).
- **Storyboard src paths must match actual filenames**: `assemble-index.mjs` reads STORYBOARD.md `src:` paths and expects files to exist on disk. If frame files are named `01-title.html` but STORYBOARD says `compositions/frames/01.html`, assembly fails with "no mountable frames". Ensure STORYBOARD src matches the actual filename pattern.
- **Large-scale assessment needs threshold adjustments**: Default `transitions` check (expecting crossfade overlaps) gives false negatives for cut-based videos (sentence-by-sentence without transitions). For 90+ frame videos with cut pacing, `transitions` criterion should expect cuts, not overlaps. The `imagesPresent` criterion becomes the main blocker until image generation completes.
- **Assessment `transitions` must exclude the captions layer**: the captions overlay (`el-captions`, one long scene spanning the whole video) is NOT a frame scene. If counted, it registers as 2 huge fake "overlaps" and tanks the transitions score. Filter it out by id, and use a 0.2s gap tolerance for floating-point frame starts (0.05s is too tight and causes false "not clean cut" flags).
- **Assessment should only count frames being rendered**: after trimming a project (e.g. 98→30 frames), stale HTML from the larger build stays in `compositions/frames/`. Filter the assessed frame list to `1..EXPECT_FRAMES` before scoring, else `imageInject`/`typography` fail on leftover files that aren't in the video. Better: delete all `compositions/frames/*.html` and rebuild fresh from frame-defs before assessing — stale files with old names cause wrong-content frames.
- **MAI login auto-close (playwright-image-generator)**: the stock `login.js` saved storageState only ONCE after a "stable streak" — but the browser auto-closes right after login, so the save was lost and every run demanded re-login. Fixed login.js saves state on EVERY logged-in tick and relaunches the page on the SAME browser context if the page auto-closes. Verify `playwright-state.json` is fresh before a batch.
- **Image generator loop bug (subagent misuse)**: never let a subagent write its own orchestrator that relaunches `generate.js` once per image — that opens a new browser per image, burns MAI rate limits, and is catastrophically slow. `generate.js` already loops all prompts in ONE browser. Use `run-image-batch.cjs <config> <frameOffset>`: it copies the batch config over the generator's `data/config.json`, runs generate.js ONCE, then processes the newest run folder with the frame offset. Run once per batch, sequentially.
- **Style change mid-project = full regeneration**: when the user switches the image style (e.g. realistic flat vector → chibi), do NOT mix old + new styles in one video. Back up old images (`assets/img-v1-backup/`), clear `assets/img/`, swap the style anchor in the prompt generator, and regenerate ALL frames. Two styles in one video reads as a jarring seam.

## Hard-won fixes (from sel-unit-kehidupan)

- **Frame generator field bug**: when generating frame CSS IDs from a defs file, use the real field name (`d.num`), never a guessed one (`d.id`). A wrong field yields CSS like `#undefined-bg` — motion graphics still render (absolute-positioned inline) but the flat background turns transparent AND injected AI images silently don't show. Symptom: render completes, `<img>` tagged in HTML, but video shows plain flat color with no illustration. Verify with a single-frame draft render + screenshot before the full render.
- **Image src path in sub-compositions**: `<img src>` inside `compositions/frames/*.html` must be `../../assets/img/frame-NN.png` (two levels up from the frame file), NOT `assets/img/...`. HyperFrames mounts frames as separate documents rooted at the frame file, so root-relative paths 404 silently.
- **Detaching long renders on Windows**: `Start-Process npx ...` inherits the caller's console, so a Bash timeout sends Ctrl+C down the tree and kills the render mid-assembly. Use `Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = 'cmd /c \"...\"' }` to launch a fully detached process that survives launcher timeouts. npx is a batch file — wrap in `cmd /c`.
- **Quotes inside inline style attributes (CRITICAL, cost a full render cycle)**: NEVER put double quotes inside an inline `style="..."` attribute in generated HTML, e.g. `style="...font-family:"Bebas Neue",sans-serif..."`. The HTML parser terminates the attribute at the first inner quote, silently dropping every CSS property after it (font-size, color, text-shadow, letter-spacing). Text renders at browser-default 16px black — the video "works" but looks broken: tiny text, dark unreadable labels. This was the real root cause behind "teks terlalu kecil / kurang kontras" complaints, not the design. Use unquoted family names (`font-family:Bebas Neue,sans-serif` is valid CSS), or move fonts to a class in the `<style>` block. When user says "text too small" on a generated template, check the rendered attribute survives HTML parsing FIRST before redesigning.
- **v3 design system (user-approved look)**: titles 100–150px, hero numbers 220–260px, subs 40–56px, nothing below 30px. Every text element gets a text-shadow (dark shadow on INK frames, cream halo on CR frames). Every frame gets a scrim div (top/bottom gradient vignette, ~28% clear middle) as the first child of the scene clip so text sits on dimmed image zones and the illustration stays visible in the center. Image-hero frames (the AI image is the star) get text + small glowing accents only; diagram frames get thicker borders (≥6px) and glows. No white boxes/cards (user hates them).
- **Strict composition assessment**: `assess-composition.cjs` checks (weight): images present (1), image inject `../../assets/img` (1.5), no "undefined" CSS ids (1.5), typography ≥100px max/≥30px min/all shadowed (2), scrim present (1), borders ≥4px + ≥2 contrast elements incl. SVG strokes ≥6px (1), captions (0.5), transition overlaps ≥15/17 — parse multi-line attribute tags, not same-line regex (0.5), palette (0.5). Threshold ≥8 before rendering; iterate max 3 loops.

## 0. Project layout

```
project/
  STORYBOARD.md            # frames list + durations (edit this to re-time)
  SCRIPT.md                # Indonesian narration lines
  compositions/frames/*.html   # one file per scene (HyperFrames)
  compositions/captions.html   # word-synced caption layer (generated)
  assets/img/frame-NN.png      # AI illustrations (one per frame)
  assets/audio/*.mp3           # per-frame TTS voiceover
  assets/audio/bgm.mp3         # background music (optional)
  audio_meta.json              # per-frame audio durations (generated)
  caption_groups.json          # word groups (generated)
  index.html                   # assembled timeline (generated — don't hand-edit)
  renders/                     # output mp4 + preview jpgs
```

Environment skill scripts live at
`C:\Users\USER\.agents\skills\faceless-explainer\scripts\`.

## 1. Voiceover (Cartesia TTS)

- Key: `sk_car_...`, header `Cartesia-Version: 2026-03-01`.
- Model: `sonic-3.6`, language `id`.
- Tempo: `generation_config: { speed: 1.1 }` — verified accepted by sonic-3.6
  (2026-09-10). Slightly faster pacing per user preference. Do NOT exceed ~1.15
  or Indonesian words start to clip.
- One wav per frame, then `ffprobe` each to fill `audio_meta.json`.
- Word-level timestamps for captions come from Cartesia STT:
  `POST /stt` model `ink-whisper`, which returns word timestamps.
  Script: `transcribe-words.cjs` in the project root.

### Script-writing rules for sonic 3.6 Indonesian (user-directed 2026-09-10)

1. **Kata ulang (reduplication) — wrap in quotes, drop the hyphen.** sonic 3.6
   Indonesian mumbles reduplicated words written the normal way (`gara-gara`).
   The fix (user-directed 2026-09-10): write them as TWO separate words inside
   double quotes, NO hyphen. The quote makes the TTS pause and enunciate each
   word distinctly instead of slurring them together:
   - `gara-gara` → `"gara gara"`   (e.g. Biasanya itu "gara gara" tanaman bernama catnip)
   - `guling-guling` → `"guling guling"`
   - `tiba-tiba` → `"tiba tiba"`
   - `lompat-lompat` → `"lompat lompat"`
   - `terus-menerus` → `"terus menerus"`
   - `berbeda-beda` → `"berbeda beda"`
   - `ingat-ingat` → `"ingat ingat"`
   - `pelan-pelan` → `"pelan pelan"`
   Use this for any reduplication you want to KEEP for natural/conversational
   flavor. If a single-word synonym reads better (`mendadak`, `unik`), prefer
   that — but quoted kata ulang is fully acceptable and keeps the script warm.
2. **Serious, authoritative tone**: prefer declarative sentences over exclamations
   (max ~1 exclamation mark per 15 frames, reserved for the closing CTA).
   Humor stays, but delivered deadpan — let the facts be surprising, not the
   delivery. Sentence rhythm: short statement, then explanation.
3. Punctuation still guides prosody as before (comma = short breath, period =
   full stop, ellipsis = dramatic hang, question = rising tone) — but with the
   serious register, use ellipsis for *measured* pauses, not playful ones.

### Hook & narrative techniques (learned from Lumensia — "Why Didn't Evolution Create More Species Like Humans?")

Study of the Lumensia channel's scripting. These techniques make hooks land hard
WITHOUT changing the warm genre — adapt the *structure*, not the somber tone.

1. **Open "kamu + fakta skala besar", bukan pertanyaan retoris.** Place the viewer
   inside a big concrete fact instead of asking something. Lumensia: *"Kamu hidup
   di planet yang sudah berumur 4,5 miliar tahun."* Not *"Pernahkah kamu bertanya...?"*
2. **Triadik dengan twist.** Build a rule-of-three rhythm, then break it on the
   fourth beat. *"hanya satu yang membangun kota, hanya satu yang menenuhi sejarah,
   hanya satu yang bertanya kenapa. Dan pertanyaan itu sendiri sudah aneh."* The
   break is where the hook bites.
3. **Subversi asumsi eksplisit.** Name what the viewer probably believes, then
   overturn it. *"Jawabannya bukan karena kita istimewa."* / *"Alam tidak menghargai
   kecerdasan. Alam menghargai kelangsungan hidup."* Pattern: "Kamu pikir X? Ternyata Y."
4. **Kalimat pendek staccato untuk momen kunci.** After flowing sentences, land the
   important beat in a 2–5 word fragment. *"Kita berbeda."* / *"Mereka punah. Kita
   selamat."* / *"Memasak mengubah segalanya."* Use sparingly — only at the
   reveal, not every frame, or it loses force.
5. **Analogi tubuh/indera untuk angka abstrak.** Make a number felt, not just heard.
   *"Bayangkan kamu memiliki mesin di dalam tubuhmu yang berjalan terus... Itulah
   otakmu."* (for "otak = 20% energi"). Anchor abstract stats to a body/place/sensation.
6. **Pertanyaan berlapis yang menyempit.** Stack narrowing questions to sharpen
   curiosity: *"kenapa evolusi tidak melakukannya lagi? Kenapa tidak ada dua
   peradaban? Kenapa bukan 10?"*
7. **Reframe pertanyaan di tengah** (advanced). Mid-video, flip the framing question
   to re-hook: *"Pertanyaannya bukan kenapa X tidak terjadi. Pertanyaannya kenapa
   Y terjadi sama sekali."*
8. **Kredensial ahli inline** (opsional). Naming a researcher + institution
   ("Robin Dunbar dari Oxford") adds authority without breaking flow — for
   fact-dense science content.

**Tone note:** Lumensia runs somber/philosophical. For kucing/light content keep
the SAME structures but warm delivery — the techniques are genre-neutral.

## 2. Captions

```powershell
node "C:\Users\USER\.agents\skills\faceless-explainer\scripts\captions.mjs" build --storyboard ./STORYBOARD.md --audio-meta ./audio_meta.json --hyperframes .
```

**Standard caption skin (2026-09-10) — one style for EVERY video, readable on
light AND dark backgrounds.** Canonical file: `caption-skin.html` in this skill
folder. For each new project, copy it to `<project>/.hyperframes/caption-skin.html`
and `captions.mjs build` auto-uses it (preset skin). It fills brand tokens
(`--cap-accent`, `--cap-ink`, `--font-display`) from `compositions/frame.md`, so
the highlight color adapts per video while the structure stays identical.

Design (universal contrast):
- **Semi-dark pill** `rgba(0,0,0,0.55)` behind the text → guarantees contrast on
  light scenes (the old transparent-pill approach let white text vanish on light
  backgrounds).
- **Heavy black `text-shadow`** on the words → keeps text legible on dark scenes
  where the pill is barely visible.
- **Active (spoken) word** = dark text on the brand-coral highlight block
  (karaoke); **inactive words** = white at 72% opacity → clear reading hierarchy.
- Inter 700, `clamp(30px, 2.6vw, 42px)`, positioned `bottom: 6%`. Verified with a
  split light/dark screenshot (caption-test2.png).

To change the caption look across all videos, edit this ONE skin file in the
skill and re-copy to each project.

## 2.5. Large-scale image generation (90+ frames)

For videos with 50+ frames, batch the image generation to avoid overwhelming the generator or hitting resource limits:

1. **Split prompts into batches of 30-35 images** (each batch takes ~45-60 min).
2. **Deploy each batch as a subagent** so you can continue preparing other assets while images generate. IMPORTANT: Ensure the subagent uses existing scripts directly (e.g., generate.js with batch config). Subagents must NEVER write their own orchestrator wrappers that restart generate.js once per image — this opens a new browser per image, wastes MAI rate limits, and causes massive slowdowns. If a subagent is deployed for image generation, verify it uses run-image-batch.cjs or the batch config file directly.
3. **Use process-images.cjs with offset support**: When batch 1 generates frame-01 through frame-33, run `process-images.cjs` with `--offset 0` (default). Batch 2 generates frame-34 through frame-66, run with `--offset 33` to map the PNGs correctly.
4. **Style consistency at scale**: Every prompt must begin with the same style anchor. This is the secret to maintaining visual coherence across 98 images — the anchor acts as a consistent style seed.
   - **Current approved style (2026-09-10, user-provided reference)**: cute chibi/kawaii 2D illustration. Anchor string to prepend to EVERY prompt:
     `"cute chibi kawaii 2D illustration, thick bold black outlines, big glossy expressive eyes, soft pastel color palette (peach, cream, soft coral), tiny blush marks on cheeks, soft warm lighting, simple clean background, flat colors with minimal soft shading, wholesome charming mood, 16:9 widescreen"`
   - This replaces the older "cinematic flat vector" look. The reference shows a chibi orange tabby with huge dark eyes, blush, and a bold outline — match that energy.
5. **Character consistency**: For character-based videos, include the SAME character description in every prompt. For the kucing project:
   `"an adorable chibi orange tabby cat with cream belly and inner ears, big round glossy dark-brown eyes, tiny pink nose, soft blush marks on cheeks, thick black outline"`. Keep it identical across all prompts so the character reads as the same cat every frame.
6. **Monitor per-batch PNG count**: The generator streams files — PNG count in the run directory may not match the log count until files are fully written. Wait a minute between checking.
7. **Total timeline for 98 images**: ~1.5–2 hours across 3 sequential batches, running with `headless: false` (visible browser required).

## 3. AI images (playwright-image-generator)

- Script: `D:\General-Letta\.kilo\agent\playwright-image-generator\scripts\generate.js`,
  prompts in `data/config.json`. Model `MAI-Image-2.6`.
- **CRITICAL: `headless: false` is required**. Setting `headless: true` causes
  all images to fail ("No valid image captured"). A visible browser window
  will open but renders work correctly.
- **PowerShell BOM trap**: `Set-Content -Encoding UTF8` on config.json writes a
  BOM prefix that breaks JSON parsing. Use Node.js `fs.writeFileSync` without
  BOM if rewriting config.
- **The generator always outputs 1024×1024**, regardless of "16:9" in the
  prompt. To get fullscreen 16:9 frames, crop the center and upscale:
  `ffmpeg -i in.png -vf "crop=1024:576:0:224,scale=1920:1080" out.png`
- **Long-running**: 18 images take 20-36 min. Use `Start-Process` detached
  (like render) — not Bash `run_in_background` which caps at 600s.
- Monitor progress by watching the `runs/` directory for new timestamped
  folders and counting PNG files.
- If one image fails ("No valid image captured"), reuse the best matching
  older image rather than re-running the whole batch.
- Palette used: coral `#E85D5D` / cream `#F5F0E8` / dark `#1A1A1A`, flat vector.

## 4. Inject images as BACKGROUND (the key lesson)

**Do NOT cover the frame with the image.** The user rejected both (a) small
centered panels and (b) fullscreen images that hid the motion graphics. The
winning approach — image is a dimmed background, motion graphics stay alive:

`inject-images.cjs` (in project root):
- `<img>` at `z-index: 0`, `inset:0`, `object-fit:cover`,
  `filter: brightness(0.5) saturate(1.05)`, fade-in over 1s.
- **No `scale`/zoom** — transforms triggered the renderer's stitched capture
  and left a visible horizontal seam.
- Fade the frame's flat color wash (`#fNN-name-bg`) to `opacity 0.25` so the
  illustration shows through but the brand tint stays.
- **Never hide the frame's own clips.** Motion graphics (diagrams, labels,
  text) are what make the video feel alive — keep them on top.
- Image goes on track `maxTrack+1` (assemble refuses same-lane overlap) and
  `data-duration` must equal the frame's own root duration (not 9999).
- `remove-images.cjs` is the idempotent cleanup — always run it before
  re-injecting.

## 5. Assemble + check

```powershell
node "...\faceless-explainer\scripts\assemble-index.mjs"
node "...\faceless-explainer\scripts\transitions.mjs" inject
npx hyperframes check   # 0 errors required; Studio "missing editable id" warnings are non-fatal
```

> **Note**: `hyperframes check` may produce false-positive navigation timeouts
> (t=0s) due to font/image loading. This doesn't always prevent a successful
> render. If `check` fails but assembly succeeded, proceed to assessment.

## 5.5. Self-assessment quality gate (optional but recommended)

When the user requests quality assurance before rendering, run a self-assessment loop:

1. **Take screenshots** of key frames (first, middle, last, transitions) via hyperframes or ffmpeg.
2. **Score 1-10** on these dimensions:
   - Visual composition (images as dimmed background, motion graphics visible on top, no clutter)
   - Timing/sync (captions match audio pacing, transitions smooth)
   - Color consistency (palette uniform across frames, text readable)
   - Motion graphics quality (animations fluid, no broken references or dead clips)
3. **Give specific feedback** on what could be improved.
4. **Iterate** if score < threshold (typically 8) — max 3 loops.
5. **Only render** when score >= threshold.

> Assessment is independent of `hyperframes check` — it reviews actual visual output quality.

## 6. Render (low-memory machine)

The Bash tool caps at 600s, and this machine (<8 GB RAM) forces low-memory
mode. Working config:

```powershell
$env:PRODUCER_LOW_MEMORY_MODE = "true"
$env:TMP = $env:TEMP = "D:\hf-temp"   # C: has ~2 GB free; capture needs ~26 GB
npx hyperframes render --skill=faceless-explainer --quality high --workers 1 --output renders/video.mp4
```

- `--workers 1` = single-viewport streaming capture (no stitch). Multi-worker
  switches to disk capture, needs ~26 GB temp, and exceeds 600s.
- 30fps (3164 frames) at `--workers 1` finishes ~4m 37s when images are
  1920×1080 pas-canvas. `--fps 24` is faster but **causes a seam artifact** —
  avoid.
- Read the Tee log target for progress; the background log file buffers.
- **For renders expected to exceed 600s** (18+ frame videos → 8-16 min):
  Use `Start-Process` with a detached process writing to a log file, then
  monitor the log. Example:
  ```powershell
  $script = @"
  `$env:PRODUCER_LOW_MEMORY_MODE = "true"
  `$env:TMP = `$env:TEMP = "D:\hf-temp"
  npx hyperframes render --skill=faceless-explainer --quality high --workers 1 --output renders/video.mp4
  "@
  [System.IO.File]::WriteAllText("render-task.ps1", $script)
  Start-Process powershell -ArgumentList "-File", "render-task.ps1" -WindowStyle Hidden
  ```
  Monitor progress via log file or `Get-Process` / output file.

## 7. Seam artifact fix (if it still appears)

Fullscreen content in low-memory mode sometimes leaves a horizontal seam at
y=540. Post-process it away (crop 1px at the seam and restack):

```powershell
ffmpeg -i in.mp4 -filter_complex "[0:v]crop=1920:539:0:0[top];[0:v]crop=1920:539:0:541[bot];[top][bot]vstack=inputs=2,scale=1920:1080[v]" -map "[v]" -map 0:a -c:v libx264 -crf 19 -preset medium -c:a copy out.mp4
```

Prefer preventing it (workers 1, 30fps, pas-canvas images) over fixing it.

## 8. Verify

Always extract screenshots and actually look at them before telling the user
it's done — the user should never be the test suite:

```powershell
ffmpeg -ss <t> -i video.mp4 -frames:v 1 -q:v 2 preview/t<t>.jpg
```

Check: motion graphics visible, no seam, captions legible, no letterbox bars.

## What the user wants (hard-won preferences)

- Images fullscreen 16:9, no letterbox bars, **as background**.
- Motion graphics **kept and animated** on top — this is non-negotiable.
- Film-style subtitle captions, **no white box**.
- Rich visuals; more images rather than fewer.
- **Clean-image-hero frames** (2026-09-10): Hero frames use plain AI images as background only — no accent bars, decorative lines, or motion graphics overlaid on image frames. Graphics/text overlays kept only on title frames (fact titles, hook, closing). This removes the "template" feel and lets AI images stand on their own.
- **Quality gate**: Prefers self-assessment (score 1-10, iterate if below threshold ≥8, max 3 loops) before rendering. Quality over speed.
- **Voice character (2026-09-10)**: serious/authoritative narrator, tempo slightly fast (`speed: 1.1`). Scripts must avoid kata ulang entirely — sonic 3.6 Indonesian mangles reduplication.
- **Image style (2026-09-10)**: cute chibi/kawaii — thick bold black outlines, big glossy eyes, pastel palette, blush cheeks, minimal shading. Full anchor string in §2.5. Replaces the older "cinematic flat vector realistic" look.
- **Testing mode**: May give explicit challenge prompts ("Coba tes") to test capabilities — treat these as real production requests.

## Current production recipe (2026-09-10) — quick reference

- **Script**: Indonesian, one sentence per frame, natural punctuation (comma=breath, period=stop, ellipsis=measured dramatic hang, question=rise). NO kata ulang. Serious/deadpan register, exclamations rare. ~4–7s per frame.
- **TTS**: Cartesia `sonic-3.6`, `language: id`, `generation_config: { speed: 1.1 }`. One wav per frame.
- **STT**: Cartesia `ink-whisper` → `audio_meta.json` word timestamps.
- **Gap/pacing**: frame duration = audio + 0.4s (effective gap ~0.8–0.9s incl. TTS trailing silence).
- **Images**: chibi style anchor + identical character string on every prompt; 3 sequential batches via `run-image-batch.cjs` (offsets 0/33/66); crop `1024:576:0:224` + upscale to 1920×1080.
- **Frames**: image-hero = clean image, NO graphics; title/hook/closing frames carry the big text. Scrim on every frame.
- **Assessment**: `assess-composition.cjs` threshold ≥8 — must exclude captions layer from transitions, only count rendered frames, 0.2s gap tolerance.
- **Render**: WMI-detached, `PRODUCER_LOW_MEMORY_MODE=true`, `TEMP/TMP=D:\hf-temp`, `--workers 1 --quality high`, 30fps. Verify with screenshots before declaring done.
