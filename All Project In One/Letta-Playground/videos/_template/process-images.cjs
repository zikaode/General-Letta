// process-images.cjs — map run PNGs to frame-NN.png (crop 16:9 + upscale via ffmpeg)
// Usage: node process-images.cjs <runDir> [startOffset]
// startOffset = number of frames before this batch (0 for batch1, 33 for batch2, 66 for batch3)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const runDir = process.argv[2];
const offset = parseInt(process.argv[3] || "0", 10);
if (!runDir || !fs.existsSync(runDir)) { console.error("usage: node process-images.cjs <runDir> [startOffset]"); process.exit(1); }

const config = JSON.parse(fs.readFileSync(path.join(runDir, "config.json"), "utf8"));
const outDir = path.join(__dirname, "assets", "img");
fs.mkdirSync(outDir, { recursive: true });

const pngs = fs.readdirSync(runDir).filter(f => f.endsWith(".png")).sort();
console.log(`found ${pngs.length} pngs for ${config.prompts.length} prompts (offset ${offset})`);
if (pngs.length < config.prompts.length) {
  console.log("WARNING: fewer images than prompts — mapping first N frames only");
}

// Sort by creation time so prompt order is preserved (slugs are not guaranteed unique).
const withTime = pngs.map(f => ({ f, t: fs.statSync(path.join(runDir, f)).mtimeMs })).sort((a, b) => a.t - b.t);

withTime.forEach((p, i) => {
  const src = path.join(runDir, p.f);
  const frameNum = offset + i + 1;
  const dst = path.join(outDir, "frame-" + String(frameNum).padStart(2, "0") + ".png");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src,
    "-vf", "crop=1024:576:0:224,scale=1920:1080",
    dst]);
  console.log(`frame-${String(frameNum).padStart(2, "0")}.png  <-  ${p.f.slice(0, 50)}`);
});
console.log("Done. Output: assets/img/frame-NN.png");
