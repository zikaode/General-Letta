// update-frames.cjs — update frame durations and scale GSAP timelines
const fs = require("fs");
const path = require("path");

const root = __dirname;
const framesDir = path.join(root, "compositions", "frames");

// New durations from audio (sync-durations output)
const newDurations = {
  1: 9.6,
  2: 10,
  3: 12.72,
  4: 11.44,
  5: 11.92,
  6: 12.56,
  7: 10.56,
  8: 12.64,
  9: 11.52,
  10: 2.48,
};

// Old durations (from original storyboard)
const oldDurations = {
  1: 5,
  2: 6,
  3: 7,
  4: 6,
  5: 6,
  6: 7,
  7: 7,
  8: 6,
  9: 6,
  10: 4,
};

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, "0");
  const file = path.join(framesDir, `${num}*.html`);
  const matches = fs.readdirSync(framesDir).filter(f => f.startsWith(num));
  if (matches.length === 0) continue;
  const frameFile = path.join(framesDir, matches[0]);
  
  const oldDur = oldDurations[i];
  const newDur = newDurations[i];
  const scale = newDur / oldDur;
  
  let html = fs.readFileSync(frameFile, "utf8");
  
  // Update data-duration attributes on all elements
  html = html.replace(/data-duration="[\d.]+"/g, (m) => {
    const match = m.match(/data-duration="([\d.]+)"/);
    if (!match) return m;
    const oldVal = parseFloat(match[1]);
    const newVal = oldVal * scale;
    return `data-duration="${newVal.toFixed(2)}"`;
  });
  
  // Update GSAP DURATION variable
  html = html.replace(/var DURATION = [\d.]+;/, `var DURATION = ${newDur.toFixed(2)};`);
  
  // Scale GSAP timeline time values (numbers after commas in tl calls)
  // This is tricky - we need to find time values in GSAP calls
  // Pattern: tl.to(..., {...}, TIME) or tl.fromTo(..., {...}, {...}, TIME)
  // Time values are typically the last parameter (after the last comma)
  // We'll use a more targeted approach: find numbers that look like time values
  
  // Scale numbers in GSAP calls that are likely time values (between 0 and oldDur)
  // This is a heuristic: numbers after '}, ' pattern
  html = html.replace(/},\s*([\d.]+)(\s*[,\)]|;)/g, (m, timeStr, suffix) => {
    const time = parseFloat(timeStr);
    if (isNaN(time) || time < 0 || time > oldDur + 1) return m;
    const newTime = time * scale;
    return `}, ${newTime.toFixed(3)}${suffix}`;
  });
  
  // Also scale duration values inside GSAP objects
  html = html.replace(/duration:\s*([\d.]+)/g, (m, durStr) => {
    const dur = parseFloat(durStr);
    if (isNaN(dur) || dur < 0 || dur > oldDur + 1) return m;
    const newDurVal = dur * scale;
    return `duration: ${newDurVal.toFixed(3)}`;
  });
  
  fs.writeFileSync(frameFile, html);
  console.log(`Frame ${i}: ${oldDur}s → ${newDur}s (scale ${scale.toFixed(2)}x)`);
}

console.log("\nAll frames updated with new durations and scaled timelines.");
