// generate-audio.cjs — Cartesia TTS per frame, reads lines from SCRIPT.md
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_car_ZHR264opQeHc8mA5jQoLtJ';

const scriptRaw = fs.readFileSync(path.join(__dirname, 'SCRIPT.md'), 'utf8');
const LINES = scriptRaw
  .split('\n')
  .map(l => l.trim())
  .filter(l => /^\d+\.\s/.test(l))
  .map(l => l.replace(/^\d+\.\s*/, ''));

console.log(`Found ${LINES.length} narration lines`);

const outDir = path.join(__dirname, 'assets', 'voice');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function generate(i) {
  if (i >= LINES.length) { console.log('Done.'); return; }
  const num = String(i + 1).padStart(2, '0');
  const outFile = path.join(outDir, `${num}.wav`);
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Skip ${num}.wav (exists)`);
    generate(i + 1);
    return;
  }
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
        fs.writeFileSync(outFile, Buffer.concat(chunks));
        console.log(`Generated ${num}.wav (${Math.round(Buffer.concat(chunks).length / 1024)} KB)`);
      } else {
        console.error(`Error ${res.statusCode} on ${num}: ${Buffer.concat(chunks).toString().slice(0, 200)}`);
      }
      setTimeout(() => generate(i + 1), 300);
    });
  });
  req.on('error', e => { console.error(e.message); setTimeout(() => generate(i + 1), 500); });
  req.write(body);
  req.end();
}

generate(0);
