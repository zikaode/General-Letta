// prepare-full-render.cjs — ONE-BUTTON resume for the full 97-frame chibi video.
// Run this ONLY after the MAI image limit resets. It does everything except the
// image generation itself (which needs the browser) and the final render.
//
//   node prepare-full-render.cjs           -> TTS + STT + frame rebuild (needs images after)
//   node prepare-full-render.cjs --assemble  -> after images are generated: inject+captions+assemble
//
// Stages:
//   1. Regenerate TTS for all 97 frames (sonic-3.6, speed 1.1, clean script v2)
//   2. STT word timestamps (audio_meta.json, 97 voices)
//   3. Rebuild frame-defs (97 frames, no hero graphics) + STORYBOARD (0.4s gap)
//   (--assemble) 4. inject images, build captions, assemble index, run assessment
const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const PROJ = __dirname;
const GAP = 0.4;
const ASSEMBLE = process.argv.includes("--assemble");

const run = (args, label) => {
  console.log("\n=== " + label + " ===");
  const r = spawnSync(process.execPath, args, { cwd: PROJ, stdio: "inherit" });
  if (r.status !== 0) { console.error(label + " failed"); process.exit(1); }
};

if (!ASSEMBLE) {
  // STAGE 1: TTS all 97 frames
  run([path.join(PROJ, "generate-audio-v2.cjs"), "97"], "Stage 1/3: TTS sonic-3.6 for 97 frames");
  // STAGE 2: STT timestamps
  run([path.join(PROJ, "transcribe-words-v2.cjs"), "97"], "Stage 2/3: STT word timestamps");
  // STAGE 3: rebuild frames (97) — reuse make-trimmed logic but for full 97
  run([path.join(PROJ, "make-trimmed.cjs"), "97"], "Stage 3/3: rebuild 97 frames + storyboard + index");
  console.log("\nTTS + frames ready. NEXT: generate 97 chibi images with run-image-batch.cjs");
  console.log("  (3 batches: gen-config-batch1/2/3.json, offsets 0 / 33 / 66)");
  console.log("Then run:  node prepare-full-render.cjs --assemble");
} else {
  // STAGE 4: after images generated
  run([path.join(PROJ, "inject-images.cjs")], "Inject 97 chibi images");
  run(["C:\\Users\\USER\\.agents\\skills\\faceless-explainer\\scripts\\captions.mjs", "build", "--storyboard", "./STORYBOARD.md", "--audio-meta", "./audio_meta.json", "--hyperframes", "."], "Build captions");
  run(["C:\\Users\\USER\\.agents\\skills\\faceless-explainer\\scripts\\assemble-index.mjs"], "Assemble index");
  run([path.join(PROJ, "assess-composition.cjs")], "Assessment");
  console.log("\nAssembled. If assessment >=8, render with the WMI-detached command.");
}
