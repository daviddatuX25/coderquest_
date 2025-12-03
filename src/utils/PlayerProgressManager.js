/**
 * PlayerProgressManager
 * Handles syncing player progress with the backend API
 */

import { APIClient } from './APIClient';

export class PlayerProgressManager {
  constructor(playerId) {
    this.playerId = playerId;
    this.syncInterval = null;
    this.isDirty = false;
  }

  /**
   * Initialize player session
   */
  static async initializePlayer(username) {
    try {
      let player = await APIClient.getPlayerByUsername(username);
      if (!player) {
        player = await APIClient.createPlayer(username);
      }
      return player.id;
    } catch (error) {
      console.error('Failed to initialize player:', error);
      throw error;
    }
  }

  /**
   * Load player progress from server
   */
  async loadProgress() {
    try {
      const player = await APIClient.getPlayer(this.playerId);
      return {
        currentLevel: player.current_level,
        experience: player.experience,
        completedQuests: player.completed_quests,
        completedLevels: player.completed_levels,
        totalScore: player.total_score,
        playTime: player.play_time
      };
    } catch (error) {
      console.error('Failed to load progress:', error);
      throw error;
    }
  }

  /**
   * Save progress to server
   */
  async saveProgress(gameState) {
    try {
      const result = await APIClient.updateProgress(this.playerId, {
        current_level: gameState.currentLevel,
        experience: gameState.experience,
        completed_quests: gameState.completedQuests,
        completed_levels: gameState.completedLevels,
        total_score: gameState.totalScore,
        play_time: gameState.playTime
      });
      this.isDirty = false;
      return result;
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw error;
    }
  }

  /**
   * Mark state as dirty (needs saving)
   */
  markDirty() {
    this.isDirty = true;
  }

  /**
   * Start auto-sync (saves every 30 seconds if dirty)
   */
  startAutoSync(gameState, interval = 30000) {
    this.syncInterval = setInterval(() => {
      if (this.isDirty) {
        this.saveProgress(gameState).catch(console.error);
      }
    }, interval);
  }

  /**
   * Stop auto-sync
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Get leaderboard
   */
  static async getLeaderboard(limit = 10) {
    try {
      const result = await APIClient.getLeaderboard(limit, 0);
      return result.players;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get player rank
   */
  async getPlayerRank() {
    try {
      const result = await APIClient.getPlayerRank(this.playerId);
      return {
        rank: result.rank,
        totalPlayers: result.total_players
      };
    } catch (error) {
      console.error('Failed to fetch player rank:', error);
      throw error;
    }
  }

  /**
   * Get top players
   */
  static async getTopPlayers(count = 10) {
    try {
      const result = await APIClient.getTopPlayers(count);
      return result.players;
    } catch (error) {
      console.error('Failed to fetch top players:', error);
      throw error;
    }
  }
}
