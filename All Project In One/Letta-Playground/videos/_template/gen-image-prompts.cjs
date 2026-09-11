// gen-image-prompts.cjs — 98 consistent image prompts -> playwright-image-generator configs.
// Consistency: identical "cinematic ... recurring orange tabby cat" anchor on EVERY prompt
// (same trick that made sel-unit-kehidupan's 18 images coherent). Split into 3 batch configs.
const fs = require("fs");
const path = require("path");

// Style anchor (2026-09-10, user-provided chibi reference): cute chibi/kawaii look.
// Identical on EVERY prompt so all images read as one consistent character + style.
const ANCHOR =
  "cute chibi kawaii 2D illustration, thick bold black outlines, big glossy expressive eyes, " +
  "soft pastel color palette with peach and cream tones, tiny blush marks on cheeks, soft warm lighting, " +
  "simple clean background, flat colors with minimal soft shading, wholesome charming mood, 16:9 widescreen, no text, " +
  "recurring character: an adorable chibi orange tabby cat with cream belly and inner ears, big round glossy dark-brown eyes, tiny pink nose, soft blush marks on cheeks, thick black outline, ";

const SCENES = require("./image-scenes.cjs");

const prompts = [];
for (let i = 1; i <= 97; i++) {
  const nn = String(i).padStart(2, "0");
  if (!SCENES[nn]) throw new Error("missing scene " + nn);
  prompts.push(ANCHOR + SCENES[nn]);
}

const genDir = "D:\\General-Letta\\.kilo\\agent\\playwright-image-generator";
const BATCHES = 3;
const per = Math.ceil(prompts.length / BATCHES);
for (let b = 0; b < BATCHES; b++) {
  const slice = prompts.slice(b * per, (b + 1) * per);
  const cfg = {
    newChatPerPrompt: false,
    prompts: slice,
    headless: false,
    referenceImage: null,
    imageModel: "MAI-Image-2.6",
  };
  fs.writeFileSync(path.join(__dirname, `gen-config-batch${b + 1}.json`), JSON.stringify(cfg, null, 2), "utf8");
  console.log(`gen-config-batch${b + 1}.json: ${slice.length} prompts`);
}
console.log("Total prompts: " + prompts.length);
