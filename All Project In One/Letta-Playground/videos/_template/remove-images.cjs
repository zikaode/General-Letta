// remove-images.cjs — strip previously injected image CSS/HTML/JS from frames
const fs = require("fs");
const path = require("path");

const framesDir = path.join(__dirname, "compositions", "frames");

for (const file of fs.readdirSync(framesDir)) {
  if (!file.endsWith(".html")) continue;
  const fp = path.join(framesDir, file);
  let html = fs.readFileSync(fp, "utf8");
  const hadV2 = html.includes("-imgglow") || html.includes("-imgbg");
  if (!hadV2 && !html.includes("genBg") && !html.includes("genImg")) { console.log(file + ": clean"); continue; }

  // Remove injected CSS blocks
  html = html.replace(/\n\s*#f\d+-[a-z-]+-imgglow\s*\{[^}]*\}/g, "");
  html = html.replace(/\n\s*#f\d+-[a-z-]+-imgbg\s*\{[^}]*\}/g, "");
  html = html.replace(/\n\s*#f\d+-[a-z-]+-img\s*\{[^}]*\}/g, "");
  // Remove injected HTML elements
  html = html.replace(/\n\s*<div id="f\d+-[a-z-]+-imgglow"[^>]*><\/div>/g, "");
  html = html.replace(/\n\s*<img id="f\d+-[a-z-]+-imgbg"[^>]*\/>/g, "");
  html = html.replace(/\n\s*<img id="f\d+-[a-z-]+-img"[^>]*\/>/g, "");
  // Remove injected JS blocks
  html = html.replace(/\n\s*var genImg =[^]*?tl\.to\(\{\}, \{ duration: DURATION \}/, "\n  tl.to({}, { duration: DURATION }");
  html = html.replace(/\n\s*var genBg =[^]*?tl\.to\(\{\}, \{ duration: DURATION \}/, "\n  tl.to({}, { duration: DURATION }");

  fs.writeFileSync(fp, html);
  console.log(file + ": cleaned");
}
console.log("Done.");
