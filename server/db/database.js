import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'coderquest.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Players table
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Player progress table
  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      current_level INTEGER DEFAULT 1,
      experience INTEGER DEFAULT 0,
      completed_quests TEXT DEFAULT '[]',
      completed_levels TEXT DEFAULT '[]',
      total_score INTEGER DEFAULT 0,
      play_time INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    )
  `);

  // Leaderboard view (for quick queries)
  db.run(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      player_id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      total_score INTEGER DEFAULT 0,
      current_level INTEGER DEFAULT 1,
      experience INTEGER DEFAULT 0,
      play_time INTEGER DEFAULT 0,
      rank INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables initialized');
}

export default db;
