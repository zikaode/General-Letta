// process-images.cjs — map run PNGs to frame-NN.png (crop 16:9 + upscale via ffmpeg)
// Usage: node process-images.cjs <runDir>
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const runDir = process.argv[2];
if (!runDir || !fs.existsSync(runDir)) { console.error("usage: node process-images.cjs <runDir>"); process.exit(1); }

// prompt order == frame order (config.json prompts array)
const config = JSON.parse(fs.readFileSync(path.join(runDir, "config.json"), "utf8"));
const outDir = path.join(__dirname, "assets", "img");
fs.mkdirSync(outDir, { recursive: true });

const pngs = fs.readdirSync(runDir).filter(f => f.endsWith(".png")).sort();
console.log(`found ${pngs.length} pngs for ${config.prompts.length} prompts`);
if (pngs.length < config.prompts.length) {
  console.log("WARNING: fewer images than prompts — mapping first N frames only");
}

// Generator names files by slug of prompt; slug order is not guaranteed to match
// prompt order if two prompts slugify identically. Sort by creation time instead.
const withTime = pngs.map(f => ({ f, t: fs.statSync(path.join(runDir, f)).mtimeMs })).sort((a, b) => a.t - b.t);

withTime.forEach((p, i) => {
  const src = path.join(runDir, p.f);
  const dst = path.join(outDir, "frame-" + String(i + 1).padStart(2, "0") + ".png");
  // crop center 1024x576 then upscale to 1920x1080 (proven bintang recipe)
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src,
    "-vf", "crop=1024:576:0:224,scale=1920:1080",
    dst]);
  console.log(`frame-${String(i + 1).padStart(2, "0")}.png  <-  ${p.f.slice(0, 60)}...`);
});
console.log("Done. Output: assets/img/frame-NN.png");
