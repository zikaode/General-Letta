---
format: 1920x1080
duration: 60s
message: "Bintang adalah bola plasma raksasa yang menyala karena fusi nuklir, dan setiap elemen berat di alam semesta lahir dari kematian bintang."
arc: Hook → Konsep → Mekanisme → Bukti → Implikasi → Landasan
audience: penonton umum Indonesia
mode: autonomous
music: none
---

## Video direction

**Palette** (Coral preset): coral #E85D5D (accent + full regions; ink-on-coral, never white-on-coral) · cream #F5F0E8 (reading surface) · black #1A1A1A (dramatic surface) · gray #6B6B6B (body/meta only). 45° hatch (6% ink) on coral regions; wallpaper numerals (12% ink) behind underfilled coral.

**Type**: Bebas Neue uppercase + tracked for ALL display (hero-title 6.5cqw → card-title 1.9cqw); Inter for body/labels. Fit-to-measure: ≤3 words → hero-title; 4–6 → section-headline; 7+ → column-title. Floor 1.4cqw.

**Motion**: power3 long-tail default — smooth over bouncy. Reveals paced to reading time (no VO — TTS unavailable); never front-load. Held frames settle to stillness; only sanctioned aliveness is subtle jitter. Entrance + reveal only — no exits (harness transition IS the exit). Seek-safe: no repeat/yoyo, no Math.random, no CSS keyframes, fromTo entrances.

**Rhythm**: Frames 2 and 8 are breather frames (calmer, longer holds). Frames 1, 6, 10 carry most energy. Frame 7 is the emotional turn — deliberate stillness after supernova.

**Negative**: no nav/footers/scrollbars/browser chrome, no bokeh, no purple-blue AI gradients, no drop shadows, no rounded rects (circles only). No slideshow (front-load then freeze). No lazy breathing or back-half drift. No bouncy defaults.

**Caption band**: bottom ~17% reserved; content in top ~83%. Hero anchor y ≈ 454px.

---

## Frame 1 — Hook

- scene: Satu bintang tunggal berdenyut di tengah layar hitam, lalu pulsa cahaya menyebar
- voiceover: "Lihat ke langit malam. Setiap titik cahaya itu adalah bola api raksasa — jauh lebih besar dari yang bisa kamu bayangkan."
- duration: 9.6s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Visceral metaphor
- beat: curiosity
- blueprint: kinetic-type-beats (Adapt)
- rules: spring-pop-entrance, discrete-text-sequence
- focal: the phrase "BOLA API RAKSASA"
- roles: hero phrase = foreground · star pulse = background · caption = supporting
- sfx: deep-impact, whoosh

Adapt: escalate from "TITIK CAHAYA" → "BOLA API" → "BOLA API RAKSASA" via hard-cut word swaps. Star pulse replaces flat bg.

Scene 1 (0.0–1.2s): black field. Coral dot pulses center (entrance pop). "TITIK CAHAYA" fades in small, cream, via per-word stagger. Subtle jitter on the dot.
Scene 2 (1.2–2.8s): hard-cut to "BOLA API" at 80% scale, coral on black. Star dot expands; coral radial glow blooms behind it; pulse ring draws outward.
Scene 3 (2.8–5.0s): hard-cut to "BOLA API RAKSASA" at hero-title scale, cream on black. Holds dead-center; glow settles to static halo. Caption enters ~3.5s.

---

## Frame 2 — Apa itu bintang

- scene: Diagram bintang terbelah — inti menyala di tengah, lapisan luar berputar, dengan label "plasma"
- voiceover: "Bintang adalah bola plasma raksasa. Di intinya, suhu mencapai jutaan derajat — cukup panas untuk mengubah hidrogen menjadi helium."
- duration: 10s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-konsep.html
- type: product_intro
- persuasion: Progressive disclosure
- beat: clarity
- blueprint: titlecard-reveal (Reproduce)
- rules: svg-path-draw, scale-swap-transition, discrete-text-sequence, sine-wave-loop
- focal: the star cross-section diagram
- roles: star diagram = foreground · labels = supporting · cream field = background
- sfx: none

Reproduce: calm single-move + hold. One restrained reveal, then stillness. Breather frame.

