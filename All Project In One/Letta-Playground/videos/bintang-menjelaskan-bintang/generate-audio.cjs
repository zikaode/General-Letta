const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_car_ZHR264opQeHc8mA5jQoLtJ';
const LINES = [
  'Lihat ke langit malam. Setiap titik cahaya itu adalah bola api raksasa — jauh lebih besar dari yang bisa kamu bayangkan.',
  'Bintang adalah bola plasma raksasa. Di intinya, suhu mencapai jutaan derajat — cukup panas untuk mengubah hidrogen menjadi helium.',
  'Proses ini disebut fusi nuklir. Setiap detik, matahari mengubah 600 juta ton hidrogen menjadi helium — dan energi yang dilepaskan itulah yang kita lihat sebagai cahaya.',
  'Bintang lahir dari awan gas dan debu raksasa yang disebut nebula. Gravitasi menarik material ini bersama, memadat dan memanas — hingga fusi dimulai.',
  'Selama hidupnya, bintang memproduksi elemen-elemen berat: karbon, oksigen, nitrogen, besi. Semua elemen ini tidak ada sebelum bintang pertama kali menyala.',
  'Ketika bintang masif mati, ia meledak sebagai supernova. Semua elemen yang diproduksinya tersebar ke seluruh galaksi — menjadi bahan baku untuk bintang dan planet generasi berikutnya.',
  'Setiap atom dalam tubuhmu — kalsium di tulangmu, besi di darahmu — ditempa di dalam bintang yang sudah lama mati. Kita semua adalah debu bintang.',
  'Matahari kita sudah menyala 4,6 miliar tahun. Ia akan terus menyala sekitar 5 miliar tahun lagi — sebelum akhirnya mengembang dan menyusut menjadi katai putih.',
  'Jadi lain kali kamu melihat bintang — ingat: kamu sedang melihat pabrik elemen alam semesta. Dan setiap elemen di tubuhmu pernah menjadi bagian dari salah satunya.',
  'Kita adalah debu bintang.'
];

const outDir = path.join(__dirname, 'assets', 'voice');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function generate(i) {
  if (i >= LINES.length) { console.log('Done.'); return; }
  const num = String(i + 1).padStart(2, '0');
  const body = JSON.stringify({
    model_id: 'sonic-3.5',
    transcript: LINES[i],
    voice: { mode: 'id', id: 'a053f6bc-7df4-40de-96d4-de026bc47ce8' },
    output_format: { container: 'wav', encoding: 'pcm_s16le', sample_rate: 44100 }
  });
  const opts = {
    hostname: 'api.cartesia.ai',
    port: 443,
    path: '/tts/bytes',
    method: 'POST',
    headers: {
      'Cartesia-Version': '2026-03-01',
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };
  const req = https.request(opts, res => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      if (res.statusCode === 200) {
        fs.writeFileSync(path.join(outDir, `${num}.wav`), Buffer.concat(chunks));
        console.log(`Generated ${num}.wav`);
        generate(i + 1);
      } else {
        console.error(`Error ${res.statusCode}: ${Buffer.concat(chunks).toString()}`);
        generate(i + 1);
      }
    });
  });
  req.on('error', e => { console.error(e); generate(i + 1); });
  req.write(body);
  req.end();
}

generate(0);
