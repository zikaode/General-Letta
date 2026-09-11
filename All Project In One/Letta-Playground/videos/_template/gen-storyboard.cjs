// gen-storyboard.cjs — regenerate STORYBOARD.md with per-frame duration entries
// (audio duration + 1.0s gap), matching the format captions.mjs parseStoryboard reads.
const fs = require("fs");
const path = require("path");

const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "audio_meta.json"), "utf8"));
const GAP = 0.4;

const scriptRaw = fs.readFileSync(path.join(__dirname, "SCRIPT.md"), "utf8");
const lines = {};
for (const l of scriptRaw.split("\n")) {
  const m = l.trim().match(/^(\d+)\s*\|\s*(.+)$/);
  if (m) lines[parseInt(m[1])] = m[2].trim();
}

const SECTIONS = [
  [1, 8, "Hook"], [9, 23, "Fakta 1 — Catnip"], [24, 33, "Fakta 2 — Jam Tidur"],
  [34, 40, "Fakta 3 — Dengkuran"], [41, 47, "Fakta 4 — Kumis"], [48, 55, "Fakta 5 — Mata & Telinga"],
  [56, 61, "Fakta 6 — Rasa Manis"], [62, 66, "Fakta 7 — Suara Meong"], [67, 73, "Fakta 8 — Hidung & Leher"],
  [74, 80, "Fakta 9 — Refleks Lompat"], [81, 86, "Fakta 10 — Grooming"], [87, 93, "Fakta 11 — Umur"],
  [94, 98, "Penutup"],
];
function sectionOf(n) {
  for (const [a, b, name] of SECTIONS) if (n >= a && n <= b) return name;
  return "";
}

let out = `---
format: 1920x1080
duration: 624s
message: "11 fakta unik kucing — dari catnip yang bikin mabuk sampai kenapa mereka tidak bisa merasakan manis."
audience: penonton umum Indonesia, pecinta kucing
mode: autonomous
music: none
---

## Video direction

**Palette** (Coral preset): coral #E85D5D · cream #F5F0E8 · charcoal #1A1A1A · gold #FFD166 (hook/penutup).
**Recurring character**: adult orange tabby cat, cream belly, green eyes — identical in every image.
**Caption band**: bottom ~17% reserved; image hero fills the frame; accent bar top-center only.
**Pace**: one sentence per frame, 1.0s breathing gap between frames.

---

`;

let total = 0;
// src must match the real on-disk frame filename (NN-first-words.html) built by gen-frame-defs.
const defs = require(path.join(__dirname, "frame-defs.cjs"));
const fileByNum = {};
for (const d of defs) fileByNum[d.num] = d.file;

for (const v of meta.voices) {
  const n = v.frame;
  const nn = String(n).padStart(2, "0");
  const dur = +(v.duration_s + GAP).toFixed(2);
  total += dur;
  out += `## Frame ${n} — ${sectionOf(n)}\n\n- scene: image hero ilustrasi (lihat image-config.json prompt frame-${nn}) + accent bar kecil di atas\n- voiceover: "${lines[n] || ""}"\n- duration: ${dur}s\n- transition_in: cut\n- status: outline\n- src: compositions/frames/${fileByNum[nn] || nn + ".html"}\n\n`;
}
out += `\nTotal timeline: ${total.toFixed(2)}s (${(total / 60).toFixed(2)} min)\n`;

fs.writeFileSync(path.join(__dirname, "STORYBOARD.md"), out);
console.log("STORYBOARD.md regenerated:", meta.voices.length, "frames, total", total.toFixed(2) + "s");

// Also rewrite frame-durations.cjs with the same audio+GAP values so everything shares one basis.
const durs = {};
for (const v of meta.voices) {
  durs[String(v.frame).padStart(2, "0")] = +(v.duration_s + GAP).toFixed(2);
}
fs.writeFileSync(
  path.join(__dirname, "frame-durations.cjs"),
  "module.exports = " + JSON.stringify(durs, null, 2) + ";\n"
);
console.log("frame-durations.cjs regenerated with 1.0s gaps included");
