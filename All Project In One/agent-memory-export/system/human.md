---
description: "What I know about the person I am interacting with"
---
Name: ?
Occupation: ? (video content creator / web developer)

## Language / Communication
- Communicates in Bahasa Indonesia (Indonesian). Always respond in Indonesian.
- Speaks with casual/technical Indonesian (mixes English technical terms)
- When they say "A" in context of image generation, it means confirm/proceed with the first option

## What they work on
- Video content creation with animated explainer videos using HyperFrames + Cartesia TTS + AI image pipeline
- Projects: "bintang-menjelaskan-bintang" (astronomy, 1m45s, finished), "sel-unit-kehidupan" (biology/cells, ~4 min, in progress), "kucing-fakta-unik" (cat facts, 97 frames, ~10 min, in progress — v2 render segment 1 done (frame 1-30, assessment 10/10, 160s), full chibi regeneration planned for all 97 frames once MAI limit resets)

- Tech stack: Node.js (ES modules), HTML, GSAP, FFmpeg, FFprobe, Cartesia TTS/STT APIs, HyperFrames, Playwright image generator
- Project paths:
  - `D:\General-Letta\All Project In One\Letta-Playground\videos\bintang-menjelaskan-bintang\` (astronomy, finished)
  - `D:\General-Letta\All Project In One\Letta-Playground\videos\sel-unit-kehidupan\` (biology, ~4 min, render in progress)
  - `D:\General-Letta\All Project In One\Letta-Playground\videos\kucing-fakta-unik\` (cat facts, 97 frames, ~10 min, segment 1 render in progress — v2 segment 1 (30 frames) rendered + assessment 10/10; full chibi regeneration of all 97 frames planned, awaiting MAI limit reset)
- Moved from old `C:\laragon\www\...` — that path is now empty

## Why they are using Letta
- To accelerate video rendering and production workflows
- To handle complex multi-step technical tasks (TTS integration, audio synthesis, rendering pipelines)
- To manage technical troubleshooting for their video pipeline

## What they are hoping to get out of Letta
- Efficient hands-off automation of their video rendering pipeline
- Help integrating third-party services (Cartesia TTS for Indonesian voiceover)
- Guidance on Letta's features and architecture
- Quality assurance: video output should meet a high standard before rendering commits

## Their frustrations and points of confusion
- Initially confused about Letta's multi-agent architecture (thought they lost memory between sessions)
- Working with a resource-constrained machine (~8 GB RAM)
- Faced challenges integrating the Cartesia TTS API (authentication format, request structure, word-level timestamps)
- Video pipeline sync issues: audio ~105s but storyboard set to 60s, causing out-of-sync video
- Found video output "underwhelming" — wanted richer visuals and background music
- Visual preferences (explicit): images fullscreen 16:9 as dimmed background, motion graphics kept and animated on top (never hide them), film-style subtitle captions with NO white box, no letterbox bars
- **Caption style STANDARDIZED (2026-09-10)**: one caption-skin.html for every video — semi-dark pill rgba(0,0,0,0.55) + heavy black text-shadow + active word dark-on-coral highlight, Inter 700. Readable on light AND dark backgrounds. Canonical copy in skill folder; copy to each project's .hyperframes/. Edit that one file to restyle all videos.
- Wants MORE images per video rather than fewer

## Quality expectations
- Prefers self-assessment quality gates before committing to render (e.g., score 1-10, iterate if below threshold)
- Wants the agent to act as its own test suite — not make the user the verifier
- Values quality iteration over speed: willing to loop up to 3x for better output
- Uses Letta to test capabilities ("Coba tes" = testing — gives specific challenge requirements)

## Project conventions learned
- Full video pipeline documented in [[skills/explainer-video-pipeline/SKILL.md]]
- Build notes: [[reference/bintang-video-project.md]]
- Biology project ("sel-unit-kehidupan") uses same pipeline with 18 frames, coral palette, cell-themed AI images
- "kucing-fakta-unik" uses same pipeline scaled to 97 frames, orange tabby cat character, image-hero + fact-title frames
- Frame generator approach (script-driven, not hand-authored) confirmed working for 100+ frame videos
- Pacing: effective gap between frames should be ~0.8-0.9s total. Since TTS adds ~0.1-0.86s trailing silence per frame, set explicit jeda to **0.4s** in scripts (not 1s)
- Script quality: natural conversational Indonesian, varied sentence openings, ellipsis for dramatic pauses, punctuation guides TTS intonation. Avoid repetitive phrases like "Coba bayangin deh". User reviews script drafts before TTS generation.
- **TTS sonic-3.6 rules (2026-09-10)**: Kata ulang (reduplication) ALLOWED but written as two separate words in double quotes, NO hyphen — `gara-gara`→`"gara gara"`, `tiba-tiba`→`"tiba tiba"`, `terus-menerus`→`"terus menerus"`. The quote makes sonic-3.6 enunciate each word instead of slurring. (Plain hyphenated reduplication mumbles.) Serious/authoritative tone: max ~1 exclamation per 15 frames, deadpan humor. TTS speed set to 1.1 (`generation_config: { speed: 1.1 }`).
- Clean-image-hero frames (2026-09-10): Hero frames use plain AI images as background only, NO accent bars/decorative graphics on image frames. Graphics/text overlays kept only on title frames (fact titles, hook, closing). Removes template feel - images stand on their own.
- Script-driven frame generation: frame-defs.cjs drives HTML generation, not hand-authored frames. When scripts change versions (v1→v2), fact title frame numbers shift - always regenerate frame-defs from new script. Stale HTML files can persist with old names and conflict with new numbering.
- Partial render testing: Use segment renders (e.g., frame 1-30) to validate quality before committing to full generation. Validates pipeline, saves API/TTS quotas.
- **Image style discipline**: When switching image style mid-project (e.g., realistic→chibi), regenerate ALL frames — never mix old and new styles. Back up old images, clear assets, swap style anchor in prompt generator, regenerate everything.
- **Chibi style (2026-09-10, kucing project)**: cute chibi/kawaii 2D illustration with thick bold black outlines, big glossy expressive eyes, soft pastel palette (peach/cream/coral), tiny blush marks, minimal shading. Character: adorable chibi orange tabby cat with cream belly, big round glossy dark-brown eyes, tiny pink nose, soft blush, thick black outline. Style anchor goes on EVERY image prompt.
