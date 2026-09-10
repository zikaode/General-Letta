// generate-audio-v2.cjs — Cartesia TTS for the FIRST N frames of SCRIPT-v2.md
// (natural punctuation for better intonation). Usage: node generate-audio-v2.cjs [MAXF]
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_car_ZHR264opQeHc8mA5jQoLtJ';
const MAXF = parseInt(process.argv[2] || '30', 10);

const scriptRaw = fs.readFileSync(path.join(__dirname, 'SCRIPT-v2.md'), 'utf8');
const LINES = scriptRaw
  .split('\n')
  .map(l => l.trim())
  .filter(l => /^\d+\s*\|\s*/.test(l))
  .map(l => l.replace(/^\d+\s*\|\s*/, ''))
  .slice(0, MAXF);

console.log(`Generating TTS for ${LINES.length} frames (1..${MAXF}) from SCRIPT-v2.md`);

const outDir = path.join(__dirname, 'assets', 'voice');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function generate(i) {
  if (i >= LINES.length) { console.log('Done.'); return; }
  const num = String(i + 1).padStart(2, '0');
  const outFile = path.join(outDir, `${num}.wav`);
  // Always regenerate for v2 (overwrite old v1 audio) so timing matches new script.
  const body = JSON.stringify({
    model_id: 'sonic-3.6',
    transcript: LINES[i],
    language: 'id',
    voice: { mode: 'id', id: 'a053f6bc-7df4-40de-96d4-de026bc47ce8' },
    generation_config: { speed: 1.1 },
    output_format: { container: 'wav', encoding: 'pcm_s16le', sample_rate: 44100 }
  });
  const opts = {
    hostname: 'api.cartesia.ai', port: 443, path: '/tts/bytes', method: 'POST',
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
