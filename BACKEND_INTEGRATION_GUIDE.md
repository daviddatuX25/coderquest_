# 🎮 CoderQuest Backend Integration Guide

## ✅ Backend Status: READY

The backend API is fully functional with SQLite database for persisting player progress and leaderboards.

### Tested Components:
- ✅ Player creation and retrieval
- ✅ Progress saving and updating
- ✅ Leaderboard ranking system
- ✅ Database persistence

---

## 🚀 Starting the Backend & Frontend

### Terminal 1: Backend Server
```bash
cd server
node index.js
# Or with auto-reload: npm run dev
```
Expected output:
```
🚀 CoderQuest API running on http://127.0.0.1:3001
📊 Leaderboard: GET http://127.0.0.1:3001/api/leaderboard
👤 Create Player: POST http://127.0.0.1:3001/api/players
Connected to SQLite database
Database tables initialized
```

### Terminal 2: Frontend Development
```bash
npm run dev
# Vite will start on http://localhost:5173
```

---

## 📦 Available Utilities

### 1. APIClient - Direct API Calls
Located: `src/utils/APIClient.js`

```javascript
import { APIClient } from '@/utils/APIClient';

// Create player
const player = await APIClient.createPlayer('username');

// Get player data
const player = await APIClient.getPlayer(playerId);

// Update progress
await APIClient.updateProgress(playerId, {
  current_level: 2,
  experience: 1500,
  completed_quests: ['quest1'],
  completed_levels: ['level1'],
  total_score: 5000,
  play_time: 3600
});

// Get leaderboard
const lb = await APIClient.getLeaderboard(10, 0);

// Get top N players
const top = await APIClient.getTopPlayers(10);

// Get player rank
const rank = await APIClient.getPlayerRank(playerId);
```

### 2. PlayerProgressManager - High-Level Progress Management
Located: `src/utils/PlayerProgressManager.js`

```javascript
import { PlayerProgressManager } from '@/utils/PlayerProgressManager';

// Initialize player session
const playerId = await PlayerProgressManager.initializePlayer('username');

// Create manager instance
const manager = new PlayerProgressManager(playerId);

// Load saved progress
const progress = await manager.loadProgress();
// Returns: { currentLevel, experience, completedQuests, completedLevels, totalScore, playTime }

// Save progress
await manager.saveProgress({
  currentLevel: 2,
  experience: 1500,
  completedQuests: ['quest1'],
  completedLevels: ['level1'],
  totalScore: 5000,
  playTime: 3600
});

// Auto-sync every 30 seconds
manager.startAutoSync(gameState, 30000);

// Stop auto-sync when needed
manager.stopAutoSync();

// Get leaderboard
const topPlayers = await PlayerProgressManager.getLeaderboard(10);

// Get top players
const top = await PlayerProgressManager.getTopPlayers(10);

// Get player's rank
const { rank, totalPlayers } = await manager.getPlayerRank();
```

---

## 🎯 Quick Integration Example

### In MainScene.js

```javascript
import { PlayerProgressManager } from '@/utils/PlayerProgressManager';

class MainScene extends Phaser.Scene {
  async create() {
    // Get or create player
    const playerId = localStorage.getItem('playerId');
    
    if (!playerId) {
      // New player
      const newPlayerId = await PlayerProgressManager.initializePlayer('Player_' + Date.now());
      localStorage.setItem('playerId', newPlayerId);
      this.playerId = newPlayerId;
    } else {
      this.playerId = playerId;
    }

    // Load saved progress
    this.progressManager = new PlayerProgressManager(this.playerId);
    const savedProgress = await this.progressManager.loadProgress();
    
    this.currentLevel = savedProgress.currentLevel;
    this.totalScore = savedProgress.totalScore;
    this.experience = savedProgress.experience;
    this.completedLevels = savedProgress.completedLevels;
    this.completedQuests = savedProgress.completedQuests;
    this.playTime = savedProgress.playTime;

    // Start auto-sync (saves every 30 seconds if progress changes)
    this.progressManager.startAutoSync({
      currentLevel: this.currentLevel,
      experience: this.experience,
      completedQuests: this.completedQuests,
      completedLevels: this.completedLevels,
      totalScore: this.totalScore,
      playTime: this.playTime
    });

    this.startTime = Date.now();
  }

  update(time, delta) {
    // Update play time
    this.playTime = Math.floor((Date.now() - this.startTime) / 1000);

    // Mark as dirty when progress changes
    if (/* player earned points */) {
      this.totalScore += points;
      this.progressManager.markDirty();
    }
  }

  async onLevelComplete(levelId) {
    // Update progress
    this.currentLevel++;
    this.completedLevels.push(levelId);
    this.progressManager.markDirty();

    // Immediate save on level complete
    await this.progressManager.saveProgress({
      currentLevel: this.currentLevel,
      experience: this.experience,
      completedQuests: this.completedQuests,
      completedLevels: this.completedLevels,
      totalScore: this.totalScore,
      playTime: this.playTime
    });

    console.log('✅ Level completed and saved!');
  }

  shutdown() {
    // Stop auto-sync and save final progress
    this.progressManager.stopAutoSync();
  }
}
```

