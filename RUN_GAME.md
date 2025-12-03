# 🎮 CoderQuest - Complete Game with Backend & Leaderboard

## ⚡ Quick Start (One Command!)

### Option 1: Windows Batch Script
```bash
start-game.bat
```

### Option 2: PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File start-game.ps1
```

### Option 3: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open: **http://localhost:5173**

---

## ✨ What's New

### Backend API (Express + SQLite)
- ✅ Player creation & authentication
- ✅ Progress persistence (levels, score, quests)
- ✅ Real-time leaderboard
- ✅ Auto-sync every 30 seconds
- ✅ RESTful endpoints for all player operations

### Frontend Integration
- ✅ Automatic player initialization
- ✅ Loads saved progress on game start
- ✅ Auto-sync progress during gameplay
- ✅ Leaderboard component (React)
- ✅ Progress display in UI

### Database
- SQLite (lightweight, file-based)
- Located: `server/coderquest.db`
- 3 tables: players, progress, leaderboard
- Auto-created on first run

---

## 🎯 Game Features

### Player Progress
- **Current Level**: Which level player is on
- **Experience**: Total XP earned
- **Total Score**: Points accumulated
- **Completed Levels**: Levels finished
- **Completed Quests**: Quests completed
- **Play Time**: Total time played

### Leaderboard
- Top 20 players by score
- Real-time rankings
- Player rank & position
- Level & play time stats

### Auto-Sync
- Saves progress every 30 seconds
- Immediate save on level complete
- Works even if backend temporarily unavailable
- No data loss between sessions

---

## 📊 API Endpoints

### Players
```
POST /api/players                      - Create new player
GET /api/players/:playerId              - Get player data
GET /api/players/username/:username     - Get by username
PUT /api/players/:playerId/progress     - Update progress
```

### Leaderboard
```
GET /api/leaderboard?limit=10&offset=0  - Get leaderboard
GET /api/leaderboard/top/10              - Get top N players
GET /api/leaderboard/rank/:playerId      - Get player rank
```

---

## 🛠️ File Structure

```
coderquest_/
├── server/                              # Backend API
│   ├── index.js                         # Express server
│   ├── db/
│   │   └── database.js                  # SQLite setup
│   ├── models/
│   │   └── Player.js                    # Player model
│   ├── routes/
│   │   ├── playerRoutes.js              # Player endpoints
│   │   └── leaderboardRoutes.js         # Leaderboard endpoints
│   ├── coderquest.db                    # SQLite database
│   └── package.json
│
├── src/
│   ├── utils/
│   │   ├── APIClient.js                 # Direct API calls
│   │   └── PlayerProgressManager.js     # High-level manager
│   ├── components/
│   │   └── Leaderboard.jsx              # Leaderboard UI
│   ├── game/scenes/
│   │   └── MainScene.js                 # Game logic (updated)
│   ├── styles/
│   │   └── leaderboard.scss             # Leaderboard styles
│   └── App.jsx                          # Main app (updated)
│
├── .env                                 # API configuration
├── .env.example                         # Example config
├── start-game.bat                       # Windows startup
├── start-game.ps1                       # PowerShell startup
└── package.json
```

---

## 🔧 Configuration

### Backend Port
Default: `3001`
Change in `server/index.js`:
```javascript
const PORT = process.env.PORT || 3001
```

### API URL (Frontend)
File: `.env`
```
VITE_API_URL=http://127.0.0.1:3001/api
```

### Auto-Sync Interval
Default: 30 seconds
Change in `MainScene.js`:
```javascript
manager.startAutoSync(gameState, 30000)  // 30000ms = 30 seconds
```

---

## 📚 Usage Examples

### In Game Code
```javascript
// Get progress manager from window
const manager = window.playerProgressManager;

// Mark progress as dirty (needs saving)
manager.markDirty();

// Save immediately
await manager.saveProgress({
  currentLevel: 2,
  totalScore: 5000,
  experience: 1500,
  completedLevels: ['level1'],
  completedQuests: ['quest1'],
  playTime: 3600
});

// Get player rank
const { rank, totalPlayers } = await manager.getPlayerRank();
console.log(`You are rank ${rank} of ${totalPlayers}`);
```

### In React Components
```jsx
import { PlayerProgressManager } from '@/utils/PlayerProgressManager';

// Get top players
const topPlayers = await PlayerProgressManager.getTopPlayers(10);

// Get leaderboard
const leaderboard = await PlayerProgressManager.getLeaderboard(10);
```

---

## 🧪 Testing

### Test Database (no network required)
```bash
cd server
node test-direct.js
```

### Check API Health
```bash
curl http://127.0.0.1:3001/health
```

### Create Test Player
```bash
curl -X POST http://127.0.0.1:3001/api/players \
  -H "Content-Type: application/json" \
  -d '{"username":"TestPlayer"}'
```

### Get Leaderboard
```bash
curl http://127.0.0.1:3001/api/leaderboard?limit=10
```

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find what's using port 3001
Get-NetTCPConnection -LocalPort 3001

# Kill the process
Stop-Process -Name node -Force
```

### Database Locked Error
- Close all game instances
- Wait 2-3 seconds
- Restart backend server

### API Connection Refused
- Verify backend is running: check terminal output
- Verify correct port (default: 3001)
- Check `.env` has correct `VITE_API_URL`

### Progress Not Saving
- Check browser console for errors (F12)
- Verify backend is responding: `curl http://127.0.0.1:3001/health`
- Check `playerProgressManager` is initialized: type in console `window.playerProgressManager`

### Leaderboard Empty
- Create at least 2 players and complete quests
- Progress must be saved for leaderboard to show
- Refresh leaderboard modal (close & reopen)

---

## 📈 Progress Flow

1. **Player Starts Game**
   - App initializes player from localStorage or creates new one
   - Backend loads saved progress
   - MainScene starts with loaded data

2. **During Gameplay**
   - Progress changes trigger `markDirty()`
   - Auto-sync saves every 30 seconds
   - Immediate save on important events

3. **Level Complete**
   - Level is marked as completed
   - Score is updated
   - Progress is saved immediately
   - Next level unlocks

4. **Leaderboard Update**
   - Progress save updates player ranking
   - Leaderboard refreshes automatically
   - Player sees updated rank

---

## 🚀 Production Deployment

### Backend
1. Deploy `server/` to your hosting (Heroku, AWS, etc.)
2. Update `PORT` environment variable
3. Use SQLite or migrate to PostgreSQL
4. Set `VITE_API_URL` to production URL

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` to static hosting
3. Update `.env` with production API URL

### Database
- Local: SQLite (included)
- Production: Migrate to PostgreSQL/MySQL

---

## ✅ Checklist

- [x] Backend API created
- [x] Database schema set up
- [x] Frontend integration complete
- [x] Progress manager implemented
- [x] Leaderboard component ready
- [x] Auto-sync working
- [x] Startup scripts ready
- [ ] Deploy to production
- [ ] Add more features (achievements, multiplayer, etc.)

---

## 📞 Support

**Issues?**
1. Check console errors (F12)
2. Verify backend is running
3. Check `.env` configuration
4. Review logs in terminal windows

**Debug Mode:**
```javascript
// In browser console
window.playerProgressManager      // See progress manager
window.gameScene                  // Access game scene
window.syncProgress(data)         // Manual save
```

---

## 🎉 Ready to Play!

```bash
# Run the game!
start-game.bat
# or
pwsh -ExecutionPolicy Bypass -File start-game.ps1
```

Enjoy your game! 🚀
