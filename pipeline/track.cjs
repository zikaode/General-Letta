#!/usr/bin/env node
// track.cjs — CLI for the video project registry (SQLite).
// Usage: node pipeline/track.cjs <command> [args]
//   project list
//   project add <slug> --title T --path P [--frames N] [--style S] [--status S] [--script-version V] [--target-duration D]
//   project set <slug> [--status S] [--frames N] [--script-version V] [--style S]
//   project show <slug>
//   note add <slug> "<text>"
//   note list <slug>
//   issue add --symptom S --cause C --fix F [--tags T] [--source P]
//   issue search "<keyword>"
//   issue list
//   asset add <slug> --kind K --path P [--note N]
//   asset list <slug>
//   render log <slug> --output P [--score N] [--notes "..."]
//   render list <slug>
'use strict';
const { open } = require('./db.cjs');

const [,, cmd, sub, ...rest] = process.argv;

function die(msg) { console.error('ERROR: ' + msg); process.exit(1); }
function parseFlags(args) {
  const out = { _: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const val = (i + 1 < args.length && !args[i + 1].startsWith('--')) ? args[++i] : true;
      out[key] = val;
    } else out._.push(args[i]);
  }
  return out;
}
function row(r) { return r ? Object.fromEntries(Object.entries(r)) : null; }

try {
  const db = open();

  if (cmd === 'project') {
    if (sub === 'list') {
      const rows = db.prepare('SELECT slug, title, status, frames, script_version, path FROM projects ORDER BY slug').all();
      if (!rows.length) return console.log('(no projects)');
      console.table ? console.table(rows) : console.log(rows);
    } else if (sub === 'add') {
      const f = parseFlags(rest);
      const slug = f._[0]; if (!slug) die('project add <slug> required');
      db.prepare(`INSERT INTO projects (slug,title,path,frames,style,status,script_version,target_duration)
                  VALUES (?,?,?,?,?,?,?,?)
                  ON CONFLICT(slug) DO UPDATE SET title=excluded.title, path=excluded.path, updated_at=datetime('now')`)
        .run(slug, f.title || slug, f.path || '', f.frames ? Number(f.frames) : null, f.style || null,
             f.status || 'script-draft', f['script-version'] || null, f['target-duration'] || null);
      console.log('OK: project ' + slug + ' saved');
    } else if (sub === 'set') {
      const f = parseFlags(rest);
      const slug = f._[0]; if (!slug) die('project set <slug> required');
      const sets = [], vals = [];
      for (const k of ['status', 'style', 'script-version']) if (f[k] !== undefined) { sets.push(k + '=?'); vals.push(f[k]); }
      if (f.frames !== undefined) { sets.push('frames=?'); vals.push(Number(f.frames)); }
      if (!sets.length) die('nothing to set');
      vals.push(slug);
      db.prepare('UPDATE projects SET ' + sets.join(', ') + ', updated_at=datetime(\'now\') WHERE slug=?').run(...vals);
      console.log('OK: project ' + slug + ' updated');
    } else if (sub === 'show') {
      const p = row(db.prepare('SELECT * FROM projects WHERE slug=?').get(sub === 'show' ? rest[0] : rest[0]));
      if (!p) die('unknown project');
      console.log(p);
      const notes = db.prepare('SELECT created_at, note FROM project_notes WHERE project=? ORDER BY id DESC').all(p.slug);
      if (notes.length) { console.log('\nnotes:'); notes.forEach(n => console.log(`  [${n.created_at}] ${n.note}`)); }
    } else die('unknown project subcommand: ' + sub);
  }

  else if (cmd === 'note') {
    if (sub === 'add') {
      const f = parseFlags(rest);
      const slug = f._[0], text = f._.slice(1).join(' ');
      if (!slug || !text) die('note add <slug> "<text>"');
      db.prepare('INSERT INTO project_notes (project, note) VALUES (?,?)').run(slug, text);
      console.log('OK: note added to ' + slug);
    } else if (sub === 'list') {
      const rows = db.prepare('SELECT created_at, note FROM project_notes WHERE project=? ORDER BY id DESC').all(rest[0]);
      rows.forEach(n => console.log(`[${n.created_at}] ${n.note}`));
      if (!rows.length) console.log('(no notes)');
    } else die('unknown note subcommand');
  }

  else if (cmd === 'issue') {
    if (sub === 'add') {
      const f = parseFlags(rest);
      if (!f.symptom || !f.cause || !f.fix) die('issue add --symptom --cause --fix [--tags] [--source]');
      db.prepare('INSERT INTO issues (symptom,cause,fix,tags,source) VALUES (?,?,?,?,?)')
        .run(f.symptom, f.cause, f.fix, f.tags || null, f.source || 'general');
      console.log('OK: issue added');
    } else if (sub === 'search') {
      const q = '%' + (rest[0] || '') + '%';
      const rows = db.prepare(`SELECT id, symptom, cause, fix, tags FROM issues
        WHERE symptom LIKE ? OR cause LIKE ? OR fix LIKE ? OR tags LIKE ?`).all(q, q, q, q);
      if (!rows.length) return console.log('(no matching issues)');
      rows.forEach(r => console.log(`\n#${r.id} ${r.symptom}\n  cause: ${r.cause}\n  fix:   ${r.fix}\n  tags:  ${r.tags || ''}`));
    } else if (sub === 'list') {
      db.prepare('SELECT id, symptom FROM issues').all().forEach(r => console.log(`#${r.id} ${r.symptom}`));
    } else die('unknown issue subcommand');
  }

  else if (cmd === 'asset') {
    if (sub === 'add') {
      const f = parseFlags(rest);
      const slug = f._[0]; if (!slug || !f.kind || !f.path) die('asset add <slug> --kind K --path P [--note N]');
      db.prepare('INSERT INTO assets (project,kind,path,note) VALUES (?,?,?,?)').run(slug, f.kind, f.path, f.note || null);
      console.log('OK: asset added');
    } else if (sub === 'list') {
      db.prepare('SELECT kind, path, note FROM assets WHERE project=?').all(rest[0])
        .forEach(a => console.log(`[${a.kind}] ${a.path}${a.note ? ' — ' + a.note : ''}`));
    } else die('unknown asset subcommand');
  }

  else if (cmd === 'render') {
    if (sub === 'log') {
      const f = parseFlags(rest);
      const slug = f._[0]; if (!slug || !f.output) die('render log <slug> --output P [--score N] [--notes "..."]');
      db.prepare('INSERT INTO renders (project,output,score,notes) VALUES (?,?,?,?)')
        .run(slug, f.output, f.score ? Number(f.score) : null, f.notes || null);
      console.log('OK: render logged');
    } else if (sub === 'list') {
      db.prepare('SELECT created_at, output, score, notes FROM renders WHERE project=? ORDER BY id DESC').all(rest[0])
        .forEach(r => console.log(`[${r.created_at}] ${r.output} (score ${r.score ?? '-'})${r.notes ? ' — ' + r.notes : ''}`));
    } else die('unknown render subcommand');
  }

  else {
    console.log('Usage: node pipeline/track.cjs <project|note|issue|asset|render> ... (see header of this file)');
  }
  db.close();
} catch (e) {
  die(e.message);
}
