// gen-durations.cjs — frame-durations.cjs from audio_meta.json (+ optional pad)
const fs = require("fs");
const path = require("path");

const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "audio_meta.json"), "utf8"));
const PAD = 0.35; // small tail so frame doesn't cut the instant voice ends
const durs = {};
for (const v of meta.voices) {
  const nn = String(v.frame).padStart(2, "0");
  durs[nn] = +(v.duration_s + PAD).toFixed(2);
}
fs.writeFileSync(
  path.join(__dirname, "frame-durations.cjs"),
  "module.exports = " + JSON.stringify(durs, null, 2) + ";\n"
);
const total = Object.values(durs).reduce((a, b) => a + b, 0);
console.log("frame-durations.cjs written:", Object.keys(durs).length, "frames, voice total", total.toFixed(2) + "s");
