// gen-frame-defs.cjs — generate frame-defs.cjs from SCRIPT.md + section map.
// Design: v3 system. Fact-title frames get big "FAKTA N" title; all other
// frames are image-hero (accent bar + glowing dot only — image is the star).
const fs = require("fs");
const path = require("path");

const C = "#E85D5D", CR = "#F5F0E8", INK = "#1A1A1A", GOLD = "#FFD166";

// Section → bg + title for fact frames (SCRIPT-v2 numbering: facts start at
// 8, 23, 32, 39, 46, 54, 60, 65, 72, 79, 85; hook = frames 1–7; penutup = 92–97).
const FACTS = [
  { start: 8,  n: 1,  title: "FAKTA 1 — CATNIP" },
  { start: 23, n: 2,  title: "FAKTA 2 — JAM TIDUR" },
  { start: 32, n: 3,  title: "FAKTA 3 — DENGKURAN" },
  { start: 39, n: 4,  title: "FAKTA 4 — KUMIS" },
  { start: 46, n: 5,  title: "FAKTA 5 — MATA & TELINGA" },
  { start: 54, n: 6,  title: "FAKTA 6 — RASA MANIS" },
  { start: 60, n: 7,  title: "FAKTA 7 — SUARA MEONG" },
  { start: 65, n: 8,  title: "FAKTA 8 — HIDUNG & LEHER" },
  { start: 72, n: 9,  title: "FAKTA 9 — REFLEKS LOMPAT" },
  { start: 79, n: 10, title: "FAKTA 10 — GROOMING" },
  { start: 85, n: 11, title: "FAKTA 11 — UMUR KUCING" },
];
const HOOK_END = 7, PENUTUP_START = 92;
const DARK_SECTIONS = [[1, 7], [23, 31], [39, 45], [54, 59], [65, 71], [79, 84], [92, 97]];

function isDark(num) {
  return DARK_SECTIONS.some(([a, b]) => num >= a && num <= b);
}

const scriptFile = fs.existsSync(path.join(__dirname, "SCRIPT-v2.md")) ? "SCRIPT-v2.md" : "SCRIPT.md";
const scriptRaw = fs.readFileSync(path.join(__dirname, scriptFile), "utf8");
const lines = scriptRaw.split("\n").map(l => l.trim()).filter(l => /^\d+\s*\|/.test(l));

