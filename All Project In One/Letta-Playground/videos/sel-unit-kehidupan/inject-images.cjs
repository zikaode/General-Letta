// inject-images.cjs — place the generated image as the frame's BACKGROUND
// (v7 bintang pattern): dimmed fullscreen image at z-index 0, flat bg faded
// to 0.25, motion graphics kept alive on top.
const fs = require("fs");
const path = require("path");

const root = __dirname;
const framesDir = path.join(root, "compositions", "frames");

const NUM = 18;
const frames = [];
for (let i = 1; i <= NUM; i++) {
  const num = String(i).padStart(2, "0");
  const fileBase = fs.readdirSync(framesDir).find(f => f.startsWith(num + "-"));
  if (!fileBase) { console.error("missing frame " + num); process.exit(1); }
  frames.push({ file: fileBase, img: "frame-" + num + ".png", id: "f" + num });
}

for (const f of frames) {
  const fp = path.join(framesDir, f.file);
  let html = fs.readFileSync(fp, "utf8");

  if (html.includes(`${f.id}-imgbg`)) {
    console.log(`${f.file}: already injected, skipping`);
    continue;
  }

  const imgElId = `${f.id}-imgbg`;
  const rootTag = html.match(/<div id="root"[^>]*data-duration="([\d.]+)"/);
  const frameDur = rootTag ? rootTag[1] : "10";

  const usedTracks = [...html.matchAll(/data-track-index="(\d+)"/g)].map(m => parseInt(m[1]));
  const imgTrack = (usedTracks.length ? Math.max(...usedTracks) : -1) + 1;

  // The frame's own flat background element id.
  const bgId = `${f.id}-bg`;

  const css = `
  #${imgElId} {
    position: absolute; z-index: 0; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.5) saturate(1.05);
    will-change: opacity; opacity: 0; pointer-events: none;
  }
`;

  const imgHtml = `
  <img id="${imgElId}" class="clip" data-start="0" data-duration="${frameDur}" data-track-index="${imgTrack}" src="../../assets/img/${f.img}" alt="" />
`;

  html = html.replace("</style>", css + "</style>");
  html = html.replace(/(<div id="root"[^>]*>)/, "$1" + imgHtml);

  const imgJs = `
  var genBg = document.getElementById("${imgElId}");
  var flatBg = document.getElementById("${bgId}");
  if (genBg) {
    tl.fromTo(genBg, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: "power1.out" }, 0.0);
  }
  if (flatBg) {
    tl.to(flatBg, { opacity: 0.25, duration: 0.8, ease: "power1.out" }, 0.0);
  }
  tl.to({}, { duration: DURATION }`;

  html = html.replace("tl.to({}, { duration: DURATION }", imgJs);

  fs.writeFileSync(fp, html);
  console.log(`${f.file}: bg=${f.img} (motion graphics kept)`);
}

console.log("\nDone.");
