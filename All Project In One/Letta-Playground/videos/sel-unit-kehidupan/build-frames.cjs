// build-frames.cjs — render compositions/frames/*.html from frame-defs.cjs
// v3: text-shadow by bg, scrim gradient overlay, bigger glows.
const fs = require("fs");
const path = require("path");
const defs = require("./frame-defs.cjs");
const DURS = require("./frame-durations.cjs");

const framesDir = path.join(__dirname, "compositions", "frames");
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

const INK = "#1A1A1A";

// Text shadow based on bg darkness.
function shadowFor(bg) {
  if (!bg) return "";
  const isDark = bg.includes("1A1A1A");
  if (isDark) {
    return "text-shadow:0 4px 22px rgba(0,0,0,0.75),0 0 48px rgba(0,0,0,0.45)";
  }
  return "text-shadow:0 0 18px rgba(245,240,232,0.85),0 0 36px rgba(245,240,232,0.65),0 2px 10px rgba(245,240,232,0.9)";
}

// Scrim gradient overlay — darkens top/bottom for text legibility over image.
function scrimHtml(bg) {
  const isDark = bg && bg.includes("1A1A1A");
  const grad = isDark
    ? "linear-gradient(180deg,rgba(26,26,26,0.85) 0%,rgba(26,26,26,0.15) 28%,rgba(26,26,26,0.15) 72%,rgba(26,26,26,0.85) 100%)"
    : "linear-gradient(180deg,rgba(245,240,232,0.8) 0%,rgba(245,240,232,0.05) 32%,rgba(245,240,232,0.05) 68%,rgba(245,240,232,0.8) 100%)";
  return `<div class="scrim" style="position:absolute;inset:0;background:${grad};pointer-events:none;"></div>`;
}

function svgWrap(d) {
  const parts = d.shapes.map(s => {
    const a = Object.entries(s.attrs || {}).map(([k, v]) => `${k}="${v}"`).join(" ");
    return `<${s.tag} ${a}/>`;
  }).join("");
  return `<svg id="${d.id}" class="svgel" viewBox="${d.viewBox}" style="position:absolute;left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;will-change:opacity,transform;opacity:0;">${parts}</svg>`;
}

function textDiv(d, bg) {
  const pos = d.pos || {};
  const shadow = d.noShadow ? "" : (d.shadow || shadowFor(bg));
  const style = [
    `position:absolute`,
    pos.left != null ? `left:${pos.left}px` : null,
    pos.top != null ? `top:${pos.top}px` : null,
    pos.width != null ? `width:${pos.width}px` : null,
    pos.right != null ? `right:${pos.right}px` : null,
    `text-align:${pos.align || "center"}`,
    // NB: no double quotes inside the style attribute — an inner quote would
    // terminate the attribute in the HTML parser and silently drop the rest
    // of the CSS (font-size, color, shadow...). Unquoted family names are valid CSS.
    `font-family:${d.font || "Bebas Neue"},sans-serif`,
    `font-weight:${d.weight || 400}`,
    `font-size:${d.size || 48}px`,
    `letter-spacing:${d.ls || 2}px`,
    `text-transform:${d.upper === false ? "none" : "uppercase"}`,
    `color:${d.color || "#1A1A1A"}`,
    `line-height:1.1`,
    `will-change:opacity,transform`,
    `opacity:0`,
    shadow,
  ].filter(Boolean).join(";");
  return `<div id="${d.id}" style="${style}">${d.text}</div>`;
}

function shapeDiv(d) {
  const st = [
    `position:absolute`,
    `left:${d.x}px`, `top:${d.y}px`, `width:${d.w}px`, `height:${d.h}px`,
    d.round ? `border-radius:50%` : null,
    d.bg ? `background:${d.bg}` : null,
    d.border ? `border:${d.border}` : null,
    d.glow ? `box-shadow:0 0 ${d.glow}px ${d.glowColor || "rgba(232,93,93,0.5)"}` : null,
    `will-change:opacity,transform`,
    `opacity:0`,
  ].filter(Boolean).join(";");
  return `<div id="${d.id}" style="${st}"></div>`;
}

function elHtml(el, bg) {
  if (el.kind === "text") return textDiv(el, bg);
  if (el.kind === "svg") return svgWrap(el);
  return shapeDiv(el);
}

function tlFor(d) {
  const lines = [];
  for (const op of d.tl) {
    const sel = `#${op.id}`;
    if (op.to) {
      const props = Object.entries(op.to).map(([k, v]) => typeof v === "string" ? `${k}:"${v}"` : `${k}:${v}`).join(", ");
      lines.push(`  tl.to("${sel}", { ${props} }, ${op.at});`);
    } else {
      const f = Object.entries(op.from).map(([k, v]) => typeof v === "string" ? `${k}:"${v}"` : `${k}:${v}`).join(", ");
      const t = Object.entries(op.to2).map(([k, v]) => typeof v === "string" ? `${k}:"${v}"` : `${k}:${v}`).join(", ");
      lines.push(`  tl.fromTo("${sel}", { ${f} }, { ${t} }, ${op.at});`);
    }
  }
  return lines.join("\n");
}

for (const d of defs) {
  const dur = DURS[d.num] || d.duration;
  const bgId = `f${d.num}-bg`;
  const sceneId = `f${d.num}-scene`;
  const scrim = scrimHtml(d.bg);
  const els = d.elements.map(el => elHtml(el, d.bg)).join("\n    ");
  const tl = tlFor(d);

  const html = `<template>
<style>
  @font-face { font-family: "Bebas Neue"; font-style: normal; font-weight: 400; src: url("https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2") format("woff2"); font-display: block; }
  @font-face { font-family: "Inter"; font-style: normal; font-weight: 400; src: url("https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2") format("woff2"); font-display: block; }
  @font-face { font-family: "Inter"; font-style: normal; font-weight: 700; src: url("https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2") format("woff2"); font-display: block; }

  #root { position: absolute; inset: 0; width: 1920px; height: 1080px; overflow: hidden; container-type: size; }
  .clip { position: absolute; inset: 0; }
  #${bgId} { z-index: 0; background: ${d.bg}; }
  #${sceneId} { z-index: 1; }
  .svgel { pointer-events: none; }
  .scrim { z-index: 0; }
</style>

<div id="root" data-composition-id="${d.compositionId}" data-width="1920" data-height="1080" data-duration="${dur}">
  <div id="${bgId}" class="clip" data-start="0" data-duration="${dur}" data-track-index="0"></div>
  <div id="${sceneId}" class="clip" data-start="0" data-duration="${dur}" data-track-index="1">
    ${scrim}
    ${els}
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>
<script>
(function () {
  window.__timelines = window.__timelines || {};
  var tl = gsap.timeline({ paused: true });
  var DURATION = ${dur};

${tl}

  tl.to({}, { duration: DURATION }, 0.000);
  window.__timelines["${d.compositionId}"] = tl;
})();
<\/script>
</template>
`;

  fs.writeFileSync(path.join(framesDir, d.file), html);
  console.log(`${d.file}  (${d.compositionId}, ${dur}s, ${d.elements.length} els)`);
}
console.log("Done building frames.");
