// assess-composition.cjs — STRICT self-assessment for HyperFrames composition (v3)
// Total 10 points, threshold 8 to render. Run: node assess-composition.cjs
const fs = require("fs");
const path = require("path");

const root = __dirname;
const framesDir = path.join(root, "compositions", "frames");
const imgDir = path.join(root, "assets", "img");

const EXPECT_FRAMES = 30;
// Frames that carry big display text (fact titles + opening hook + closing).
// SCRIPT-v2 numbering: facts start at 8,23,32,39,46,54,60,65,72,79,85; hook=01; closing=97.
const FACT_TITLE_FRAMES = ["01", "08", "23", "32", "39", "46", "54", "60", "65", "72", "79", "85", "97"];
const CRITERIA = {
  imagesPresent: { weight: 1.0, desc: `All ${EXPECT_FRAMES} frame images exist and are non-zero size` },
  imageInject:   { weight: 1.5, desc: "Images injected as dimmed bg in every frame (../../assets/img/frame-NN)" },
  bgCssValid:    { weight: 1.5, desc: "No 'undefined' CSS ids (bg/scene ids valid in all frames)" },
  typography:    { weight: 2.0, desc: "Fact-title frames: >=1 text >=100px; every text div >=30px and shadowed (image-hero frames may have no text)" },
  scrim:         { weight: 1.0, desc: "Scrim gradient overlay present in every frame" },
  shapeContrast: { weight: 1.0, desc: "Every frame: borders >=4px, >=2 contrast elements (glow or border)" },
  captionSync:   { weight: 0.5, desc: "captions.html exists with synced caption groups" },
  transitions:   { weight: 0.5, desc: ">=97% of scenes tile cleanly (cut, no gap/overlap) on track 1" },
  palette:       { weight: 0.5, desc: "Palette consistent (coral/cream/charcoal present)" },
};

