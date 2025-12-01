# 📚 Architecture Documentation Index

**CoderQuest - Complete Architecture Reference**  
**Date:** November 30, 2025  
**Status:** Clean foundation ready for development

---

## 🎯 Start Here

You have 6 architecture sections. Read them in this order:

### 1️⃣ **PROJECT STRUCTURE** (10 min read)
📄 `01-FOUNDATION/PROJECT_STRUCTURE.md`

**What you'll learn:**
- Overall folder organization
- What's done vs what's TO DO
- Development workflow phases
- Implementation order

**Key takeaway:** You have React components done, need to build Phaser game

---

### 2️⃣ **PHASER LAYER** (20 min read)
📄 `02-PHASER-LAYER/PHASER_ARCHITECTURE.md`

**What you'll learn:**
- 6 core systems (GameScene, Player, NPC, Map, Camera, Collision)
- How each system works
- Complete code templates
- Event flow with React

**Key takeaway:** Build these 6 files to create your game engine

---

### 3️⃣ **REACT LAYER** (15 min read)
📄 `03-REACT-LAYER/REACT_ARCHITECTURE.md`

**What you'll learn:**
- 8 React components (already built!)
- How each component works
- Component hierarchy
- Integration with Phaser

**Key takeaway:** Components exist, just need to connect to game

---

### 4️⃣ **EVENT SYSTEM** (15 min read)
📄 `04-EVENT-SYSTEM/EVENT_SYSTEM.md`

**What you'll learn:**
- How Phaser and React communicate
- Event bus implementation
- All available events
- How to emit/listen

**Key takeaway:** This is the bridge between game and UI

---

### 5️⃣ **DATABASE** (15 min read)
📄 `05-DATABASE/DATABASE_ARCHITECTURE.md`

**What you'll learn:**
- 12 table schema
- ER diagram
- Sample queries
- Future API endpoints

**Key takeaway:** Blueprint for storing game data

---

### 6️⃣ **STYLING** (10 min read)
📄 `06-STYLING/STYLING_ARCHITECTURE.md`

**What you'll learn:**
- SCSS organization
- Design tokens (colors, fonts, spacing)
- Reusable mixins
- Component styles

**Key takeaway:** All UI styles already designed and implemented

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  YOUR BROWSER                            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐        ┌──────────────────┐        │
│  │  PHASER GAME     │        │  REACT UI        │        │
│  │  (TO BUILD)      │        │  (DONE)          │        │
│  │                  │◄───────►│                  │        │
│  │ - GameScene      │  EVENT  │ - DialogBox      │        │
│  │ - Player         │  BUS    │ - QuestPopup     │        │
│  │ - NPCs           │         │ - Quiz           │        │
│  │ - Map Manager    │         │ - Results        │        │
│  │ - Collisions     │         │                  │        │
│  └──────────────────┘        └──────────────────┘        │
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │  SCSS STYLING (DONE)                             │    │
│  │  - Variables, Mixins, Components                 │    │
│  └──────────────────────────────────────────────────┘    │
│                                                           │
└─────────────────────────────────────────────────────────┘
                           ↓
                    [DATABASE - FUTURE]
                    (Not needed for local testing)
```

---

## 📋 Complete File Index

### Foundation
```
ARCHITECTURE/
├── 01-FOUNDATION/
│   └── PROJECT_STRUCTURE.md          ← Overview & workflow
│
├── 02-PHASER-LAYER/
│   └── PHASER_ARCHITECTURE.md         ← 6 systems to build
│
├── 03-REACT-LAYER/
│   └── REACT_ARCHITECTURE.md          ← 8 components (ready)
│
├── 04-EVENT-SYSTEM/
│   └── EVENT_SYSTEM.md                ← Communication system
│
├── 05-DATABASE/
│   └── DATABASE_ARCHITECTURE.md       ← 12 table schema
│
└── 06-STYLING/
    └── STYLING_ARCHITECTURE.md        ← Design tokens & styles