---

## 💻 Creating a Leaderboard React Component

```jsx
// src/components/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { PlayerProgressManager } from '@/utils/PlayerProgressManager';

export function Leaderboard({ limit = 10 }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const topPlayers = await PlayerProgressManager.getTopPlayers(limit);
        setPlayers(topPlayers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [limit]);

  if (loading) return <div className="loading">Loading leaderboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="leaderboard">
      <h2>🏆 Top Players</h2>
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
              <td className="rank">#{player.rank}</td>
              <td className="username">{player.username}</td>
              <td className="score">{player.total_score.toLocaleString()}</td>
              <td className="level">{player.current_level}</td>
              <td className="playtime">
                {Math.floor(player.play_time / 3600)}h {Math.floor((player.play_time % 3600) / 60)}m
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🗄️ Database Schema Reference

### Players Table
```
id (UUID) - Primary key
username (TEXT, UNIQUE)
created_at (DATETIME)
updated_at (DATETIME)
```

### Progress Table
```
id (UUID) - Primary key
player_id (UUID) - Foreign key to players
current_level (INT, default: 1)
experience (INT, default: 0)
completed_quests (JSON array)
completed_levels (JSON array)
total_score (INT, default: 0)
play_time (INT in seconds, default: 0)
updated_at (DATETIME)
```

### Leaderboard Table (Cached)
```
player_id (UUID) - Primary key
username (TEXT)
total_score (INT)
current_level (INT)
experience (INT)
play_time (INT)
rank (INT, computed on query)
updated_at (DATETIME)
```

---

## 🔧 API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/players` | Create new player |
| GET | `/api/players/:playerId` | Get player data |
| GET | `/api/players/username/:username` | Get player by username |
| PUT | `/api/players/:playerId/progress` | Update player progress |
| GET | `/api/leaderboard?limit=10&offset=0` | Get leaderboard with pagination |
| GET | `/api/leaderboard/top/:count` | Get top N players |
| GET | `/api/leaderboard/rank/:playerId` | Get player's rank |

---

## 🧪 Testing

### Run database tests (no network required):
```bash
cd server
node test-direct.js
```

### Test with curl (if API running):
```bash
# Create player
curl -X POST http://127.0.0.1:3001/api/players \
  -H "Content-Type: application/json" \
  -d '{"username":"TestPlayer"}'

# Get leaderboard
curl http://127.0.0.1:3001/api/leaderboard?limit=10
```

---

## 📝 Important Notes

1. **API URL Configuration**
   - Frontend uses `VITE_API_URL` from `.env`
   - Default: `http://127.0.0.1:3001/api`
   - Update for production deployment

2. **Player IDs**
   - Stored in localStorage after first login
   - UUIDs for security and uniqueness
   - Persist across sessions

3. **Auto-Sync**
   - Saves progress every 30 seconds if dirty
   - Mark progress as dirty when values change
   - Manual save on important events (level complete)

4. **Leaderboard**
   - Sorted by total_score descending
   - Updated in real-time with each progress save
   - Rankings computed on-the-fly from progress data

5. **Error Handling**
   - All API methods include error handling
   - Check .catch() or try-catch for failures
   - Network failures don't break gameplay (offline-first approach)

---

## 🐛 Troubleshooting

**Q: API connection refused**
- Ensure backend is running: `node server/index.js`
- Check URL uses `127.0.0.1` not `localhost`
- Verify port 3001 is not in use

**Q: Username already exists error**
- Player usernames must be unique
- Use timestamp or UUID in username for testing

**Q: Progress not saving**
- Check browser console for errors
- Verify `VITE_API_URL` in `.env` is correct
- Ensure `progressManager.markDirty()` is called when data changes

**Q: Leaderboard not updating**
- Progress must be saved for leaderboard to update
- Check that `updateProgress` is being called
- Verify database file exists at `server/coderquest.db`

---

## ✨ Next Steps

1. ✅ Backend API ready
2. ✅ Database schema created
3. 📝 Integrate into MainScene.js
4. 📝 Create Leaderboard UI component
5. 📝 Add progress UI (level progress, score display)
6. 📝 Test with real gameplay
7. 📝 Deploy backend to production

Enjoy building! 🚀