Scene 1 (0.0–1.0s): cream field. Coral circle outline draws stroke-by-stroke centered at y≈454. Ink label "BINTANG" fades in above.
Scene 2 (1.0–3.0s): the ONE move — coral core scales in; two outer layer rings draw on; "PLASMA" slides up from below center and fades in. Ink label "INTI: JUTAAN °C" beside core. All settle on power3.
Scene 3 (3.0–6.0s): diagram holds. Subtle jitter on core glow only. No second phase. Caption present.

---

## Frame 3 — Fusi nuklir

- scene: Partikel hidrogen bertumbukan dan bergabung menjadi helium, melepaskan energi dalam bentuk cahaya
- voiceover: "Proses ini disebut fusi nuklir. Setiap detik, matahari mengubah 600 juta ton hidrogen menjadi helium — dan energi yang dilepaskan itulah yang kita lihat sebagai cahaya."
- duration: 12.72s
- transition_in: crossfade
- status: outline
- src: compositions/frames/03-fusi.html
- type: feature_showcase
- persuasion: Worked example with real numbers
- beat: fascination
- blueprint: dataviz-countup (Adapt)
- rules: counting-dynamic-scale, scale-swap-transition, stat-bars-and-fills, svg-path-draw
- focal: the "600 JUTA" counter
- roles: counter = foreground · H→He diagram = supporting · progress ring = supporting · cream = background
- sfx: tick, whoosh-soft

Adapt: trend chart becomes particle collision diagram. Camera push resolves on the 600 juta ton counter.

Scene 1 (0.0–1.5s): cream field. Ink label "FUSI NUKLIR" top-left. Two coral "H" circles pop in side-by-side at center.
Scene 2 (1.5–4.0s): H circles merge (morph swap → "He" circle). Coral burst blooms; progress ring sweeps clockwise. "600" count-up begins, growing in scale, with "JUTA TON/DETIK" beneath. Count-up reveals on its beat, not at t=0.
Scene 3 (4.0–5.5s): slow camera push toward counter; ring completes; coral glow blooms behind number. He circle dims to spotlight counter.
Scene 4 (5.5–7.0s): hold on "600 JUTA" — still, no push. Subtle jitter on glow. Caption present.

---

## Frame 4 — Kelahiran bintang

- scene: Awan nebula berputar perlahan, material berkumpul di pusat, memanas, lalu menyala
- voiceover: "Bintang lahir dari awan gas dan debu raksasa yang disebut nebula. Gravitasi menarik material ini bersama, memadat dan memanas — hingga fusi dimulai."
- duration: 11.44s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-kelahiran.html
- type: feature_showcase
- persuasion: Causal chain (A → B → C)
- beat: wonder
- blueprint: constellation-hub (Adapt)
- rules: spring-pop-entrance, svg-path-draw, center-outward-expansion, ambient-glow-bloom, depth-of-field-blur
- focal: the forming protostar at center
- roles: protostar = foreground · nebula particles = supporting · ink field = background
- sfx: whoosh-soft, deep-impact

Adapt: nodes are nebula particles converging into a center protostar. Push-in resolves on ignition.

Scene 1 (0.0–1.5s): ink field. ~12 scattered coral/cream dots pop in staggered around empty center. Cream label "NEBULA" upper-left.
Scene 2 (1.5–3.5s): particles drift inward; thin coral connectors draw to center; coral core grows. Label crossfades: "NEBULA" → "GRAVITASI" → "PROTOSTAR".
Scene 3 (3.5–5.0s): camera push toward core; outer particles blur progressively; core brightens, glow blooms.
Scene 4 (5.0–6.0s): core ignites — one-shot flash pop, holds as bright coral star. Camera stops. Subtle jitter on glow. Caption present.

---

## Frame 5 — Pabrik elemen

- scene: Bintang masif di tengah, elemen-elemen (C, O, N, Fe) muncul di sekelilingnya seperti produk dari pabrik
- voiceover: "Selama hidupnya, bintang memproduksi elemen-elemen berat: karbon, oksigen, nitrogen, besi. Semua elemen ini tidak ada sebelum bintang pertama kali menyala."
- duration: 11.92s
- transition_in: crossfade
- status: outline
- src: compositions/frames/05-elemen.html
- type: feature_showcase
- persuasion: Statistical proof
- beat: comprehension
- blueprint: grid-card-assemble (Adapt)
- rules: center-outward-expansion, ambient-glow-bloom, sine-wave-loop
- focal: the element cards (C, O, N, Fe)
- roles: element cards = foreground · central star = background (dimmed 40%) · cream = background
- sfx: pop, tick

