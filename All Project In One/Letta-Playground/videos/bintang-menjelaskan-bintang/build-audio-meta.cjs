// build-audio-meta.cjs — regenerate audio_meta.json from assets/voice/*.wav
// Durations via ffprobe; word timings: proportional to character length
// (replaced later by Cartesia aligned transcription if available).
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const lines = [
  "Lihat ke langit malam. Setiap titik cahaya itu adalah bola api raksasa — jauh lebih besar dari yang bisa kamu bayangkan.",
  "Bintang adalah bola plasma raksasa. Di intinya, suhu mencapai jutaan derajat — cukup panas untuk mengubah hidrogen menjadi helium.",
  "Proses ini disebut fusi nuklir. Setiap detik, matahari mengubah 600 juta ton hidrogen menjadi helium — dan energi yang dilepaskan itulah yang kita lihat sebagai cahaya.",
  "Bintang lahir dari awan gas dan debu raksasa yang disebut nebula. Gravitasi menarik material ini bersama, memadat dan memanas — hingga fusi dimulai.",
  "Selama hidupnya, bintang memproduksi elemen-elemen berat: karbon, oksigen, nitrogen, besi. Semua elemen ini tidak ada sebelum bintang pertama kali menyala.",
  "Ketika bintang masif mati, ia meledak sebagai supernova. Semua elemen yang diproduksinya tersebar ke seluruh galaksi — menjadi bahan baku untuk bintang dan planet generasi berikutnya.",
  "Setiap atom dalam tubuhmu — kalsium di tulangmu, besi di darahmu — ditempa di dalam bintang yang sudah lama mati. Kita semua adalah debu bintang.",
  "Matahari kita sudah menyala 4,6 miliar tahun. Ia akan terus menyala sekitar 5 miliar tahun lagi — sebelum akhirnya mengembang dan menyusut menjadi katai putih.",
  "Jadi lain kali kamu melihat bintang — ingat: kamu sedang melihat pabrik elemen alam semesta. Dan setiap elemen di tubuhmu pernah menjadi bagian dari salah satunya.",
  "Kita adalah debu bintang.",
];

function probe(file) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "--", file],
    { encoding: "utf8" },
  );
  return parseFloat(out.trim());
}

const voices = [];
for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, "0");
  const file = path.join(root, "assets", "voice", num + ".wav");
  const dur = probe(file);
  const text = lines[i - 1];
  const words = text.split(/\s+/).filter(Boolean);
  const totalChars = words.join("").length;
  let t = 0;
  const wlist = words.map((w, idx) => {
    const frac = w.length / totalChars;
    const d = dur * frac;
    const entry = { id: "w" + idx, text: w, start: +t.toFixed(3), end: +(t + d).toFixed(3) };
    t += d;
    return entry;
  });
  voices.push({ frame: i, path: "assets/voice/" + num + ".wav", duration_s: +dur.toFixed(3), words: wlist });
}

const meta = { bgm: null, bgm_pending: false, voices, sfx: [] };
fs.writeFileSync(path.join(root, "audio_meta.json"), JSON.stringify(meta, null, 2));
console.log("audio_meta.json written:", voices.map((v) => v.frame + ":" + v.duration_s + "s").join(" "));
