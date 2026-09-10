// transcribe-words.cjs — real word-level timestamps via Cartesia ink-whisper STT.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const KEY = "sk_car_ZHR264opQeHc8mA5jQoLtJ";
const root = __dirname;
const NUM_FRAMES = 18;

function probe(file) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "--", file],
    { encoding: "utf8" },
  );
  return parseFloat(out.trim());
}

async function transcribe(file) {
  const buf = fs.readFileSync(file);
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: "audio/wav" }), path.basename(file));
  fd.append("model", "ink-whisper");
  fd.append("language", "id");
  fd.append("timestamp_granularities[]", "word");
  const res = await fetch("https://api.cartesia.ai/stt", {
    method: "POST",
    headers: { Authorization: "Bearer " + KEY, "Cartesia-Version": "2026-03-01" },
    body: fd,
  });
  if (!res.ok) throw new Error("STT " + res.status + ": " + (await res.text()).slice(0, 300));
  return res.json();
}

(async () => {
  const voices = [];
  for (let i = 1; i <= NUM_FRAMES; i++) {
    const num = String(i).padStart(2, "0");
    const file = path.join(root, "assets", "voice", num + ".wav");
    const dur = probe(file);
    const r = await transcribe(file);
    const words = (r.words || []).map((w, idx) => ({
      id: "w" + idx,
      text: w.word,
      start: +Number(w.start).toFixed(3),
      end: +Number(w.end).toFixed(3),
    }));
    voices.push({ frame: i, path: "assets/voice/" + num + ".wav", duration_s: +dur.toFixed(3), words });
    console.log(num + ": " + words.length + " words, " + dur.toFixed(2) + "s — " + (r.text || "").slice(0, 50));
  }
  const meta = { bgm: null, bgm_pending: false, voices, sfx: [] };
  fs.writeFileSync(path.join(root, "audio_meta.json"), JSON.stringify(meta, null, 2));
  const total = voices.reduce((a, v) => a + v.duration_s, 0);
  console.log("audio_meta.json written. Total voice: " + total.toFixed(2) + "s");
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
