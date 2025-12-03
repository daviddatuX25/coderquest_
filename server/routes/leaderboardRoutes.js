import express from 'express';
import { Player } from '../models/Player.js';

const router = express.Router();

// Get leaderboard (top players)
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const offset = req.query.offset || 0;

    const players = await Player.getAllPlayers();

    // Add ranking
    const rankedPlayers = players.map((player, index) => ({
      ...player,
      rank: index + 1,
      completed_quests: player.completed_quests ? JSON.parse(player.completed_quests) : [],
      completed_levels: player.completed_levels ? JSON.parse(player.completed_levels) : []
    }));

    const paginated = rankedPlayers.slice(offset, offset + limit);

    res.json({
      total: rankedPlayers.length,
      limit,
      offset,
      players: paginated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top N players
router.get('/leaderboard/top/:count', async (req, res) => {
  try {
    const { count } = req.params;
    const limit = Math.min(parseInt(count) || 10, 100);

    const players = await Player.getAllPlayers();
    const top = players.slice(0, limit).map((player, index) => ({
      ...player,
      rank: index + 1,
      completed_quests: player.completed_quests ? JSON.parse(player.completed_quests) : [],
      completed_levels: player.completed_levels ? JSON.parse(player.completed_levels) : []
    }));

    res.json({ players: top });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player rank
router.get('/leaderboard/rank/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const players = await Player.getAllPlayers();

    const player = players.find(p => p.id === playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const rank = players.findIndex(p => p.id === playerId) + 1;

    res.json({
      rank,
      total_players: players.length,
      player: {
        ...player,
        rank,
        completed_quests: player.completed_quests ? JSON.parse(player.completed_quests) : [],
        completed_levels: player.completed_levels ? JSON.parse(player.completed_levels) : []
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
