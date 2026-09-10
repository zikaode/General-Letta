// make-trimmed.cjs — trim the project to the first MAXF frames (images available),
// regenerating frame-durations, audio_meta, STORYBOARD, then rebuild + reassemble.
// Usage: node make-trimmed.cjs <MAXF>   e.g. node make-trimmed.cjs 39
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const MAXF = parseInt(process.argv[2] || "39", 10);
const GAP = 0.4;
const PROJ = __dirname;

// 1. Filter frame-defs.cjs
const defs = require(path.join(PROJ, "frame-defs.cjs")).filter(d => parseInt(d.num) <= MAXF);
fs.writeFileSync(
  path.join(PROJ, "frame-defs.cjs"),
  "// frame-defs.cjs — GENERATED (trimmed to " + MAXF + " frames)\nmodule.exports = " + JSON.stringify(defs, null, 2) + ";\n"
);
console.log("frame-defs.cjs trimmed to " + defs.length + " frames");

// 2. Filter audio_meta.json voices
const meta = JSON.parse(fs.readFileSync(path.join(PROJ, "audio_meta.json"), "utf8"));
meta.voices = meta.voices.filter(v => v.frame <= MAXF);
fs.writeFileSync(path.join(PROJ, "audio_meta.json"), JSON.stringify(meta, null, 2));
console.log("audio_meta.json trimmed to " + meta.voices.length + " voices");

// 3. Regenerate frame-durations.cjs (audio + gap) for kept frames
const durs = {};
for (const v of meta.voices) durs[String(v.frame).padStart(2, "0")] = +(v.duration_s + GAP).toFixed(2);
fs.writeFileSync(path.join(PROJ, "frame-durations.cjs"), "module.exports = " + JSON.stringify(durs, null, 2) + ";\n");
const total = Object.values(durs).reduce((a, b) => a + b, 0);
console.log("frame-durations.cjs: " + Object.keys(durs).length + " frames, total " + total.toFixed(2) + "s");

// 4. Regenerate STORYBOARD.md for kept frames (reuse gen-storyboard logic inline)
const scriptFile = fs.existsSync(path.join(PROJ, "SCRIPT-v2.md")) ? "SCRIPT-v2.md" : "SCRIPT.md";
const scriptRaw = fs.readFileSync(path.join(PROJ, scriptFile), "utf8");
const lines = {};
for (const l of scriptRaw.split("\n")) {
  const m = l.trim().match(/^(\d+)\s*\|\s*(.+)$/);
  if (m) lines[parseInt(m[1])] = m[2].trim();
}
const SECTIONS = [
  [1, 7, "Hook"], [8, 22, "Fakta 1 — Catnip"], [23, 31, "Fakta 2 — Jam Tidur"],
  [32, 38, "Fakta 3 — Dengkuran"], [39, 45, "Fakta 4 — Kumis"], [46, 53, "Fakta 5 — Mata & Telinga"],
  [54, 59, "Fakta 6 — Rasa Manis"], [60, 64, "Fakta 7 — Suara Meong"], [65, 71, "Fakta 8 — Hidung & Leher"],
  [72, 78, "Fakta 9 — Refleks Lompat"], [79, 84, "Fakta 10 — Grooming"], [85, 91, "Fakta 11 — Umur Kucing"],
  [92, 97, "Penutup"],
];
function sectionOf(n) { for (const [a, b, name] of SECTIONS) if (n >= a && n <= b) return name; return ""; }
const fileByNum = {};
for (const d of defs) fileByNum[d.num] = d.file;
let sb = `---
format: 1920x1080
duration: ${Math.round(total)}s
message: "11 fakta unik kucing — segmen Hook + Fakta 1–3 (catnip, jam tidur, dengkuran)."
audience: penonton umum Indonesia, pecinta kucing
mode: autonomous
music: none
---

## Video direction

Palette coral/cream/charcoal/gold. Recurring orange tabby cat. Image hero per frame. 1.0s gap antar frame.

---

`;
let tot = 0;
for (const v of meta.voices) {
  const n = v.frame, nn = String(n).padStart(2, "0");
  const dur = +(v.duration_s + GAP).toFixed(2); tot += dur;
  sb += `## Frame ${n} — ${sectionOf(n)}\n\n- scene: image hero ilustrasi frame-${nn} + accent bar\n- voiceover: "${lines[n] || ""}"\n- duration: ${dur}s\n- transition_in: cut\n- status: outline\n- src: compositions/frames/${fileByNum[nn] || nn + ".html"}\n\n`;
}
sb += `\nTotal timeline: ${tot.toFixed(2)}s\n`;
fs.writeFileSync(path.join(PROJ, "STORYBOARD.md"), sb);
console.log("STORYBOARD.md regenerated for " + meta.voices.length + " frames, " + tot.toFixed(2) + "s");

// 5. Update assessment expected frame count for this trimmed render
let assess = fs.readFileSync(path.join(PROJ, "assess-composition.cjs"), "utf8");
assess = assess.replace(/const EXPECT_FRAMES = \d+;/, "const EXPECT_FRAMES = " + MAXF + ";");
fs.writeFileSync(path.join(PROJ, "assess-composition.cjs"), assess);
console.log("assess EXPECT_FRAMES -> " + MAXF);

// 6. Rebuild frames, inject images, rebuild captions, assemble index
const run = (cmd, args, label) => {
  console.log("--- " + label + " ---");
  execFileSync(cmd, args, { cwd: PROJ, stdio: "inherit" });
};
run(process.execPath, [path.join(PROJ, "build-frames.cjs")], "build frames");
run(process.execPath, [path.join(PROJ, "inject-images.cjs")], "inject images");
run(process.execPath, ["C:\\Users\\USER\\.agents\\skills\\faceless-explainer\\scripts\\captions.mjs", "build", "--storyboard", "./STORYBOARD.md", "--audio-meta", "./audio_meta.json", "--hyperframes", "."], "build captions");
run(process.execPath, ["C:\\Users\\USER\\.agents\\skills\\faceless-explainer\\scripts\\assemble-index.mjs"], "assemble index");

console.log("\nTrimmed build complete: " + MAXF + " frames, ~" + tot.toFixed(1) + "s.");
