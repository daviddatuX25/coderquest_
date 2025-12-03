import express from 'express';
import { Player } from '../models/Player.js';

const router = express.Router();

// Create new player
router.post('/players', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const player = await Player.createPlayer(username);
    res.status(201).json(player);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get player by ID
router.get('/players/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = await Player.getPlayer(playerId);

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Parse JSON fields
    const playerData = {
      ...player,
      completed_quests: player.completed_quests ? JSON.parse(player.completed_quests) : [],
      completed_levels: player.completed_levels ? JSON.parse(player.completed_levels) : []
    };

    res.json(playerData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player by username
router.get('/players/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const player = await Player.getPlayerByUsername(username);

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const playerData = {
      ...player,
      completed_quests: player.completed_quests ? JSON.parse(player.completed_quests) : [],
      completed_levels: player.completed_levels ? JSON.parse(player.completed_levels) : []
    };

    res.json(playerData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update player progress
router.put('/players/:playerId/progress', async (req, res) => {
  try {
    const { playerId } = req.params;
    const progressData = req.body;

    // Verify player exists
    const player = await Player.getPlayer(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    await Player.updateProgress(playerId, progressData);
    const updated = await Player.getPlayer(playerId);

    res.json({
      success: true,
      data: {
        ...updated,
        completed_quests: updated.completed_quests ? JSON.parse(updated.completed_quests) : [],
        completed_levels: updated.completed_levels ? JSON.parse(updated.completed_levels) : []
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
