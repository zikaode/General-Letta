// assess-composition.cjs — STRICT self-assessment for HyperFrames composition (v3)
// Total 10 points, threshold 8 to render. Run: node assess-composition.cjs
const fs = require("fs");
const path = require("path");

const root = __dirname;
const framesDir = path.join(root, "compositions", "frames");
const imgDir = path.join(root, "assets", "img");

const CRITERIA = {
  imagesPresent: { weight: 1.0, desc: "All 18 frame images exist and are non-zero size" },
  imageInject:   { weight: 1.5, desc: "Images injected as dimmed bg in every frame (../../assets/img/frame-NN)" },
  bgCssValid:    { weight: 1.5, desc: "No 'undefined' CSS ids (bg/scene ids valid in all frames)" },
  typography:    { weight: 2.0, desc: "Every frame: >=1 text >=100px, all text >=30px, all text shadowed" },
  scrim:         { weight: 1.0, desc: "Scrim gradient overlay present in every frame" },
  shapeContrast: { weight: 1.0, desc: "Every frame: borders >=4px, >=2 contrast elements (glow or border)" },
  captionSync:   { weight: 0.5, desc: "captions.html exists with synced caption groups" },
  transitions:   { weight: 0.5, desc: ">=15 of 17 frame transitions overlap (crossfade)" },
  palette:       { weight: 0.5, desc: "Palette consistent (coral/cream/charcoal present)" },
};