const defs = [];
for (const line of lines) {
  const m = line.match(/^(\d+)\s*\|\s*(.+)$/);
  const num = parseInt(m[1]);
  const text = m[2].trim();
  const nn = String(num).padStart(2, "0");
  const dark = isDark(num);
  const bg = dark ? INK : CR;
  const fact = FACTS.find(f => f.start === num);
  const accent = (num <= HOOK_END || num >= PENUTUP_START) ? GOLD : C;
  const accentGlow = accent === GOLD ? "rgba(255,209,102,0.5)" : "rgba(232,93,93,0.5)";

  let elements, tl;
  if (fact) {
    // ── Fact-title frame ──
    const titleColor = dark ? CR : INK;
    elements = [
      { kind: "text", id: `f${nn}-title`, text: fact.title, size: 120, ls: 10, color: titleColor, pos: { left: 0, top: 380, width: 1920 } },
      { kind: "shape", id: `f${nn}-bar`, x: 760, y: 570, w: 400, h: 14, bg: accent, glow: 40, glowColor: accentGlow },
      { kind: "shape", id: `f${nn}-d1`, x: 700, y: 566, w: 22, h: 22, round: 1, bg: accent, glow: 25, glowColor: accentGlow },
      { kind: "shape", id: `f${nn}-d2`, x: 1198, y: 566, w: 22, h: 22, round: 1, bg: accent, glow: 25, glowColor: accentGlow },
    ];
    tl = [
      { id: `f${nn}-title`, at: 0.2, from: { opacity: 0, scale: 0.9 }, to2: { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" } },
      { id: `f${nn}-bar`, at: 0.8, from: { opacity: 0, scaleX: 0 }, to2: { opacity: 1, scaleX: 1, duration: 0.7, ease: "power3.out" } },
      { id: `f${nn}-d1`, at: 1.1, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" } },
      { id: `f${nn}-d2`, at: 1.3, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" } },
    ];
  } else if (num === 98) {
    // ── Closing line ──
    elements = [
      { kind: "text", id: `f${nn}-end`, text: "SAMPAI KETEMU!", size: 130, ls: 12, color: CR, pos: { left: 0, top: 420, width: 1920 } },
      { kind: "shape", id: `f${nn}-bar`, x: 760, y: 620, w: 400, h: 14, bg: GOLD, glow: 40, glowColor: accentGlow },
      { kind: "shape", id: `f${nn}-d1`, x: 460, y: 300, w: 24, h: 24, round: 1, bg: C, glow: 30 },
      { kind: "shape", id: `f${nn}-d2`, x: 1440, y: 740, w: 24, h: 24, round: 1, bg: C, glow: 30 },
    ];
    tl = [
      { id: `f${nn}-end`, at: 0.2, from: { opacity: 0, y: 40 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
      { id: `f${nn}-bar`, at: 0.8, from: { opacity: 0, scaleX: 0 }, to2: { opacity: 1, scaleX: 1, duration: 0.7, ease: "power3.out" } },
      { id: `f${nn}-d1`, at: 1.0, to: { opacity: 1, duration: 0.5 } },
      { id: `f${nn}-d2`, at: 1.2, to: { opacity: 1, duration: 0.5 } },
    ];
  } else if (num === 1) {
    // ── Opening hook title ──
    elements = [
      { kind: "text", id: `f${nn}-big`, text: "KUCING 'MABUK'?", size: 150, ls: 10, color: CR, pos: { left: 0, top: 400, width: 1920 } },
      { kind: "shape", id: `f${nn}-bar`, x: 760, y: 610, w: 400, h: 14, bg: GOLD, glow: 40, glowColor: accentGlow },
      { kind: "shape", id: `f${nn}-d1`, x: 700, y: 606, w: 22, h: 22, round: 1, bg: GOLD, glow: 25, glowColor: accentGlow },
      { kind: "shape", id: `f${nn}-d2`, x: 1198, y: 606, w: 22, h: 22, round: 1, bg: GOLD, glow: 25, glowColor: accentGlow },
    ];
    tl = [
      { id: `f${nn}-big`, at: 0.2, from: { opacity: 0, scale: 0.9 }, to2: { opacity: 1, scale: 1, duration: 1.0, ease: "power3.out" } },
      { id: `f${nn}-bar`, at: 0.9, from: { opacity: 0, scaleX: 0 }, to2: { opacity: 1, scaleX: 1, duration: 0.7, ease: "power3.out" } },
      { id: `f${nn}-d1`, at: 1.2, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" } },
      { id: `f${nn}-d2`, at: 1.4, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" } },
    ];
  } else {
    // ── Image-hero frame: clean image, NO motion graphics ──
    // User feedback: the accent bar/dot repeated on every frame felt templated.
    // The image is strong enough on its own — keep these frames completely clean.
    elements = [];
    tl = [];
  }

  const name = text.split(/\s+/).slice(0, 3).join("-").replace(/[^\w-]/g, "").toLowerCase();
  defs.push({
    num: nn, file: `${nn}-${name || "frame"}.html`, compositionId: `${nn}-${name || "frame"}`,
    bg, elements, tl,
  });
}

const out = `// frame-defs.cjs — GENERATED by gen-frame-defs.cjs. Do not hand-edit.
module.exports = ${JSON.stringify(defs, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, "frame-defs.cjs"), out);
console.log(`frame-defs.cjs written: ${defs.length} frames`);
console.log(`Fact titles at: ${FACTS.map(f => String(f.start).padStart(2, "0")).join(", ")}`);