Adapt: tiles are element cards assembling around a dimmed central star. No camera zoom-out.

Scene 1 (0.0–1.0s): cream field. Dimmed coral star center. Ink label "PABRIK ELEMEN" top-left.
Scene 2 (1.0–4.0s): four white cards (5px coral top border) assemble staggered: C (Karbon), O (Oksigen), N (Nitrogen), Fe (Besi). Each fades + slides into slot. ~0.5s stagger.
Scene 3 (4.0–5.0s): coral glow travels across cards. Central star brightens slightly.
Scene 4 (5.0–6.0s): array holds; gentle parallax float on tiles. Caption present.

---

## Frame 6 — Supernova

- scene: Ledakan supernova — cahaya menyilaukan, elemen-elemen tersebar ke seluruh layar
- voiceover: "Ketika bintang masif mati, ia meledak sebagai supernova. Semua elemen yang diproduksinya tersebar ke seluruh galaksi — menjadi bahan baku untuk bintang dan planet generasi berikutnya."
- duration: 12.56s
- transition_in: crossfade
- status: outline
- src: compositions/frames/06-supernova.html
- type: social_proof
- persuasion: Before/after
- beat: awe
- blueprint: zoom-out-workspace-reveal (Adapt)
- rules: viewport-change, center-outward-expansion, ambient-glow-bloom, sine-wave-loop
- focal: the exploding star
- roles: star core = foreground (detail at open) · element particles = supporting · ink = background
- sfx: explosion, whoosh

Adapt: "detail" is the star before explosion; "whole" is scattered elements across galactic field. The zoom-out IS the explosion.

Scene 1 (0.0–2.0s): ink field. Camera TIGHT on bright coral star, full-bleed. Star pulses; destabilizes (jitter increases). Ink label "SUPERNOVA" at edge.
Scene 2 (2.0–3.5s): EXPLOSION — massive coral flash; element particles scatter outward. Camera begins decelerating zoom-out.
Scene 3 (3.5–5.5s): zoom-out continues decelerating; scattered elements resolve into wide field of glowing dots — a galaxy of stardust. Flash fades. Frame locks at wide.
Scene 4 (5.5–7.0s): particles drift slowly outward. Cream label "Bahan Baku Galaksi" fades in lower-third. Held read. Caption present.

---

## Frame 7 — Kita adalah debu bintang

- scene: Siluet manusia terbuat dari partikel cahaya, terhubung ke bintang-bintang di latar belakang
- voiceover: "Setiap atom dalam tubuhmu — kalsium di tulangmu, besi di darahmu — ditempa di dalam bintang yang sudah lama mati. Kita semua adalah debu bintang."
- duration: 10.56s
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-debu-bintang.html
- type: benefit_highlight
- persuasion: Analogy / metaphor
- beat: recognition
- blueprint: constellation-hub (Adapt)
- rules: spring-pop-entrance, svg-path-draw, ambient-glow-bloom, sine-wave-loop
- focal: the human silhouette made of star particles
- roles: silhouette = foreground · background stars = background · connector lines = supporting
- sfx: none

Adapt: hub is a human silhouette of coral/cream particles; satellites are background stars connected by thin coral lines. No push-in — deliberate stillness after supernova. Emotional turn.

Scene 1 (0.0–2.0s): ink field, crossfading from supernova particles. Human silhouette forms at center from ~20 coral particles assembling via staggered pop. Camera fully static.
Scene 2 (2.0–4.0s): thin coral connectors draw from silhouette to 5–6 background stars that pop in scattered. Labels "Ca" (Kalsium) and "Fe" (Besi) fade in beside silhouette.
Scene 3 (4.0–5.5s): silhouette glows softly; connectors pulse once. Cream phrase "DEBU BINTANG" fades in beneath.
Scene 4 (5.5–7.0s): held STILL — no breathing, no drift. Subtle jitter on silhouette particles only. Caption present.

---

## Frame 8 — Matahari kita

