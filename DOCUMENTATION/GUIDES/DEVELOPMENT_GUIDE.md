# 🚀 CoderQuest - Development Guide

**Your project is now set up with a clean, modern structure. Here's exactly what to do next.**

---

## 📁 Project Structure

```
src/
├── main.jsx                 ← Entry point (don't touch)
├── App.jsx                  ← Main app (orchestrates game + modals)
├── game/
│   ├── config/
│   │   └── GameConfig.js    ← Phaser settings
│   ├── scenes/
│   │   ├── BootScene.js     ← Asset loading
│   │   └── MainScene.js     ← Main game logic (EDIT THIS)
│   └── utils/
│       └── EventEmitter.js  ← Phaser ↔ React communication
├── components/              ← React components (already built!)
│   ├── DialogBox.jsx
│   ├── QuestPopup.jsx
│   ├── Quiz.jsx
│   ├── MultipleChoiceQuestion.jsx
│   └── ...
├── styles/
│   └── index.scss
└── data/
    └── sampleQuests.js
```

---

## 🎯 Getting Started (3 Steps)

### Step 1: Install Dependencies
```powershell
cd d:\Projects\coderquest_
npm install
```

### Step 2: Start Development Server
```powershell
npm run dev
```
This will:
- Start Vite dev server at `http://localhost:3000`
- Auto-reload when you save files
- Show any errors in the console

### Step 3: You're Ready to Develop! 🎉

---

## 🎮 Development Workflow

### What's Already Done
✅ React components (Dialog, Quest, Quiz, Results)  
✅ Event emitter (Phaser ↔ React communication)  
✅ Basic game structure  
✅ Input handling (WASD, E key)  

### What You Need to Build

#### Phase 1: Load Assets (BootScene.js)
1. Copy your tilemap files to `assets/maps/`
2. Copy your character sprites to `assets/characters/`
3. In **BootScene.js**, uncomment the preload() section and add:

```javascript
preload() {
  // Load tilemap
  this.load.tilemapTiledJSON('map1', 'assets/maps/map1_jungle.tmj')
  
  // Load tilesets
  this.load.image('jungle_tileset', 'assets/tilesets/jungle_tileset.png')
  
  // Load sprites
  this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 })
  this.load.image('npc1', 'assets/characters/npc1.png')
}
```

#### Phase 2: Create Game World (MainScene.js)
In **MainScene.js**, uncomment and implement:

```javascript
create() {
  // 1. Create tilemap and layers
  const map = this.make.tilemap({ key: 'map1' })
  const tileset = map.addTilesetImage('jungle_tileset', 'jungle_tileset')
  map.createLayer('Ground', tileset, 0, 0)
  
  // 2. Create player
  this.player = this.physics.add.sprite(100, 100, 'player')
  this.cameras.main.startFollow(this.player)
  
  // 3. Create NPCs
  this.createNPC('npc1', 200, 150, 'Mage', 'Welcome to the quest!')
}
```

#### Phase 3: Add NPC Interactions
When player presses **E** near an NPC:

```javascript
interactWithNPC() {
  const npc = this.getNearbyNPC(50) // Check within 50 pixels
  if (!npc) return
  
  gameEvents.emit('showDialog', {
    npcName: npc.getData('name'),
    dialogText: npc.getData('dialog'),
    questData: npc.getData('quest')
  })
}
```

This automatically triggers the React Dialog component!

#### Phase 4: Add Quiz/Lesson System
When NPC dialog has a quest button, emit:

```javascript
onQuestStart() {
  gameEvents.emit('showQuest', {
    id: 'quest_1',
    title: 'Lesson 1: Variables',
    content: 'Learn about variables...',
    questions: [...]
  })
}
```

---

## 🔄 Event Flow (Phaser → React)

```
User presses E near NPC
        ↓
MainScene.interactWithNPC()
        ↓
gameEvents.emit('showDialog', npcData)
        ↓
App.jsx listens and opens DialogBox component
        ↓
User clicks "Start Quest" button
        ↓
gameEvents.emit('showQuest', questData)
        ↓
App.jsx opens QuestPopup with Quiz
        ↓
User completes quiz
        ↓
gameEvents.emit('showResults', results)
        ↓
App.jsx shows QuizResults modal
```

---

## 📝 Important Files to Edit

| File | Purpose | Status |
|------|---------|--------|
| `src/game/scenes/BootScene.js` | Load assets | ⏳ TODO |
| `src/game/scenes/MainScene.js` | Game logic | ⏳ TODO |
| `src/data/sampleQuests.js` | Quest data | ⏳ TODO |
| `assets/maps/` | Tilemap files | Need to copy |
| `assets/characters/` | NPC sprites | Need to copy |

---

## 🧪 Testing During Development

### Test Dialog
```javascript
// In browser console:
window.gameEvents.emit('showDialog', {
  npcName: 'Test NPC',
  dialogText: 'This is a test dialog!'
})
```

### Test Quest/Quiz
```javascript
window.gameEvents.emit('showQuest', {
  title: 'Test Quest',
  questions: [...]
})
```

### Test Results
```javascript
window.gameEvents.emit('showResults', {
  score: 85,
  total: 100,
  message: 'Great job!'
})
```

---

## 🔗 Your Assets Are Here

Move these to the `assets/` folder:
- **Maps**: `d:\Projects\coderquest_\assets\` → Copy `map1_jungle.tmj`, `map2_town.tmj`, `map3_city.tmj`
- **NPCs**: `d:\Projects\coderquest_\assets\characters\` → Your NPC aseprite files
- **Tilesets**: Need to find/create PNG versions

---

## 📚 Reference

**React Components** (already built, ready to use):
- `DialogBox` - Shows NPC dialog with name/text
- `QuestPopup` - Container for lessons/quizzes
- `Lesson` - Displays lesson content
- `Quiz` - Quiz manager with progress
- `MultipleChoiceQuestion` - MC questions
- `FillInBlanksQuestion` - Fill-in-blank questions
- `QuizResults` - Shows score and feedback

**Event Emitter API**:
```javascript
// Emit an event from Phaser
gameEvents.emit('eventName', data)

// Listen from React
gameEvents.on('eventName', (data) => { })

// One-time listener
gameEvents.once('eventName', (data) => { })

// Unsubscribe
const unsubscribe = gameEvents.on('eventName', callback)
unsubscribe()
```

---

## ⚠️ Common Issues

**"npm run dev" doesn't work?**
- Make sure you ran `npm install` first
- Check Node.js is installed: `node -v`

**Game doesn't load?**
- Check browser console for errors (F12)
- Make sure assets are in correct paths
- Verify tilemap JSON files exist

**Modals not showing?**
- Check `gameEvents.emit()` is being called
- Verify event names match (case-sensitive!)
- Check browser console for errors

---

## 🎯 Next Steps

1. ✅ You've already run setup (you're reading this!)
2. ⏳ Run `npm install` and `npm run dev`
3. ⏳ Copy maps/tilesets to `assets/`
4. ⏳ Uncomment asset loading in BootScene
5. ⏳ Create game world in MainScene
6. ⏳ Add NPC interactions
7. ⏳ Connect to React modals via events

**Start with BootScene.js - that's your first real coding task!**

Good luck! 🚀
