// run-image-batch.cjs — SAFE single-session image generation for one batch.
// Replaces the subagent's gen-orchestrator.cjs (which wrongly relaunched the
// browser per image). This runs generate.js ONCE for the whole batch:
// one browser, one login context, all prompts in a single run folder.
//
// Usage: node run-image-batch.cjs <batchConfig.json> <frameOffset>
//   e.g. node run-image-batch.cjs gen-config-batch2.json 33
//
// It will:
//   1. copy the batch config over the generator's data/config.json
//   2. launch scripts/generate.js ONCE (injected into this same process via spawn)
//   3. on exit, process the newest run folder into assets/img/frame-NN.png (offset applied)
// Never call this in a loop per-image — it already loops internally over all prompts.
const fs = require("fs");
const path = require("path");
const { spawn, execFileSync } = require("child_process");

const GEN_DIR = "D:\\General-Letta\\.kilo\\agent\\playwright-image-generator";
const PROJ = __dirname;

const batchCfg = process.argv[2];
const offset = parseInt(process.argv[3] || "0", 10);
if (!batchCfg) { console.error("usage: node run-image-batch.cjs <batchConfig.json> <frameOffset>"); process.exit(1); }

const cfgAbs = path.resolve(PROJ, batchCfg);
if (!fs.existsSync(cfgAbs)) { console.error("config not found: " + cfgAbs); process.exit(1); }

// 1. Point the generator at this batch's config.
fs.copyFileSync(cfgAbs, path.join(GEN_DIR, "data", "config.json"));
const prompts = JSON.parse(fs.readFileSync(cfgAbs, "utf8")).prompts;
console.log(`Loaded ${prompts.length} prompts into generator config. Launching ONE browser session...`);

// 2. Snapshot existing run folders so we can find the NEW one afterwards.
const runsDir = path.join(GEN_DIR, "runs");
const before = new Set(fs.existsSync(runsDir) ? fs.readdirSync(runsDir) : []);

// 3. Run generate.js ONCE (single browser, loops all prompts internally).
const child = spawn(process.execPath, [path.join("scripts", "generate.js")], {
  cwd: GEN_DIR,
  stdio: "inherit",
});

child.on("exit", (code) => {
  console.log("generate.js exited with code " + code);
  // 4. Find the new run folder and process its PNGs with the frame offset.
  const after = fs.readdirSync(runsDir).filter(d => !before.has(d));
  if (!after.length) { console.error("No new run folder produced."); process.exit(1); }
  const runDir = path.join(runsDir, after.sort().pop());
  console.log("Processing run folder: " + runDir + " (offset " + offset + ")");
  try {
    execFileSync(process.execPath, [path.join(PROJ, "process-images.cjs"), runDir, String(offset)], { stdio: "inherit" });
    console.log("Batch complete. Images in assets/img.");
  } catch (e) {
    console.error("process-images failed: " + e.message);
    process.exit(1);
  }
});
