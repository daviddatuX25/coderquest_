import db from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Player {
  static createPlayer(username) {
    return new Promise((resolve, reject) => {
      const playerId = uuidv4();
      const progressId = uuidv4();

      db.serialize(() => {
        db.run('INSERT INTO players (id, username) VALUES (?, ?)', 
          [playerId, username], 
          (err) => {
            if (err) reject(err);
          }
        );

        db.run(`INSERT INTO progress (id, player_id) VALUES (?, ?)`,
          [progressId, playerId],
          (err) => {
            if (err) reject(err);
          }
        );

        db.run(`INSERT INTO leaderboard (player_id, username) VALUES (?, ?)`,
          [playerId, username],
          (err) => {
            if (err) reject(err);
            else resolve({ playerId, username });
          }
        );
      });
    });
  }

  static getPlayer(playerId) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT p.*, pr.current_level, pr.experience, pr.completed_quests, 
               pr.completed_levels, pr.total_score, pr.play_time
        FROM players p
        LEFT JOIN progress pr ON p.id = pr.player_id
        WHERE p.id = ?
      `, [playerId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getPlayerByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT p.*, pr.current_level, pr.experience, pr.completed_quests, 
               pr.completed_levels, pr.total_score, pr.play_time
        FROM players p
        LEFT JOIN progress pr ON p.id = pr.player_id
        WHERE p.username = ?
      `, [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static updateProgress(playerId, progressData) {
    return new Promise((resolve, reject) => {
      const {
        current_level,
        experience,
        completed_quests,
        completed_levels,
        total_score,
        play_time
      } = progressData;

      db.run(`
        UPDATE progress 
        SET current_level = ?, 
            experience = ?, 
            completed_quests = ?, 
            completed_levels = ?, 
            total_score = ?,
            play_time = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE player_id = ?
      `, [
        current_level || 1,
        experience || 0,
        completed_quests ? JSON.stringify(completed_quests) : '[]',
        completed_levels ? JSON.stringify(completed_levels) : '[]',
        total_score || 0,
        play_time || 0,
        playerId
      ], function(err) {
        if (err) reject(err);
        else {
          // Update leaderboard
          db.run(`
            UPDATE leaderboard
            SET total_score = ?, current_level = ?, experience = ?, play_time = ?, updated_at = CURRENT_TIMESTAMP
            WHERE player_id = ?
          `, [total_score || 0, current_level || 1, experience || 0, play_time || 0, playerId], 
          (err) => {
            if (err) reject(err);
            else resolve({ success: true });
          });
        }
      });
    });
  }

  static getAllPlayers() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT p.*, pr.current_level, pr.experience, pr.completed_quests, 
               pr.completed_levels, pr.total_score, pr.play_time
        FROM players p
        LEFT JOIN progress pr ON p.id = pr.player_id
        ORDER BY pr.total_score DESC
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }
}
