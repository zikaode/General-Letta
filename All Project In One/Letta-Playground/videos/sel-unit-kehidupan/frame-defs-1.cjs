// frame-defs-1.cjs — frames 01–09 (hook → gen) — v3 REDESIGN
// Big typography (titles ≥100px, numbers ≥220px, subs ≥40px, min 30px).
// Image-aware: image-hero frames are text + accents only; diagram frames keep
// bigger/thicker shapes. No white boxes/cards. Text lives in top/bottom thirds
// (scrim darkens those zones); center stays clear for the image.
// Element kinds: text | shape | svg. tl ops: {id, at, from+to2} or {id, at, to}.
const C = "#E85D5D", CR = "#F5F0E8", INK = "#1A1A1A", GRAY = "#6B6B6B", GRN = "#7BC47F", GOLD = "#FFD166";

module.exports = [
  // ── 01 HOOK — "37 triliun sel" ──
  {
    num: "01", file: "01-hook.html", compositionId: "01-hook", bg: INK,
    elements: [
      { kind: "text", id: "f01-sub", text: "MESIN MIKROSKOPIS DI DALAM TUBUHMU", size: 40, ls: 8, color: CR, pos: { left: 0, top: 120, width: 1920 } },
      { kind: "shape", id: "f01-cell", x: 840, y: 430, w: 240, h: 240, round: 1, border: `8px solid ${C}`, glow: 70 },
      { kind: "shape", id: "f01-nuc", x: 915, y: 505, w: 90, h: 90, round: 1, bg: C, glow: 40 },
      { kind: "text", id: "f01-num", text: "37", size: 260, ls: 6, color: CR, pos: { left: 0, top: 380, width: 1920 } },
      { kind: "text", id: "f01-numlabel", text: "TRILIUN SEL", size: 56, ls: 12, color: C, pos: { left: 0, top: 700, width: 1920 } },
    ],
    tl: [
      { id: "f01-sub", at: 0.4, from: { opacity: 0, y: -30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
      { id: "f01-cell", at: 1.2, from: { opacity: 0, scale: 0.5 }, to2: { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" } },
      { id: "f01-nuc", at: 1.8, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" } },
      { id: "f01-cell", at: 4.5, to: { scale: 0.5, x: -320, opacity: 0.35, duration: 1.0, ease: "power2.inOut" } },
      { id: "f01-nuc", at: 4.5, to: { scale: 0.5, x: -320, opacity: 0.35, duration: 1.0, ease: "power2.inOut" } },
      { id: "f01-sub", at: 4.5, to: { opacity: 0, duration: 0.5 } },
      { id: "f01-num", at: 5.6, from: { opacity: 0, scale: 0.85 }, to2: { opacity: 1, scale: 1, duration: 1.3, ease: "power3.out" } },
      { id: "f01-numlabel", at: 6.8, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" } },
    ],
  },
  // ── 02 KONSEP — image hero: big title + underline + sub ──
  {
    num: "02", file: "02-konsep.html", compositionId: "02-konsep", bg: CR,
    elements: [
      { kind: "text", id: "f02-label", text: "SEL", size: 150, ls: 20, color: INK, pos: { left: 0, top: 130, width: 1920 } },
      { kind: "shape", id: "f02-bar", x: 760, y: 330, w: 400, h: 14, bg: C, glow: 30 },
      { kind: "shape", id: "f02-d1", x: 680, y: 322, w: 22, h: 22, round: 1, bg: C, glow: 20 },
      { kind: "shape", id: "f02-d2", x: 1218, y: 322, w: 22, h: 22, round: 1, bg: C, glow: 20 },
      { kind: "text", id: "f02-sub", text: "UNIT TERKECIL KEHIDUPAN", size: 52, ls: 10, color: C, pos: { left: 0, top: 880, width: 1920 } },
    ],
    tl: [
      { id: "f02-label", at: 0.4, from: { opacity: 0, y: -40 }, to2: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" } },
      { id: "f02-bar", at: 1.2, from: { opacity: 0, scaleX: 0 }, to2: { opacity: 1, scaleX: 1, duration: 0.9, ease: "power3.out" } },
      { id: "f02-d1", at: 1.6, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" } },
      { id: "f02-d2", at: 1.8, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" } },
      { id: "f02-sub", at: 2.6, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" } },
    ],
  },
  // ── 03 SKALA — huge number + hair line ──
  {
    num: "03", file: "03-skala.html", compositionId: "03-skala", bg: INK,
    elements: [
      { kind: "text", id: "f03-q", text: "SEBERAPA KECIL?", size: 110, ls: 10, color: C, pos: { left: 0, top: 110, width: 1920 } },
      { kind: "shape", id: "f03-hair", x: 160, y: 560, w: 1600, h: 12, bg: CR, glow: 20 },
      { kind: "shape", id: "f03-d1", x: 500, y: 556, w: 20, h: 20, round: 1, bg: CR, glow: 15 },
      { kind: "shape", id: "f03-d2", x: 950, y: 556, w: 20, h: 20, round: 1, bg: CR, glow: 15 },
      { kind: "shape", id: "f03-d3", x: 1400, y: 556, w: 20, h: 20, round: 1, bg: CR, glow: 15 },
      { kind: "text", id: "f03-num", text: "10.000", size: 240, ls: 8, color: CR, pos: { left: 0, top: 300, width: 1920 } },
      { kind: "text", id: "f03-numlabel", text: "SEL SEJAJAR DALAM 1 HELAI RAMBUT", size: 40, ls: 6, color: CR, pos: { left: 0, top: 900, width: 1920 } },
    ],
    tl: [
      { id: "f03-q", at: 0.4, from: { opacity: 0, y: -30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
      { id: "f03-hair", at: 1.2, from: { opacity: 0, scaleX: 0 }, to2: { opacity: 1, scaleX: 1, duration: 1.3, ease: "power3.out" } },
      { id: "f03-d1", at: 2.6, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" } },
      { id: "f03-d2", at: 2.9, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" } },
      { id: "f03-d3", at: 3.2, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" } },
      { id: "f03-q", at: 4.0, to: { opacity: 0, duration: 0.5 } },
      { id: "f03-num", at: 4.6, from: { opacity: 0, scale: 0.85 }, to2: { opacity: 1, scale: 1, duration: 1.3, ease: "power3.out" } },
      { id: "f03-numlabel", at: 6.0, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" } },
    ],
  },
  // ── 04 PENEMUAN — big year + grid boxes ──
  {
    num: "04", file: "04-penemuan.html", compositionId: "04-penemuan", bg: CR,
    elements: [
      { kind: "text", id: "f04-year", text: "1665", size: 260, ls: 10, color: C, pos: { left: 0, top: 140, width: 1920 } },
      { kind: "text", id: "f04-name", text: "ROBERT HOOKE", size: 52, ls: 12, color: INK, pos: { left: 0, top: 460, width: 1920 } },
      { kind: "shape", id: "f04-g1", x: 690, y: 600, w: 130, h: 130, border: `5px solid ${INK}` },
      { kind: "shape", id: "f04-g2", x: 830, y: 600, w: 130, h: 130, border: `5px solid ${INK}` },
      { kind: "shape", id: "f04-g3", x: 970, y: 600, w: 130, h: 130, border: `5px solid ${INK}` },
      { kind: "shape", id: "f04-g4", x: 1110, y: 600, w: 130, h: 130, border: `5px solid ${INK}` },
      { kind: "text", id: "f04-cellula", text: '"CELLULA" — SEL', size: 40, ls: 6, color: C, pos: { left: 0, top: 830, width: 1920 } },
    ],
    tl: [
      { id: "f04-year", at: 0.4, from: { opacity: 0, scale: 0.9 }, to2: { opacity: 1, scale: 1, duration: 1.3, ease: "power3.out" } },
      { id: "f04-name", at: 1.4, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
      { id: "f04-g1", at: 2.8, to: { opacity: 1, duration: 0.5 } },
      { id: "f04-g2", at: 3.1, to: { opacity: 1, duration: 0.5 } },
      { id: "f04-g3", at: 3.4, to: { opacity: 1, duration: 0.5 } },
      { id: "f04-g4", at: 3.7, to: { opacity: 1, duration: 0.5 } },
      { id: "f04-cellula", at: 5.0, from: { opacity: 0 }, to2: { opacity: 1, duration: 1.0 } },
    ],
  },
  // ── 05 MEMBRAN — transport diagram, thicker & bigger ──
  {
    num: "05", file: "05-membran.html", compositionId: "05-membran", bg: INK,
    elements: [
      { kind: "text", id: "f05-label", text: "MEMBRAN", size: 130, ls: 14, color: CR, pos: { left: 0, top: 100, width: 1920 } },
      { kind: "shape", id: "f05-cell", x: 660, y: 300, w: 600, h: 600, round: 1, border: `12px solid ${C}`, glow: 50 },
      { kind: "shape", id: "f05-nuc", x: 900, y: 540, w: 120, h: 120, round: 1, bg: C, glow: 30 },
      { kind: "shape", id: "f05-in", x: 420, y: 570, w: 60, h: 60, round: 1, bg: GRN, glow: 25 },
      { kind: "shape", id: "f05-out", x: 1440, y: 570, w: 60, h: 60, round: 1, bg: GRAY, glow: 15 },
      { kind: "text", id: "f05-masuk", text: "NUTRISI MASUK", size: 34, ls: 4, color: GRN, pos: { left: 240, top: 470, width: 320 } },
      { kind: "text", id: "f05-keluar", text: "LIMBAH KELUAR", size: 34, ls: 4, color: GRAY, pos: { left: 1360, top: 470, width: 320 } },
      { kind: "text", id: "f05-sub", text: "GERBANG PENJAGA SEL", size: 48, ls: 8, color: C, pos: { left: 0, top: 920, width: 1920 } },
    ],
    tl: [
      { id: "f05-label", at: 0.4, from: { opacity: 0, y: -30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
      { id: "f05-cell", at: 0.8, from: { opacity: 0, scale: 0.85 }, to2: { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" } },
      { id: "f05-nuc", at: 1.5, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" } },
      { id: "f05-masuk", at: 2.4, to: { opacity: 1, duration: 0.6 } },
      { id: "f05-in", at: 2.6, from: { opacity: 0, x: 0 }, to2: { opacity: 1, x: 320, duration: 1.6, ease: "power2.inOut" } },
      { id: "f05-keluar", at: 4.0, to: { opacity: 1, duration: 0.6 } },
      { id: "f05-out", at: 4.2, from: { opacity: 1, x: 0 }, to2: { opacity: 0.5, x: -320, duration: 1.6, ease: "power2.inOut" } },
      { id: "f05-sub", at: 6.2, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
    ],
  },
  // ── 06 SITOPLASMA — gel + particles, bigger ──
  {
    num: "06", file: "06-sitoplasma.html", compositionId: "06-sitoplasma", bg: CR,
    elements: [
      { kind: "text", id: "f06-label", text: "SITOPLASMA", size: 120, ls: 14, color: INK, pos: { left: 0, top: 100, width: 1920 } },
      { kind: "shape", id: "f06-gel", x: 510, y: 260, w: 900, h: 560, round: 1, bg: "rgba(232,93,93,0.10)", border: `6px solid ${C}`, glow: 30 },
      { kind: "shape", id: "f06-p1", x: 660, y: 360, w: 40, h: 40, round: 1, bg: C, glow: 20 },
      { kind: "shape", id: "f06-p2", x: 880, y: 500, w: 32, h: 32, round: 1, bg: GRAY },
      { kind: "shape", id: "f06-p3", x: 1080, y: 340, w: 44, h: 44, round: 1, bg: C, glow: 20 },
      { kind: "shape", id: "f06-p4", x: 760, y: 620, w: 28, h: 28, round: 1, bg: INK },
      { kind: "shape", id: "f06-p5", x: 1020, y: 660, w: 36, h: 36, round: 1, bg: GRAY },
      { kind: "text", id: "f06-sub", text: "JUTAAN REAKSI SETIAP DETIK", size: 44, ls: 8, color: C, pos: { left: 0, top: 900, width: 1920 } },
    ],
    tl: [
      { id: "f06-label", at: 0.4, from: { opacity: 0, y: -30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
      { id: "f06-gel", at: 0.8, from: { opacity: 0, scale: 0.9 }, to2: { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" } },
      { id: "f06-p1", at: 1.8, to: { opacity: 1, duration: 0.4 } },
      { id: "f06-p2", at: 2.1, to: { opacity: 1, duration: 0.4 } },
      { id: "f06-p3", at: 2.4, to: { opacity: 1, duration: 0.4 } },
      { id: "f06-p4", at: 2.7, to: { opacity: 1, duration: 0.4 } },
      { id: "f06-p5", at: 3.0, to: { opacity: 1, duration: 0.4 } },
      { id: "f06-sub", at: 4.4, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
    ],
  },
  // ── 07 NUKLEUS — image hero: title + glowing nucleus accent ──
  {
    num: "07", file: "07-nukleus.html", compositionId: "07-nukleus", bg: INK,
    elements: [
      { kind: "text", id: "f07-label", text: "NUKLEUS", size: 140, ls: 18, color: CR, pos: { left: 0, top: 120, width: 1920 } },
      { kind: "shape", id: "f07-bar", x: 760, y: 320, w: 400, h: 12, bg: C, glow: 30 },
      { kind: "shape", id: "f07-nuc", x: 880, y: 460, w: 160, h: 160, round: 1, bg: C, glow: 80 },
      { kind: "text", id: "f07-sub", text: "KANTOR PUSAT SEL", size: 48, ls: 10, color: C, pos: { left: 0, top: 880, width: 1920 } },
    ],
    tl: [
      { id: "f07-label", at: 0.4, from: { opacity: 0, y: -40 }, to2: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" } },
      { id: "f07-bar", at: 1.2, from: { opacity: 0, scaleX: 0 }, to2: { opacity: 1, scaleX: 1, duration: 0.9, ease: "power3.out" } },
      { id: "f07-nuc", at: 2.2, from: { opacity: 0, scale: 0 }, to2: { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" } },
      { id: "f07-nuc", at: 4.0, to: { scale: 1.12, duration: 1.6, ease: "sine.inOut" } },
      { id: "f07-sub", at: 5.2, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
    ],
  },
  // ── 08 DNA — image hero: title + helix + big stat ──
  {
    num: "08", file: "08-dna.html", compositionId: "08-dna", bg: INK,
    elements: [
      { kind: "text", id: "f08-label", text: "DNA", size: 150, ls: 24, color: C, pos: { left: 0, top: 110, width: 1920 } },
      {
        kind: "svg", id: "f08-helix", viewBox: "0 0 400 400", x: 760, y: 330, w: 400, h: 400,
        shapes: [
          { tag: "path", attrs: { d: "M100 20 Q 300 100 100 180 Q 100 260 300 340", fill: "none", stroke: C, "stroke-width": 10 } },
          { tag: "path", attrs: { d: "M300 20 Q 100 100 300 180 Q 300 260 100 340", fill: "none", stroke: CR, "stroke-width": 10 } },
          { tag: "line", attrs: { x1: 150, y1: 60, x2: 250, y2: 60, stroke: GRAY, "stroke-width": 6 } },
          { tag: "line", attrs: { x1: 130, y1: 120, x2: 270, y2: 120, stroke: GRAY, "stroke-width": 6 } },
          { tag: "line", attrs: { x1: 140, y1: 240, x2: 260, y2: 240, stroke: GRAY, "stroke-width": 6 } },
          { tag: "line", attrs: { x1: 160, y1: 300, x2: 240, y2: 300, stroke: GRAY, "stroke-width": 6 } },
        ],
      },
      { kind: "text", id: "f08-num", text: "2 METER", size: 130, ls: 8, color: CR, pos: { left: 0, top: 780, width: 1920 } },
      { kind: "text", id: "f08-numlabel", text: "DARI SATU SEL SAJA", size: 40, ls: 8, color: C, pos: { left: 0, top: 930, width: 1920 } },
    ],
    tl: [
      { id: "f08-label", at: 0.4, from: { opacity: 0, y: -40 }, to2: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" } },
      { id: "f08-helix", at: 1.0, from: { opacity: 0, scale: 0.8 }, to2: { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" } },
      { id: "f08-num", at: 3.6, from: { opacity: 0, scale: 0.9 }, to2: { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" } },
      { id: "f08-numlabel", at: 4.8, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
    ],
  },
  // ── 09 GEN — tabs + arrow, no white book ──
  {
    num: "09", file: "09-gen.html", compositionId: "09-gen", bg: CR,
    elements: [
      { kind: "text", id: "f09-label", text: "GEN", size: 130, ls: 20, color: INK, pos: { left: 0, top: 110, width: 1920 } },
      { kind: "shape", id: "f09-t1", x: 660, y: 380, w: 200, h: 70, bg: C, glow: 20 },
      { kind: "shape", id: "f09-t2", x: 660, y: 470, w: 200, h: 70, bg: C, glow: 20 },
      { kind: "shape", id: "f09-t3", x: 660, y: 560, w: 200, h: 70, bg: C, glow: 20 },
      { kind: "text", id: "f09-arrow", text: "1 GEN → 1 PROTEIN", size: 56, ls: 6, color: C, pos: { left: 0, top: 720, width: 1920 } },
      { kind: "text", id: "f09-sub", text: "RIBUAN BAB RESEP KEHIDUPAN", size: 36, ls: 6, color: INK, pos: { left: 0, top: 830, width: 1920 } },
    ],
    tl: [
      { id: "f09-label", at: 0.4, from: { opacity: 0, y: -30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
      { id: "f09-t1", at: 1.4, from: { opacity: 0, x: -80 }, to2: { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" } },
      { id: "f09-t2", at: 1.8, from: { opacity: 0, x: -80 }, to2: { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" } },
      { id: "f09-t3", at: 2.2, from: { opacity: 0, x: -80 }, to2: { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" } },
      { id: "f09-arrow", at: 3.4, from: { opacity: 0, y: 30 }, to2: { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" } },
      { id: "f09-sub", at: 4.6, from: { opacity: 0 }, to2: { opacity: 1, duration: 1.0 } },
    ],
  },
];
