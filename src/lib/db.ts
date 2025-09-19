import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export type VariantRow = {
  domain: string;
  reason: string;
  firstSeen: string;
  lastChecked: string | null;
  status: string; // registered/unknown
};

export type ReportRow = {
  id?: number;
  domain: string;
  timestamp: string;
  diffRatio: number;
  tagCos: number;
  classCos: number;
  hamming: number;
  reportPath: string;
};

export function openDb(dbPath: string) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS variants (
      domain TEXT PRIMARY KEY,
      reason TEXT NOT NULL,
      firstSeen TEXT NOT NULL,
      lastChecked TEXT,
      status TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      diffRatio REAL NOT NULL,
      tagCos REAL NOT NULL,
      classCos REAL NOT NULL,
      hamming INTEGER NOT NULL,
      reportPath TEXT NOT NULL
    );
  `);
  return db;
}

export function upsertVariant(db: Database.Database, row: VariantRow) {
  const stmt = db.prepare(`
    INSERT INTO variants(domain, reason, firstSeen, lastChecked, status)
    VALUES(@domain, @reason, @firstSeen, @lastChecked, @status)
    ON CONFLICT(domain) DO UPDATE SET
      reason=excluded.reason,
      lastChecked=excluded.lastChecked,
      status=excluded.status
  `);
  stmt.run(row);
}

export function insertReport(db: Database.Database, row: ReportRow) {
  const stmt = db.prepare(`
    INSERT INTO reports(domain, timestamp, diffRatio, tagCos, classCos, hamming, reportPath)
    VALUES(@domain, @timestamp, @diffRatio, @tagCos, @classCos, @hamming, @reportPath)
  `);
  stmt.run(row);
}

export function listVariants(db: Database.Database): VariantRow[] {
  return db.prepare(`SELECT * FROM variants ORDER BY domain`).all() as VariantRow[];
}