```

### Source Code Locations

**Already Built:**
```
src/
├── components/                      ✅ DONE
│   ├── DialogBox.jsx
│   ├── QuestPopup.jsx
│   ├── Lesson.jsx
│   ├── Quiz.jsx
│   ├── MultipleChoiceQuestion.jsx
│   ├── FillInBlanksQuestion.jsx
│   ├── QuizResults.jsx
│   └── README.md
├── hooks/
│   └── useGameEvents.js             ✅ DONE (Event bus)
├── styles/                          ✅ DONE (All styles)
└── GameUI.jsx                       ✅ DONE (Main processor)
```

**TO BUILD:**
```
src/
├── gameEngine/                      ❌ TO DO
│   ├── GameScene.js                 ← Main game
│   ├── PlayerController.js          ← Movement
│   ├── NPCSystem.js                 ← NPCs
│   ├── MapManager.js                ← Levels
│   ├── CameraManager.js             ← Camera
│   ├── CollisionManager.js          ← Physics
│   └── CONFIG.js                    ← Config
├── data/                            ❌ TO DO
│   ├── npcData.js                   ← NPC definitions
│   ├── mapData.js                   ← Map definitions
│   ├── questsData.js                ← Quest definitions
│   └── lessonsData.js               ← Lesson content
├── services/                        ❌ TO DO
│   ├── eventBus.js                  ← Central events
│   ├── gameStateManager.js          ← Global state
│   └── apiService.js                ← API calls
├── App.jsx                          ❌ TO DO
└── index.jsx                        ❌ TO DO
```

---

## 🚀 Quick Start (3 steps)

### Step 1: Read Architecture
1. Start with `PROJECT_STRUCTURE.md` (5 min)
2. Skim other docs to understand structure (15 min)

### Step 2: Setup Project
1. Update `package.json` with proper dependencies
2. Setup Vite config
3. Run `npm install && npm run dev`

### Step 3: Build Phaser Layer
1. Follow `PHASER_ARCHITECTURE.md`
2. Create 6 game engine files
3. Connect to event bus
4. Test game + modals together

---

## 💾 What You Have vs What You Build

### ✅ COMPLETED (Use As-Is)

| Component | Where | How to Use |
|-----------|-------|-----------|
| React Components | `src/components/` | Import in GameUI.jsx |
| Event Hooks | `src/hooks/useGameEvents.js` | Use in components |
| Styling | `src/styles/` | Already imported |
| GameUI Processor | `src/GameUI.jsx` | Main event hub |
| Test HTML | `CoderQuest/component-test.html` | Testing page |

### ❌ TO BUILD (Follow Templates)

| Component | Template | Purpose |
|-----------|----------|---------|
| GameScene.js | PHASER_ARCHITECTURE.md | Main game loop |
| PlayerController.js | PHASER_ARCHITECTURE.md | Player movement |
| NPCSystem.js | PHASER_ARCHITECTURE.md | NPC behavior |
| MapManager.js | PHASER_ARCHITECTURE.md | Level management |
| Data files | DATA FOLDER | Configuration |
| App.jsx | REACT_ARCHITECTURE.md | React root |
| index.jsx | REACT_ARCHITECTURE.md | Render entry |

---

## 📊 Development Timeline

### Week 1: Core Engine (40 hours)
- Day 1: Setup & configuration (2 hrs)
- Day 2-3: Phaser GameScene + Player (8 hrs)
- Day 4: NPC system (6 hrs)
- Day 5: Integration & testing (6 hrs)

### Week 2: Game Features (40 hours)
- Day 1-2: Map manager & transitions (6 hrs)
- Day 3: Quest/lesson data loading (4 hrs)
- Day 4-5: Full integration test (8 hrs)

### Week 3: Polish (20 hours)
- Day 1-2: Animations & effects (6 hrs)
- Day 3: Audio system (4 hrs)
- Day 4-5: Bug fixes & optimization (6 hrs)

---

## 🎯 Key Concepts (Quick Reference)

### Event System
- **Why:** Phaser and React are separate. Events let them talk.
- **How:** `emit('eventName', data)` sends, `on('eventName', callback)` receives
- **Where:** `window.gameEvents` (global event bus)

### Component Hierarchy
```
GameUI (Main processor)
├── DialogBox (NPC dialog)
└── QuestPopup (Quest container)
    ├── Lesson (Theory)
    └── Quiz (Assessment)
        ├── MultipleChoiceQuestion
        ├── FillInBlanksQuestion
        └── QuizResults
