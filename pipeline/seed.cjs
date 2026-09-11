// seed.cjs — one-time seed of projects + troubleshooting issues. Safe to re-run (idempotent).
'use strict';
const { open } = require('./db.cjs');
const db = open();

const projects = [
  { slug: 'bintang-menjelaskan-bintang', title: 'Bintang Menjelaskan Bintang', path: 'D:\\General-Letta\\All Project In One\\Letta-Playground\\videos\\bintang-menjelaskan-bintang', frames: null, style: 'flat vector (v1)', status: 'done', script_version: 'final', target_duration: '1m45s' },
  { slug: 'sel-unit-kehidupan', title: 'Sel: Unit Kehidupan', path: 'D:\\General-Letta\\All Project In One\\Letta-Playground\\videos\\sel-unit-kehidupan', frames: 18, style: 'flat vector + AI images', status: 'done', script_version: 'final', target_duration: '4m' },
  { slug: 'kucing-fakta-unik', title: '11 Fakta Unik Kucing (feat. Catnip)', path: 'D:\\General-Letta\\All Project In One\\Letta-Playground\\videos\\kucing-fakta-unik', frames: 97, style: 'hand-drawn brush (regen pending — v2 chibi backed up)', status: 'images', script_version: 'v3 (awaiting user review)', target_duration: '10m' },
];

const issues = [
  ['generate-audio produces 0 wavs', 'SCRIPT.md lines do not match /^\\d+\\.\\s/', 'Reformat script or update parser regex', 'tts,script,parser', 'kucing-fakta-unik'],
  ['Wrong frame count processed', 'NUM_FRAMES hardcoded in scripts', 'Derive dynamically from script/storyboard', 'frames,script', 'kucing-fakta-unik'],
  ['Pacing too slow / dead gaps', '1s explicit gap + TTS trailing silence (0.1-0.86s)', 'Set explicit gap 0.4s (effective ~0.8-0.9s)', 'pacing,gap,storyboard', 'kucing-fakta-unik'],
  ['Captions fail: no usable words', 'captions.mjs parses STORYBOARD.md, not caption_groups.json', 'Check STORYBOARD frontmatter format 1920x1080 + ## Frame N + duration', 'captions,storyboard', 'kucing-fakta-unik'],
  ['Assembly fails: no mountable frames', 'STORYBOARD src: paths differ from actual frame filenames', 'Align src paths with real files', 'assembly,storyboard', 'kucing-fakta-unik'],
  ['Transitions score tanks (2 huge fake overlaps)', 'captions layer el-captions counted as a scene', 'Exclude by id; 0.2s gap tolerance', 'assessment,captions,transitions', 'kucing-fakta-unik'],
  ['Assessment fails on frames not in video', 'Stale HTML from larger/older build in compositions/frames/', 'Filter to 1..EXPECT_FRAMES or delete + rebuild fresh', 'assessment,frames,stale', 'kucing-fakta-unik'],
  ['Image generator demands login every run', 'Stock login.js saved storageState only once; browser auto-closed first', 'Fixed login.js saves state on every logged-in tick', 'mai,login,images', 'kucing-fakta-unik'],
  ['Image gen extremely slow / rate-limit burn', 'Subagent wrote per-image orchestrator (new browser per image)', 'run-image-batch.cjs once per batch; generate.js loops in ONE browser', 'mai,images,subagent,batch', 'kucing-fakta-unik'],
  ['Two image styles mixed in one video', 'Style switched mid-project, old frames kept', 'Full regeneration: back up, clear assets, swap anchor, regen ALL', 'images,style', 'kucing-fakta-unik'],
  ['Render OK but frames show flat color, no image', 'Frame CSS #undefined-bg (wrong field name in defs generator)', 'Use real field (d.num); verify with 1-frame draft render', 'frames,css,images', 'sel-unit-kehidupan'],
  ['<img> in HTML but never shows in video', 'Root-relative path 404s (frames are separate documents)', 'Use ../../assets/img/frame-NN.png', 'frames,images,paths', 'sel-unit-kehidupan'],
  ['Render dies mid-assembly', 'Start-Process inherits console; launcher timeout kills tree', 'WMI Win32_Process Create detached launch', 'render,windows,detach', 'sel-unit-kehidupan'],
  ['Text tiny / default 16px black in video', 'Double quotes inside inline style="..." truncated the attribute', 'Unquoted font families or move to <style> class', 'html,css,typography', 'sel-unit-kehidupan'],
  ['Horizontal seam at y=540', 'Low-memory stitched capture', 'Prevent: --workers 1, 30fps, pas-canvas. Fix: crop 1px + vstack', 'render,seam', 'bintang-menjelaskan-bintang'],
  ['No valid image captured on all images', 'headless: true', 'headless: false is required', 'mai,images,headless', 'bintang-menjelaskan-bintang'],
  ['JSON parse error after editing config', 'PowerShell Set-Content -Encoding UTF8 writes BOM', 'Use Node fs.writeFileSync (no BOM)', 'json,powershell,bom', 'bintang-menjelaskan-bintang'],
  ['Images come out 1024x1024', 'Generator ignores 16:9 in prompt', 'Crop center + upscale: crop=1024:576:0:224,scale=1920:1080', 'mai,images,crop', 'bintang-menjelaskan-bintang'],
  ['TTS mumbles reduplicated words', 'sonic-3.6 slurs hyphenated kata ulang', 'Write as two quoted words: "gara gara"', 'tts,kata-ulang,sonic', 'kucing-fakta-unik'],
  ['Voice drowned out after BGM mix', 'BGM too loud / no ducking', 'BGM 0.15-0.22 rel + sidechain ducking; voice untouched', 'bgm,mixing,audio', 'general'],
  ['Assessment transitions false-negative', 'Cut-based video scored against crossfade expectation', 'Expect cuts for sentence-by-sentence pacing', 'assessment,transitions', 'kucing-fakta-unik'],
  ['GitHub push >100MB times out', 'Connection cannot finish one huge POST', 'Push text first (orphan branch), then media in 8-15MB batches', 'git,github,push', 'general'],
];

