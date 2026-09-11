// db.cjs — schema + connection helper for the video project registry.
// Uses Node builtin node:sqlite (Node >= 22.5). No dependencies.
'use strict';
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, 'projects.sqlite');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS projects (
  slug            TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  path            TEXT NOT NULL,
  frames          INTEGER,
  style           TEXT,
  status          TEXT DEFAULT 'script-draft',  -- script-draft|tts|images|frames|assessment|render|done|paused
  script_version  TEXT,
  target_duration TEXT,                          -- e.g. "10m"
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS project_notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  project    TEXT NOT NULL REFERENCES projects(slug),
  note       TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS issues (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  symptom  TEXT NOT NULL,
  cause    TEXT NOT NULL,
  fix      TEXT NOT NULL,
  tags     TEXT,                                  -- comma-separated keywords
  source   TEXT,                                  -- project slug or 'general'
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS assets (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  project  TEXT NOT NULL REFERENCES projects(slug),
  kind     TEXT NOT NULL,                         -- image|audio|script|bgm|other
  path     TEXT NOT NULL,
  note     TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS renders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  project    TEXT NOT NULL REFERENCES projects(slug),
  output     TEXT NOT NULL,
  score      REAL,                                -- self-assessment 1-10
  notes      TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_notes_project  ON project_notes(project);
CREATE INDEX IF NOT EXISTS idx_issues_tags    ON issues(tags);
CREATE INDEX IF NOT EXISTS idx_assets_project ON assets(project);
CREATE INDEX IF NOT EXISTS idx_renders_project ON renders(project);
`;

function open() {
  const db = new DatabaseSync(DB_PATH);
  db.exec(SCHEMA);
  return db;
}

module.exports = { open, DB_PATH };