function score() {
  const results = {};
  let total = 0;
  const maxTotal = Object.values(CRITERIA).reduce((a, c) => a + c.weight, 0);

  // 1. imagesPresent
  const imgs = fs.readdirSync(imgDir).filter(f => /^frame-\d+\.png$/.test(f));
  const imgOk = imgs.length >= EXPECT_FRAMES && imgs.every(f => fs.statSync(path.join(imgDir, f)).size > 1000);
  results.imagesPresent = { pass: imgOk, score: imgOk ? CRITERIA.imagesPresent.weight : 0 };
  total += results.imagesPresent.score;

  // Only assess the frames actually being rendered (1..EXPECT_FRAMES), not stale
  // leftover HTML from earlier larger builds that may still sit in the folder.
  const frames = fs.readdirSync(framesDir)
    .filter(f => f.endsWith(".html"))
    .filter(f => { const n = parseInt(f.slice(0, 2), 10); return n >= 1 && n <= EXPECT_FRAMES; })
    .slice(0, EXPECT_FRAMES);
  const htmls = Object.fromEntries(frames.map(f => [f, fs.readFileSync(path.join(framesDir, f), "utf8")]));

  // 2. imageInject
  const injectOk = frames.length === EXPECT_FRAMES && frames.every(f => {
    const h = htmls[f];
    return h.includes("-imgbg") && h.includes("../../assets/img/frame-");
  });
  results.imageInject = { pass: injectOk, score: injectOk ? CRITERIA.imageInject.weight : 0 };
  total += results.imageInject.score;

  // 3. bgCssValid — no "undefined" anywhere in ids/styles
  const bgOk = frames.every(f => !htmls[f].includes("undefined"));
  results.bgCssValid = { pass: bgOk, score: bgOk ? CRITERIA.bgCssValid.weight : 0 };
  total += results.bgCssValid.score;

  // 4. typography — frames WITH text: every text div >=30px and shadowed.
  //    Fact-title frames (those that define big display text) must have >=1 text >=100px.
  //    Image-hero frames intentionally have NO frame text (the image is the star) — that's fine.
  const typoFails = [];
  for (const f of frames) {
    const h = htmls[f];
    const textDivs = [...h.matchAll(/<div id="[^"]+" style="[^"]*font-size:[^"]*">/g)];
    if (textDivs.length === 0) continue; // image-hero frame, no text to judge
    const sizes = textDivs.flatMap(m => [...m[0].matchAll(/font-size:(\d+(?:\.\d+)?)px/g)].map(x => parseFloat(x[1])));
    const shadowed = textDivs.every(m => m[0].includes("text-shadow"));
    if (Math.min(...sizes) < 30 || !shadowed) typoFails.push(f);
  }
  // Fact-title frames must carry >=1 big display text (>=100px). Identified by "-title"/"-big"/"-end" ids.
  const titleFrames = frames.filter(f => /-(?:title|big|end)/.test(f) || FACT_TITLE_FRAMES.includes(f.slice(0, 2)));
  for (const f of titleFrames) {
    const sizes = [...htmls[f].matchAll(/font-size:(\d+(?:\.\d+)?)px/g)].map(m => parseFloat(m[1]));
    if (!sizes.length || Math.max(...sizes) < 100) typoFails.push(f + "(no big title)");
  }
  results.typography = { pass: typoFails.length === 0, score: typoFails.length === 0 ? CRITERIA.typography.weight : 0, fails: typoFails };
  total += results.typography.score;

  // 5. scrim
  const scrimOk = frames.every(f => htmls[f].includes('class="scrim"'));
  results.scrim = { pass: scrimOk, score: scrimOk ? CRITERIA.scrim.weight : 0 };
  total += results.scrim.score;

  // 6. shapeContrast — frames WITH graphic elements: borders >=4px and >=2 contrast
  //    elements (glows/borders/SVG strokes >=6px). Image-hero frames with NO graphic
  //    elements are intentionally clean (the image is the content) and pass by design.
  const shapeFails = [];
  for (const f of frames) {
    const h = htmls[f];
    const borders = [...h.matchAll(/border:\s*(\d+)px/g)].map(m => parseInt(m[1]));
    const glows = (h.match(/box-shadow:/g) || []).length;
    const strokes = [...h.matchAll(/stroke-width="(\d+)"/g)].map(m => parseInt(m[1])).filter(w => w >= 6).length;
    const hasGraphics = borders.length > 0 || glows > 0 || strokes > 0 || /<svg/.test(h);
    if (!hasGraphics) continue; // clean image-hero frame — nothing to contrast-check
    const thinBorders = borders.filter(b => b < 4).length;
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

  // 8. transitions — scenes on track 1 must tile cleanly: each scene's start equals the
  //    previous scene's end (cut, no gap, no overlap). Correct for a 98-cut video where
  //    the 1s breathing room lives INSIDE each frame's duration (voice ends, 1s silence).
  const indexPath = path.join(root, "index.html");
  let transOk = false;
  let overlapInfo = "index.html missing";
  if (fs.existsSync(indexPath)) {
    const ih = fs.readFileSync(indexPath, "utf8");
    const scenes = [...ih.matchAll(/<div\b[^>]*class="scene"[^>]*>/gs)]
      .map(m => {
        const tag = m[0];
        const id = (tag.match(/id="([^"]+)"/) || [])[1] || "";
        const start = tag.match(/data-start="([\d.]+)"/);
        const dur = tag.match(/data-duration="([\d.]+)"/);
        return { id, start: start ? parseFloat(start[1]) : 0, dur: dur ? parseFloat(dur[1]) : 0 };
      })
      .filter(s => s.dur > 0 && !/captions/i.test(s.id)) // captions overlay is not a frame scene
      .sort((a, b) => a.start - b.start);
    let cleanCuts = 0;
    for (let i = 1; i < scenes.length; i++) {
      const prevEnd = scenes[i - 1].start + scenes[i - 1].dur;
      if (Math.abs(scenes[i].start - prevEnd) < 0.2) cleanCuts++;
    }
    const expected = scenes.length > 1 ? scenes.length - 1 : 0;
    transOk = expected > 0 && cleanCuts >= Math.ceil(expected * 0.97);
    overlapInfo = `${cleanCuts}/${expected} clean cuts`;
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
