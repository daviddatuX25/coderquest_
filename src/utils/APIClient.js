/**
 * CoderQuest API Client
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class APIClient {
  static async createPlayer(username) {
    try {
      const response = await fetch(`${API_BASE_URL}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create player');
      }

      return await response.json();
    } catch (error) {
      console.error('Create player error:', error);
      throw error;
    }
  }

  static async getPlayer(playerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${playerId}`);

      if (!response.ok) {
        throw new Error('Player not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Get player error:', error);
      throw error;
    }
  }

  static async getPlayerByUsername(username) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/username/${username}`);

      if (!response.ok) {
        throw new Error('Player not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Get player by username error:', error);
      throw error;
    }
  }

  static async updateProgress(playerId, progressData) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${playerId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Update progress error:', error);
      throw error;
    }
  }

  static async getLeaderboard(limit = 100, offset = 0) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/leaderboard?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  static async getTopPlayers(count = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/top/${count}`);

      if (!response.ok) {
        throw new Error('Failed to fetch top players');
      }

      return await response.json();
    } catch (error) {
      console.error('Get top players error:', error);
      throw error;
    }
  }

  static async getPlayerRank(playerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/rank/${playerId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch player rank');
      }

      return await response.json();
    } catch (error) {
      console.error('Get player rank error:', error);
      throw error;
    }
  }
}