- scene: Matahari di tengah, dengan timeline "4,6 miliar tahun" di bawahnya, dan bumi kecil mengorbit
- voiceover: "Matahari kita sudah menyala 4,6 miliar tahun. Ia akan terus menyala sekitar 5 miliar tahun lagi — sebelum akhirnya mengembang dan menyusut menjadi katai putih."
- duration: 12.64s
- transition_in: crossfade
- status: outline
- src: compositions/frames/08-matahari.html
- type: social_proof
- persuasion: Anchoring on a familiar referent
- beat: perspective
- blueprint: dataviz-countup (Adapt)
- rules: counting-dynamic-scale, stat-bars-and-fills, svg-path-draw, ambient-glow-bloom
- focal: the "4,6 MILIAR" counter
- roles: counter = foreground · sun diagram = supporting · timeline = supporting · cream = background
- sfx: tick

Adapt: ring becomes sun's outline; trend chart becomes horizontal timeline with coral nodes. Count-up lands on 4,6 miliar tahun. Breather frame.

Scene 1 (0.0–1.0s): cream field. Coral sun circle draws on at center-left. Ink label "MATAHARI" above. Rule-of-thirds.
Scene 2 (1.0–3.5s): "4,6" count-up beside sun, "MILIAR TAHUN" beneath. Progress ring sweeps around sun. Horizontal ink timeline draws below with three coral nodes: "LAHIR", "SEKARANG", "MASA DEPAN". Tiny cream earth dot orbits sun (finite deterministic tween).
Scene 3 (3.5–5.0s): counter lands at "4,6"; ring completes; coral glow blooms behind number. Timeline nodes settle.
Scene 4 (5.0–6.0s): hold — counter, sun, timeline read STILL. Earth dot continues finite orbit. Caption present.

---

## Frame 9 — Landasan

- scene: Banyak bintang bermunculan satu per satu di seluruh layar, membentuk langit malam penuh
- voiceover: "Jadi lain kali kamu melihat bintang — ingat: kamu sedang melihat pabrik elemen alam semesta. Dan setiap elemen di tubuhmu pernah menjadi bagian dari salah satunya."
- duration: 11.52s
- transition_in: crossfade
- status: outline
- src: compositions/frames/09-landasan.html
- type: branding
- persuasion: Callback + Generalization
- beat: satisfaction
- blueprint: kinetic-type-beats (Adapt)
- rules: spring-pop-entrance, discrete-text-sequence
- focal: the phrase "PABRIK ELEMEN"
- roles: hero phrase = foreground · star field = background · "ALAM SEMESTA" = supporting
- sfx: whoosh-soft

Adapt: three beats escalate "BINTANG" → "PABRIK ELEMEN" → "ALAM SEMESTA" with stars accumulating. Final beat holds as star field.

Scene 1 (0.0–1.5s): ink field. "BINTANG" enters via per-word stagger, cream, section-headline scale. Few stars pop in scattered.
Scene 2 (1.5–3.0s): hard-cut to "PABRIK ELEMEN" at hero-title scale, coral on ink. More stars pop in. Coral accent-line draws beneath.
Scene 3 (3.0–4.5s): hard-cut to "ALAM SEMESTA" at hero-title scale, cream on ink. ~30 stars now frame-wide. Slow camera push underneath.
Scene 4 (4.5–6.0s): text fades out (scale + fade); star field remains, holds. Subtle jitter on brightest stars. Caption present.

---

## Frame 10 — Penutup

- scene: Layar gelap, hanya satu kalimat besar: "Kita adalah debu bintang." dengan bintang kecil berkelip
- voiceover: "Kita adalah debu bintang."
- duration: 2.48s
- transition_in: crossfade
- status: outline
- src: compositions/frames/10-penutup.html
- type: cta
- persuasion: Distillation
- beat: inspiration
- blueprint: titlecard-reveal (Reproduce)
- rules: scale-swap-transition, svg-path-draw, sine-wave-loop
- focal: the phrase "KITA ADALAH DEBU BINTANG"
- roles: closing phrase = foreground · ink field = background · twinkling star = supporting
- sfx: none

Reproduce: calm single-move + hold. One restrained reveal, then stillness. Final frame.

Scene 1 (0.0–0.8s): ink field, empty. Single small coral star fades in center. Camera static.
Scene 2 (0.8–2.0s): the ONE move — "KITA ADALAH DEBU BINTANG" fades in via per-word stagger, cream, hero-title scale, each word on its own beat, power3 settle. Coral accent-line draws beneath.
Scene 3 (2.0–4.0s): phrase holds — dead still. Star twinkles (subtle jitter). No breathing, no drift. Final frame. Caption present.
