// inject-images.cjs — place the generated image as the frame's BACKGROUND
// (replacing the flat color wash), while keeping the frame's own motion
// graphics (diagrams, labels, shapes) fully visible and animated on top.
// The image is dimmed slightly so the motion graphics stay readable.
const fs = require("fs");
const path = require("path");

const root = __dirname;
const framesDir = path.join(root, "compositions", "frames");

const frames = [
  { file: "01-hook.html", img: "frame-01.png", id: "f01-hook" },
  { file: "02-konsep.html", img: "frame-02.png", id: "f02-konsep" },
  { file: "03-fusi.html", img: "frame-03.png", id: "f03-fusi" },
  { file: "04-kelahiran.html", img: "frame-04.png", id: "f04-kelahiran" },
  { file: "05-elemen.html", img: "frame-05.png", id: "f05-elemen" },
  { file: "06-supernova.html", img: "frame-06.png", id: "f06-supernova" },
  { file: "07-debu-bintang.html", img: "frame-07.png", id: "f07-debu" },
  { file: "08-matahari.html", img: "frame-08.png", id: "f08-matahari" },
  { file: "09-landasan.html", img: "frame-09.png", id: "f09-landasan" },
  { file: "10-penutup.html", img: "frame-10.png", id: "f10-penutup" },
];

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

  // Free track lane
  const usedTracks = [...html.matchAll(/data-track-index="(\d+)"/g)].map(m => parseInt(m[1]));
  const imgTrack = (usedTracks.length ? Math.max(...usedTracks) : -1) + 1;

  // The frame's own background element id (the flat color wash we soften).
  const bgId = `${f.id}-bg`;

  // CSS: fullscreen background image, dimmed so motion graphics stay readable.
  // z-index 0 (same as the old bg), everything else sits above it.
  const css = `
  #${imgElId} {
    position: absolute; z-index: 0; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.5) saturate(1.05);
    will-change: opacity; opacity: 0; pointer-events: none;
  }
`;

  // HTML: the background image element
  const imgHtml = `
  <img id="${imgElId}" class="clip" data-start="0" data-duration="${frameDur}" data-track-index="${imgTrack}" src="assets/img/${f.img}" alt="" />
`;

  html = html.replace("</style>", css + "</style>");
  html = html.replace(/(<div id="root"[^>]*>)/, "$1" + imgHtml);

  // JS: fade the background image in, and fade the flat color bg OUT so it
  // doesn't wash over the image. Keep every other element untouched (motion
  // graphics stay alive).
  const imgJs = `
  var genBg = document.getElementById("${imgElId}");
  var flatBg = document.getElementById("${bgId}");
  if (genBg) {
    tl.fromTo(genBg, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: "power1.out" }, 0.0);
  }
  if (flatBg) {
    // dim the flat wash so the illustration shows through but the brand tint stays
    tl.to(flatBg, { opacity: 0.25, duration: 0.8, ease: "power1.out" }, 0.0);
  }
  tl.to({}, { duration: DURATION }`;

  html = html.replace("tl.to({}, { duration: DURATION }", imgJs);

  fs.writeFileSync(fp, html);
  console.log(`${f.file}: bg=${f.img} (motion graphics kept)`);
}

console.log("\nDone.");
