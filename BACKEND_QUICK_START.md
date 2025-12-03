# 🚀 CoderQuest Backend - Quick Setup

## Installation & Running

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Start the Backend Server
```bash
npm start        # Production mode
# OR
npm run dev      # Development mode with auto-reload
```

You should see:
```
🚀 CoderQuest API running on http://localhost:3001
```

### Step 3: Test the API
```bash
# From server directory
node test-api.js
```

This will run a full test suite creating players, updating progress, and checking leaderboard.

---

## Frontend Integration

### Option A: Using PlayerProgressManager (Recommended)

In your game scene (e.g., `MainScene.js`):

```javascript
import { PlayerProgressManager } from '@/utils/PlayerProgressManager';

class MainScene extends Phaser.Scene {
  async create() {
    // Initialize player on game start
    const playerId = await PlayerProgressManager.initializePlayer('PlayerName');
    this.playerId = playerId;

    // Load saved progress
    const progress = await new PlayerProgressManager(playerId).loadProgress();
    this.currentLevel = progress.currentLevel;
    this.totalScore = progress.totalScore;

    // Start auto-sync every 30 seconds
    this.progressManager = new PlayerProgressManager(playerId);
    this.progressManager.startAutoSync({
      currentLevel: this.currentLevel,
      experience: 0,
      completedQuests: [],
      completedLevels: [],
      totalScore: this.totalScore,
      playTime: 0
    });
  }

  update(time, delta) {
    // During gameplay, mark progress as dirty when it changes
    if (/* some progress change */) {
      this.progressManager.markDirty();
    }
  }

  shutdown() {
    // Stop syncing when leaving scene
    this.progressManager.stopAutoSync();
  }
}
```

### Option B: Direct API Calls

```javascript
import { APIClient } from '@/utils/APIClient';

// Create or get player
const player = await APIClient.createPlayer('username');

// Update progress
await APIClient.updateProgress(playerId, {
  current_level: 2,
  total_score: 5000,
  experience: 1500,
  completed_levels: ['level1'],
  completed_quests: ['quest1', 'quest2'],
  play_time: 3600
});

// Get leaderboard
const leaderboard = await APIClient.getLeaderboard(10, 0);

// Get top players
const topPlayers = await APIClient.getTopPlayers(10);

// Get player rank
const ranking = await APIClient.getPlayerRank(playerId);
```

---

## Creating a Leaderboard Component

```jsx
// Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { PlayerProgressManager } from '@/utils/PlayerProgressManager';

export function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const topPlayers = await PlayerProgressManager.getTopPlayers(10);
      setPlayers(topPlayers);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Level</th>
            <th>Play Time</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>#{player.rank}</td>
              <td>{player.username}</td>
              <td>{player.total_score}</td>
              <td>{player.current_level}</td>
              <td>{Math.floor(player.play_time / 60)}m</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Database

SQLite database file is created at: `server/coderquest.db`

It contains 3 tables:
- **players** - User accounts
- **progress** - Individual player progress data
- **leaderboard** - Cached leaderboard rankings

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/players` | Create new player |
| GET | `/api/players/:playerId` | Get player by ID |
| GET | `/api/players/username/:username` | Get player by username |
| PUT | `/api/players/:playerId/progress` | Update player progress |
| GET | `/api/leaderboard` | Get full leaderboard with pagination |
| GET | `/api/leaderboard/top/:count` | Get top N players |
| GET | `/api/leaderboard/rank/:playerId` | Get player's rank |

---

## Troubleshooting

**Q: API returns 404 errors**
- Make sure the server is running: `npm run dev` in the `server` directory
- Check that the API URL in your frontend matches the server port (default: 3001)

**Q: CORS errors**
- CORS is enabled by default for all origins
- If you get CORS errors, check that the frontend is making requests to the correct API URL

**Q: Database locked errors**
- This can happen if multiple processes are accessing the database
- Kill any existing server processes and restart

**Q: Players not being created**
- Check that username is unique (no duplicates allowed)
- Verify the request body includes the `username` field

---

## Next Steps

1. ✅ Backend server running
2. ✅ API endpoints created
3. 📝 Integrate into MainScene.js
4. 📝 Create Leaderboard UI component
5. 📝 Add progress saving on level complete
6. 📝 Deploy to production

Enjoy! 🎮
