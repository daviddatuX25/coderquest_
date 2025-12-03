# CoderQuest Backend API Setup

## Quick Start

### 1. Install Backend Dependencies
```bash
npm run server:install
```

### 2. Start the Backend Server
```bash
npm run server:dev
```

The API will be available at `http://localhost:3001/api`

---

## API Endpoints

### Players

#### Create Player
```
POST /api/players
Content-Type: application/json

{
  "username": "player_name"
}

Response: { playerId, username }
```

#### Get Player by ID
```
GET /api/players/:playerId

Response: Player object with progress data
```

#### Get Player by Username
```
GET /api/players/username/:username

Response: Player object with progress data
```

#### Update Player Progress
```
PUT /api/players/:playerId/progress
Content-Type: application/json

{
  "current_level": 2,
  "experience": 1500,
  "completed_quests": ["quest1", "quest2"],
  "completed_levels": ["level1"],
  "total_score": 5000,
  "play_time": 3600
}

Response: Updated player object with success flag
```

---

### Leaderboard

#### Get Full Leaderboard
```
GET /api/leaderboard?limit=100&offset=0

Response: {
  "total": number,
  "limit": number,
  "offset": number,
  "players": [ Player objects with rank ]
}
```

#### Get Top N Players
```
GET /api/leaderboard/top/10

Response: {
  "players": [ Top 10 Player objects with rank ]
}
```

#### Get Player Rank
```
GET /api/leaderboard/rank/:playerId

Response: {
  "rank": number,
  "total_players": number,
  "player": Player object with rank
}
```

---

## Frontend Integration

### Using the APIClient

```javascript
import { APIClient } from '@/utils/APIClient';

// Create a new player
const player = await APIClient.createPlayer('john_doe');
console.log(player.playerId);

// Get player data
const playerData = await APIClient.getPlayer(playerId);

// Update progress
await APIClient.updateProgress(playerId, {
  current_level: 2,
  total_score: 5000,
  completed_levels: ['level1'],
  play_time: 3600
});

// Get leaderboard
const leaderboard = await APIClient.getLeaderboard(10, 0);

// Get top players
const topPlayers = await APIClient.getTopPlayers(10);

// Get player's rank
const ranking = await APIClient.getPlayerRank(playerId);
```

---

## Database Schema

### players table
- `id` (TEXT, PRIMARY KEY) - UUID
- `username` (TEXT, UNIQUE) - Player username
- `created_at` (DATETIME) - Account creation timestamp
- `updated_at` (DATETIME) - Last update timestamp

### progress table
- `id` (TEXT, PRIMARY KEY) - UUID
- `player_id` (TEXT, FOREIGN KEY) - Reference to players.id
- `current_level` (INTEGER) - Current level (default: 1)
- `experience` (INTEGER) - Total experience (default: 0)
- `completed_quests` (TEXT) - JSON array of completed quest IDs
- `completed_levels` (TEXT) - JSON array of completed level IDs
- `total_score` (INTEGER) - Total score (default: 0)
- `play_time` (INTEGER) - Total play time in seconds (default: 0)
- `updated_at` (DATETIME) - Last update timestamp

### leaderboard table
- `player_id` (TEXT, PRIMARY KEY)
- `username` (TEXT)
- `total_score` (INTEGER)
- `current_level` (INTEGER)
- `experience` (INTEGER)
- `play_time` (INTEGER)
- `rank` (INTEGER) - Computed on query
- `updated_at` (DATETIME)

---

## Example: Saving Progress After Level Completion

```javascript
// In MainScene.js or wherever you handle level completion
import { APIClient } from '@/utils/APIClient';

async function onLevelComplete(levelId, playerData) {
  try {
    const playerId = localStorage.getItem('playerId');
    
    const result = await APIClient.updateProgress(playerId, {
      current_level: playerData.currentLevel,
      experience: playerData.experience,
      completed_levels: [...playerData.completedLevels, levelId],
      completed_quests: playerData.completedQuests,
      total_score: playerData.totalScore,
      play_time: playerData.playTime
    });

    console.log('Progress saved!', result);
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3001/api
```

For production, update to your backend URL:
```
VITE_API_URL=https://your-api-domain.com/api
```

---

## Notes

- All player progress is automatically saved to SQLite database
- Leaderboard is sorted by total_score in descending order
- Player IDs are UUIDs for security
- All timestamps are in DATETIME format (CURRENT_TIMESTAMP)
- CORS is enabled for frontend communication
