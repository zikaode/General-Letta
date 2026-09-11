// gen-caption-groups.cjs — phrase-level caption groups from audio_meta.json.
// Format matches faceless-explainer captions.mjs expectation:
//   { total_duration_s, width, height, groups: [{id, frame, start, end, text, words:[{id,text,start,end}]}] }
// 1.0s gap inserted BETWEEN frames (user request: breathing room per frame).
const fs = require("fs");
const path = require("path");

const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "audio_meta.json"), "utf8"));
const GAP = 0.4; // seconds between frames
const WORDS_PER_GROUP = 4;

const groups = [];
let offset = 0;
let gid = 0;
for (const v of meta.voices) {
  const ws = (v.words || []).map(w => ({
    text: w.text,
    start: +(offset + w.start).toFixed(3),
    end: +(offset + w.end).toFixed(3),
  }));
  for (let i = 0; i < ws.length; i += WORDS_PER_GROUP) {
    const chunk = ws.slice(i, i + WORDS_PER_GROUP);
    const words = chunk.map((w, k) => ({
      id: `caption-word-${gid}-${k}`,
      text: w.text,
      start: w.start,
      end: w.end,
    }));
    groups.push({
      id: `caption-group-${gid}`,
      frame: v.frame,
      start: words[0].start,
      end: words[words.length - 1].end,
      text: chunk.map(w => w.text).join(" ").trim(),
      words,
    });
    gid++;
  }
  offset += v.duration_s + GAP;
}

const out = {
  total_duration_s: +offset.toFixed(2),
  width: 1920,
  height: 1080,
  groups,
};
fs.writeFileSync(path.join(__dirname, "caption_groups.json"), JSON.stringify(out, null, 2));
console.log("caption_groups.json:", groups.length, "phrase groups over", out.total_duration_s, "s (" + (out.total_duration_s / 60).toFixed(2) + " min)");