for (const p of projects) {
  db.prepare(`INSERT INTO projects (slug,title,path,frames,style,status,script_version,target_duration)
              VALUES (?,?,?,?,?,?,?,?)
              ON CONFLICT(slug) DO UPDATE SET title=excluded.title, path=excluded.path, frames=excluded.frames,
                style=excluded.style, status=excluded.status, script_version=excluded.script_version,
                target_duration=excluded.target_duration, updated_at=datetime('now')`)
    .run(p.slug, p.title, p.path, p.frames, p.style, p.status, p.script_version, p.target_duration);
}

const count = db.prepare('SELECT COUNT(*) c FROM issues').get().c;
if (count === 0) {
  const ins = db.prepare('INSERT INTO issues (symptom,cause,fix,tags,source) VALUES (?,?,?,?,?)');
  for (const i of issues) ins.run(...i);
  console.log('Seeded ' + issues.length + ' issues');
} else {
  console.log('Issues already present (' + count + ') — skipped');
}

// Project notes for kucing (current state)
const notes = [
  ['kucing-fakta-unik', 'SCRIPT-v3.md (Lumensia techniques applied) awaiting user review before final render'],
  ['kucing-fakta-unik', 'assets/img EMPTY by design — awaiting regeneration in new hand-drawn brush style; v2 chibi + v1 images backed up in assets/img-v1-backup and backup-v1'],
  ['kucing-fakta-unik', 'Full render plan: node prepare-full-render.cjs -> 3 image batches (gen-config-batch1/2/3.json need re-prompts for new style) -> --assemble -> WMI-detached render'],
  ['kucing-fakta-unik', 'v2 segment 1 (frames 1-30) rendered + assessment 10/10 (160s)'],
];
const nc = db.prepare("SELECT COUNT(*) c FROM project_notes WHERE project='kucing-fakta-unik'").get().c;
if (nc === 0) {
  const ins = db.prepare('INSERT INTO project_notes (project, note) VALUES (?,?)');
  notes.forEach(n => ins.run(...n));
  console.log('Seeded ' + notes.length + ' notes');
} else console.log('Notes already present (' + nc + ') — skipped');

db.close();
console.log('Seed complete.');
