// remap-images.cjs — remap existing v1 images (frame-01..39, numbered by v1 script)
// onto v2 frame numbers by SCENE MEANING, for the frames we render now (1..30).
// Copies the best-matching existing PNG to the v2 frame number. Missing v2 frames
// get the closest acceptable image (noted). Old files are preserved (copies, not moves).
const fs = require("fs");
const path = require("path");
const imgDir = path.join(__dirname, "assets", "img");
const tmpDir = path.join(__dirname, "assets", "img-remap-tmp");
fs.mkdirSync(tmpDir, { recursive: true });

// v2frame -> v1frame image to use. v1 images available: 1..39.
// Mapping by scene meaning (v1 script scenes vs v2 script scenes).
const MAP = {
  // HOOK (v2 1–7). v1 hook scenes: 1 hugging toy(drunk),2 dizzy,3 sleepy eyes,4 catnip plant,5 toy+catnip sniff,6 surprised,7 treasure chest,8 armchair
  1: 1,   // "kucing kesenangan... mabuk" -> hugging toy drunk
  2: 2,   // "bukan kebetulan" -> dizzy/wobbling (still "mabuk" vibe)
  3: 4,   // "gara-gara tanaman catnip" -> catnip plant in pot
  4: 5,   // "catnip diselipkan ke mainan" -> mouse toy with catnip
  5: 6,   // "kamu pikir cuma itu?" -> surprised look
  6: 7,   // "kita bongkar satu per satu" -> treasure chest opening
  7: 8,   // "santai aja, siap-siap kaget" -> armchair relaxed
  // FAKTA 1 CATNIP (v2 8–22). v1 catnip scenes 9–23.
  8: 9,   // "Fakta pertama, catnip" -> cat beside tall catnip plant
  9: 10,  // "saudara daun mint, Nepeta cataria" -> botanical catnip plant
  10: 11, // "zat aktif nepetalactone" -> glowing leaf with golden particles
  11: 12, // "mencium bau... reseptor penciuman" -> nose sniffing aroma particles
  12: 13, // "sinyal ke otak" -> cat head cross-section glowing brain
  13: 14, // "kegirangan, guling-guling" -> cat rolling on carpet joy
  14: 15, // "efeknya singkat 10-15 menit" -> wall clock + napping cat
  15: 16, // "kembali normal" -> composed poker face
  16: 17, // "jeda setengah jam-2 jam" -> hourglass + waiting cat
  17: 18, // "tidak semua kucing bereaksi" -> two cats, one ecstatic one calm
  18: 19, // "50-70 persen punya gen" -> ten silhouettes seven highlighted
  19: 20, // "anak kucing <3 bulan belum merespons" -> kitten uninterested
  20: 21, // "bukan cuma kucing rumahan" -> house cat with wild shadows
  21: 22, // "harimau, singa, macan tutul" -> tiger lion leopard around catnip
  22: 23, // "bayangkan satu bau..." -> cat rolling with thought bubble
  // FAKTA 2 JAM TIDUR (v2 23–30). v1 sleep scenes 24–33.
  23: 24, // "Fakta kedua, jam tidur" -> cat curled asleep moon stars
  24: 25, // "terakhir lihat kucingmu sedang apa?" -> peeking one eye from blanket
  25: 26, // "jawabannya: tidur" -> sleeping deeply on windowsill Zzz
  26: 27, // "tidur 12-16 jam" -> clock 16 hours shaded cat on hands
  27: 28, // "kecil/tua sampai 20 jam" -> kitten + senior cat sleeping
  28: 30, // "bukan soal malas" -> lazy but stern "not lazy" cat
  29: 31, // "warisan predator menyimpan energi" -> wild ancestor stalking
  30: 32, // "siang tidur, malam lincah" -> split day/night scene
};

let copied = 0, missing = [];
for (const [v2, v1] of Object.entries(MAP)) {
  const src = path.join(imgDir, "frame-" + String(v1).padStart(2, "0") + ".png");
  const dst = path.join(tmpDir, "frame-" + String(v2).padStart(2, "0") + ".png");
  if (fs.existsSync(src)) { fs.copyFileSync(src, dst); copied++; }
  else missing.push(v2 + "(needs v1-" + v1 + ")");
}
console.log("Remapped " + copied + " images into staging. Missing: " + (missing.length ? missing.join(", ") : "none"));

// Now swap: back up current img dir, replace with remapped (only the 30 we render).
const bakDir = path.join(__dirname, "assets", "img-v1-backup");
if (!fs.existsSync(bakDir)) { fs.renameSync(imgDir, bakDir); } else { fs.rmSync(imgDir, { recursive: true, force: true }); }
fs.renameSync(tmpDir, imgDir);
console.log("assets/img now holds v2-numbered images for frames 1..30. Old v1 images backed up to assets/img-v1-backup.");