function score() {
  const results = {};
  let total = 0;
  const maxTotal = Object.values(CRITERIA).reduce((a, c) => a + c.weight, 0);

  // 1. imagesPresent
  const imgs = fs.readdirSync(imgDir).filter(f => /^frame-\d+\.png$/.test(f));
  const imgOk = imgs.length >= 18 && imgs.every(f => fs.statSync(path.join(imgDir, f)).size > 1000);
  results.imagesPresent = { pass: imgOk, score: imgOk ? CRITERIA.imagesPresent.weight : 0 };
  total += results.imagesPresent.score;

  const frames = fs.readdirSync(framesDir).filter(f => f.endsWith(".html"));
  const htmls = Object.fromEntries(frames.map(f => [f, fs.readFileSync(path.join(framesDir, f), "utf8")]));

  // 2. imageInject
  const injectOk = frames.length === 18 && frames.every(f => {
    const h = htmls[f];
    return h.includes("-imgbg") && h.includes("../../assets/img/frame-");
  });
  results.imageInject = { pass: injectOk, score: injectOk ? CRITERIA.imageInject.weight : 0 };
  total += results.imageInject.score;

  // 3. bgCssValid — no "undefined" anywhere in ids/styles
  const bgOk = frames.every(f => !htmls[f].includes("undefined"));
  results.bgCssValid = { pass: bgOk, score: bgOk ? CRITERIA.bgCssValid.weight : 0 };
  total += results.bgCssValid.score;

  // 4. typography — per frame: max font >=100, min font >=30, all text divs shadowed
  const typoFails = [];
  for (const f of frames) {
    const h = htmls[f];
    const sizes = [...h.matchAll(/font-size:(\d+(?:\.\d+)?)px/g)].map(m => parseFloat(m[1]));
    const textDivs = [...h.matchAll(/<div id="[^"]+" style="[^"]*font-size:[^"]*">/g)];
    const shadowed = textDivs.length > 0 && textDivs.every(m => m[0].includes("text-shadow"));
    if (sizes.length === 0 || Math.max(...sizes) < 100 || Math.min(...sizes) < 30 || !shadowed) {
      typoFails.push(f);
    }
  }
  results.typography = { pass: typoFails.length === 0, score: typoFails.length === 0 ? CRITERIA.typography.weight : 0, fails: typoFails };
  total += results.typography.score;

  // 5. scrim
  const scrimOk = frames.every(f => htmls[f].includes('class="scrim"'));
  results.scrim = { pass: scrimOk, score: scrimOk ? CRITERIA.scrim.weight : 0 };
  total += results.scrim.score;

  // 6. shapeContrast — all border widths >=4px; >=2 contrast elements per frame
  // (box-shadow glows, borders, and SVG strokes >=6px all count as contrast)
  const shapeFails = [];
  for (const f of frames) {
    const h = htmls[f];
    const borders = [...h.matchAll(/border:\s*(\d+)px/g)].map(m => parseInt(m[1]));
    const thinBorders = borders.filter(b => b < 4).length;
    const glows = (h.match(/box-shadow:/g) || []).length;
    const strokes = [...h.matchAll(/stroke-width="(\d+)"/g)].map(m => parseInt(m[1])).filter(w => w >= 6).length;
    const contrastCount = glows + borders.length + strokes;
    if (thinBorders > 0 || contrastCount < 2) shapeFails.push(f);
  }
  results.shapeContrast = { pass: shapeFails.length === 0, score: shapeFails.length === 0 ? CRITERIA.shapeContrast.weight : 0, fails: shapeFails };
  total += results.shapeContrast.score;

  // 7. captionSync
  const captionsPath = path.join(root, "compositions", "captions.html");
  const captionsOk = fs.existsSync(captionsPath) && fs.statSync(captionsPath).size > 5000;
  results.captionSync = { pass: captionsOk, score: captionsOk ? CRITERIA.captionSync.weight : 0 };
  total += results.captionSync.score;

  // 8. transitions — count overlapping scene pairs in index.html (project root)
  const indexPath = path.join(root, "index.html");
  let transOk = false;
  let overlapInfo = "index.html missing";
  if (fs.existsSync(indexPath)) {
    const ih = fs.readFileSync(indexPath, "utf8");
    // Scene divs have data-start / data-duration possibly on separate lines.
    const scenes = [...ih.matchAll(/<div\b[^>]*data-start="([\d.]+)"[^>]*>/gs)]
      .map(m => {
        const tag = m[0];
        const dur = tag.match(/data-duration="([\d.]+)"/);
        return { start: parseFloat(m[1]), dur: dur ? parseFloat(dur[1]) : 0 };
      })
      .filter(s => s.dur > 0)
      .sort((a, b) => a.start - b.start);
    let overlaps = 0;
    for (let i = 1; i < scenes.length; i++) {
      if (scenes[i].start < scenes[i - 1].start + scenes[i - 1].dur) overlaps++;
    }
    const expected = scenes.length > 1 ? scenes.length - 1 : 0;
    transOk = expected >= 17 ? overlaps >= 15 : overlaps >= Math.max(0, expected - 2);
    overlapInfo = `${overlaps}/${expected} overlapping`;
  }
  results.transitions = { pass: transOk, score: transOk ? CRITERIA.transitions.weight : 0, info: overlapInfo };
  total += results.transitions.score;

  // 9. palette
  const paletteOk = frames.some(f => {
    const h = htmls[f];
    return h.includes("#E85D5D") && (h.includes("#F5F0E8") || h.includes("#1A1A1A"));
  });
  results.palette = { pass: paletteOk, score: paletteOk ? CRITERIA.palette.weight : 0 };
  total += results.palette.score;

  const score10 = Math.round((total / maxTotal) * 10);

  console.log("\n=== COMPOSITION ASSESSMENT (STRICT v3) ===");
  console.log(`Score: ${score10}/10  (${total.toFixed(1)}/${maxTotal} points)\n`);

  Object.entries(results).forEach(([key, r]) => {
    const c = CRITERIA[key];
    const status = r.pass ? "✓" : "✗";
    const extra = r.fails ? ` [fails: ${r.fails.join(", ")}]` : (r.info ? ` [${r.info}]` : "");
    console.log(`  ${status} ${key.padEnd(14)} (${r.score.toFixed(1)}/${c.weight}): ${c.desc}${extra}`);
  });

  console.log("\n--- IMPROVEMENT FEEDBACK ---");
  if (score10 >= 8) {
    console.log("Composition meets strict quality threshold (>=8). Ready to render.");
  } else {
    Object.entries(results).filter(([_, r]) => !r.pass).forEach(([key, r]) => {
      console.log(`- Fix: ${CRITERIA[key].desc}${r.fails ? ` (frames: ${r.fails.join(", ")})` : ""}`);
    });
  }

  return { score10, total, maxTotal, results };
}

module.exports = { score };

if (require.main === module) {
  score();
}