```

### Phaser Architecture
```
GameScene (Main container)
├── PlayerController (Movement)
├── NPCSystem (NPC behavior)
├── MapManager (Levels)
├── CameraManager (Camera)
└── CollisionManager (Physics)
```

### Data Flow
```
Player presses E
    ↓
GameScene checks NPC proximity
    ↓
GameScene emits 'showDialog'
    ↓
React GameUI listens & opens DialogBox
    ↓
User clicks "Continue"
    ↓
React emits 'dialogClosed'
    ↓
GameScene receives & shows quest
```

---

## 🔑 Important Files to Read First

1. **`PROJECT_STRUCTURE.md`** - Overview of everything
2. **`PHASER_ARCHITECTURE.md`** - What to build (code templates included)
3. **`EVENT_SYSTEM.md`** - How Phaser ↔ React communicate
4. **`REACT_ARCHITECTURE.md`** - UI components (already built)

Then read specific sections when building:
- Building NPC system? Read NPCSystem section
- Styling new component? Read STYLING_ARCHITECTURE.md
- Need database query? See DATABASE_ARCHITECTURE.md

---

## 🛠️ Tools & Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Game Engine | Phaser 3 | 2D game rendering |
| UI Framework | React 18 | Component UI |
| Build Tool | Vite | Dev server + bundling |
| Styling | SCSS | Modular styles |
| State | React Hooks | Local state management |
| Events | Custom EventEmitter | Phaser ↔ React |
| HTTP | Fetch API | Backend calls (future) |
| Database | MySQL/PostgreSQL | Persistence (future) |

---

## 📱 Supported Platforms

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ⚠️ Mobile (Responsive, but game is better on tablet+)

---

## 🎮 Game Features to Implement

### Core Loop
1. Player explores map (WASD/Arrows)
2. Player sees NPC
3. Player presses E to interact
4. NPC dialog appears (React modal)
5. Dialog closes, quest appears (React modal)
6. Player completes quiz
7. Game resumes

### Levels
- Jungle Temple (NPCs: Mage, Knight, Archer)
- Town Center (NPCs: Healer, Merchant, Scholar)
- City Skyline (NPCs: Engineer, Detective, Artist)

### NPC Interactions
- Each NPC has initial dialog
- Each NPC has 1-2 quests
- Each quest has lesson + quiz
- Quizzes have 2 question types

---

## ❓ FAQ

**Q: Do I need a backend to test locally?**  
A: No! The event system uses `window.gameEvents` which is in-browser. You can test the full game + UI flow without any backend.

**Q: Should I build database first?**  
A: No! Build the Phaser game first. Database comes later when you need to save progress.

**Q: Can I test React components without Phaser?**  
A: Yes! `CoderQuest/component-test.html` already exists for this.

**Q: How do I start the dev server?**  
A: `npm run dev` (after updating package.json and running npm install)

**Q: Where do I put NPC data?**  
A: In `src/data/npcData.js` (see DATA FOLDER section for template)

---

## 🔗 External References

- **Original Design:** `COMPLETE_SYSTEM_SUBMISSION.md` (in root)
- **Testing Guide:** `TEST_INTERFACE_GUIDE.md`
- **Quick Start:** `QUICK_START.md`
- **Setup Guide:** `SETUP_GUIDE.md`

---

## ✨ Next Action

1. Read `01-FOUNDATION/PROJECT_STRUCTURE.md` (takes 10 minutes)
2. Then read `02-PHASER-LAYER/PHASER_ARCHITECTURE.md`
3. Start building GameScene.js following the template
4. Come back to other docs as needed

**You're ready to start building! Pick up where the plan left off and follow the Phaser architecture guide. Good luck! 🚀**

