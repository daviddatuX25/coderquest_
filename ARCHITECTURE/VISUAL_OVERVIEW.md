# 📊 ARCHITECTURE VISUAL OVERVIEW

**Purpose:** See the big picture in one document  
**Use this:** When you need visual clarity

---

## 🎮 Game Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER WINDOW                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────┐      ┌──────────────────┐   │
│  │    PHASER CANVAS     │      │   REACT OVERLAY  │   │
│  │ ┌────────────────┐   │      │ ┌──────────────┐ │   │
│  │ │                │   │      │ │  GameUI      │ │   │
│  │ │  Player       │   │      │ │ ┌──────────┐ │ │   │
│  │ │                │   │      │ │ │DialogBox │ │ │   │
│  │ │  [NPC]   [NPC]│   │      │ │ │QuestPop  │ │ │   │
│  │ │                │   │      │ │ │Lesson    │ │ │   │
│  │ │  MAP AREA      │   │      │ │ │Quiz      │ │ │   │
│  │ │                │   │      │ │ └──────────┘ │ │   │
│  │ │                │   │      │ └──────────────┘ │   │
│  │ └────────────────┘   │      └──────────────────┘   │
│  └──────────────────────┘                             │
│           ↑ ↓ ↑ ↓ ↑ ↓                                   │
│  ╔════════════════════════════════════════════════╗   │
│  ║     EVENT SYSTEM (window.gameEvents)           ║   │
│  ║     - player:moved                             ║   │
│  ║     - npc:interact                             ║   │
│  ║     - quest:start                              ║   │
│  ║     - dialog:show / dialog:hide                ║   │
│  ╚════════════════════════════════════════════════╝   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ Project Structure Tree

```
📁 coderquest_/
│
├── 📄 START_HERE.md ...................... Begin here
├── 📄 README.md .......................... Project docs
├── 📄 QUICK_START.md ..................... Quick setup
├── 📄 QUICK_REFERENCE.md ................. Code examples
│
├── 📁 ARCHITECTURE/ ...................... Documentation hub
│   ├── 📄 README.md ....................... Start
│   ├── 📄 NAVIGATION.md ................... Map of all docs
│   ├── 📄 QUICK_REFERENCE.md ............. Code snippets
│   │
│   ├── 📁 01-FOUNDATION/
│   │   └── 📄 PROJECT_STRUCTURE.md ....... Folder layout
│   │
│   ├── 📁 02-PHASER-LAYER/
│   │   └── 📄 PHASER_ARCHITECTURE.md ..... 6 game systems
│   │
│   ├── 📁 03-REACT-LAYER/
│   │   └── 📄 REACT_ARCHITECTURE.md ...... 8 UI components
│   │
│   ├── 📁 04-EVENT-SYSTEM/
│   │   └── 📄 EVENT_SYSTEM.md ............ Communication
│   │
│   ├── 📁 05-DATABASE/
│   │   └── 📄 DATABASE_ARCHITECTURE.md ... Schema
│   │
│   ├── 📁 06-STYLING/
│   │   └── 📄 STYLING_ARCHITECTURE.md .... Design system
│   │
│   └── 📁 WORKFLOW/ ....................... IMPLEMENTATION!
│       ├── 📄 README.md ................... 6 phases overview
│       ├── 📄 PHASE-MAP.md ............... Quick map
│       │
│       ├── 📁 PHASE-1-SETUP/
│       │   ├── 📄 README.md .............. Phase overview
│       │   ├── 📄 01-ENVIRONMENT-SETUP.md
│       │   ├── 📄 02-NPM-CONFIG.md
│       │   └── 📄 03-VERIFY-SETUP.md
│       │
│       ├── 📁 PHASE-2-CORE-ENGINE/
│       │   ├── 📄 README.md .............. Phase overview
│       │   ├── 📄 01-GAMESCENE-SETUP.md (★ START HERE FOR CODING)
│       │   ├── 📄 02-PLAYER-CONTROLLER.md
│       │   └── 📄 03-TEST-MOVEMENT.md
│       │
│       ├── 📁 PHASE-3-GAME-SYSTEMS/
│       │   ├── 📄 README.md .............. Phase overview
│       │   ├── 📄 01-NPC-SYSTEM.md
│       │   ├── 📄 02-MAP-MANAGER.md
│       │   ├── 📄 03-CAMERA-MANAGER.md
│       │   ├── 📄 04-COLLISION-MANAGER.md
│       │   └── 📄 05-TEST-SYSTEMS.md
│       │
│       ├── 📁 PHASE-4-DATA-FILES/
│       │   ├── 📄 README.md
│       │   ├── 📄 01-NPC-DATA.md
│       │   ├── 📄 02-MAP-DATA.md
│       │   ├── 📄 03-QUEST-DATA.md
│       │   └── 📄 04-LOAD-DATA.md
│       │
│       ├── 📁 PHASE-5-INTEGRATION/
│       │   ├── 📄 README.md
│       │   ├── 📄 01-APP-ENTRY.md
│       │   ├── 📄 02-EVENT-CONNECTION.md
│       │   └── 📄 03-FULL-FLOW-TEST.md
│       │
│       └── 📁 PHASE-6-TESTING/
│           ├── 📄 README.md
│           ├── 📄 01-MANUAL-TESTING.md
│           ├── 📄 02-BUG-FIXES.md
│           └── 📄 03-POLISH.md
│
├── 📁 src/ ............................ SOURCE CODE (you build this)
│   ├── 📁 gameEngine/
│   │   ├── GameScene.js ............... (Phase 2.1) ★
│   │   ├── PlayerController.js ........ (Phase 2.2) ★
│   │   ├── NPCSystem.js ............... (Phase 3.1)
│   │   ├── MapManager.js .............. (Phase 3.2)
│   │   ├── CameraManager.js ........... (Phase 3.3)
│   │   └── CollisionManager.js ........ (Phase 3.4)
│   │
│   ├── 📁 data/
│   │   ├── npcs.js .................... (Phase 4.1)
│   │   ├── maps.js .................... (Phase 4.2)
│   │   ├── quests.js .................. (Phase 4.3)
│   │   ├── lessons.js
│   │   └── DataLoader.js .............. (Phase 4.4)
│   │
│   ├── 📁 components/ ................. (READY - Phase 5)
│   │   ├── DialogBox.jsx
│   │   ├── QuestPopup.jsx
│   │   ├── Lesson.jsx
│   │   ├── Quiz.jsx
│   │   ├── MultipleChoiceQuestion.jsx
│   │   ├── FillInBlanksQuestion.jsx
│   │   └── QuizResults.jsx
│   │
│   ├── 📁 hooks/ ..................... (READY)
│   │   └── useGameEvents.js
│   │
│   ├── 📁 styles/ .................... (READY)
│   │   └── [all SCSS files]
│   │
│   ├── GameUI.jsx .................... (READY - event processor)
│   ├── App.jsx ....................... (Phase 2.1) ★
│   └── index.jsx ..................... (Phase 2.1) ★
│
├── 📁 assets/ ......................... Game assets
│   ├── Characters
│   ├── Maps (TMJ/TMX)
│   └── Sprites
│
├── 📄 package.json .................... Dependencies
├── 📄 vite.config.js .................. Build config
└── 📄 index.html ...................... HTML entry

★ = Must build (primary focus)
```

---

## 🔄 Workflow Phases Timeline

```
PHASE 1: SETUP (1-2 days)
┌─────────────────────────────────────────────────────────┐
│ ✅ Verify Node.js                                       │
│ ✅ Install dependencies                                 │
│ ✅ Setup npm scripts                                    │
│ ✅ Test dev server                                      │
└─────────────────────────────────────────────────────────┘
            ↓
PHASE 2: CORE ENGINE (2-3 days)
┌─────────────────────────────────────────────────────────┐
│ ✅ Create GameScene.js                                  │
│ ✅ Add player sprite and movement                       │
│ ✅ Setup camera following                               │
│ ✅ Connect React wrapper                                │
└─────────────────────────────────────────────────────────┘
            ↓
PHASE 3: GAME SYSTEMS (2-3 days)
┌─────────────────────────────────────────────────────────┐
│ ✅ Build NPCSystem                                      │
│ ✅ Build MapManager                                     │
│ ✅ Build CameraManager                                  │
│ ✅ Build CollisionManager                               │
└─────────────────────────────────────────────────────────┘
            ↓
PHASE 4: DATA FILES (1-2 days)
┌─────────────────────────────────────────────────────────┐
│ ✅ Create NPC data                                      │
│ ✅ Create map data                                      │
│ ✅ Create quest data                                    │
│ ✅ Build DataLoader                                     │
└─────────────────────────────────────────────────────────┘
            ↓
PHASE 5: INTEGRATION (1-2 days)
┌─────────────────────────────────────────────────────────┐
│ ✅ Connect Phaser ↔ React                              │
│ ✅ Test event system                                    │
│ ✅ Full game flow testing                               │
└─────────────────────────────────────────────────────────┘
            ↓
PHASE 6: TESTING & POLISH (3-5 days)
┌─────────────────────────────────────────────────────────┐
│ ✅ Manual testing                                       │
│ ✅ Bug fixes                                            │
│ ✅ Animations and audio                                 │
│ ✅ Performance optimization                             │
└─────────────────────────────────────────────────────────┘
            ↓
    🎉 GAME COMPLETE! 🎉
```

---

## 🎮 Game Systems Architecture

```
GAMESCENE (Main orchestrator)
├── PLAYER CONTROLLER
│   ├── Sprite rendering
│   ├── Movement logic
│   ├── Animation state
│   └── Input handling
│
├── NPC SYSTEM
│   ├── NPC spawning
│   ├── Proximity detection
│   ├── Interaction highlighting
│   └── Dialog triggering
│
├── MAP MANAGER
│   ├── Map loading
│   ├── Tile layer rendering
│   ├── Object spawning
│   └── Boundary management
│
├── CAMERA MANAGER
│   ├── Camera following
│   ├── Boundary constraints
│   ├── Smooth movement
│   └── Viewport management
│
└── COLLISION MANAGER
    ├── Physics setup
    ├── Collision groups
    ├── Event callbacks
    └── Interaction zones
```

---

## 📡 Event System Communication

```
PHASER GAME                      REACT UI
     ↓                                ↑
     └──────── Event Bus ─────────────┘
     
Events (one direction):
- player:moved → Update React UI
- npc:interact → Show dialog React component
- quest:start → Display lesson/quiz
- dialog:shown → Pause game
- dialog:hidden → Resume game

React Actions (other direction):
- Send quiz answer → Update game state
- Choose dialog option → Trigger quest
- Close dialog → Resume game
```

---

## 🗂️ File Dependencies

```
Entry Point
    ↓
index.html
    ↓
src/index.jsx
    ↓
src/App.jsx (React wrapper)
    ↓
    ├─→ src/GameUI.jsx (Event processor)
    │       └─→ src/components/* (Dialog, Quiz, etc)
    │
    └─→ Phaser Game Initialization
            ↓
        src/gameEngine/GameScene.js
            ├─→ PlayerController
            ├─→ NPCSystem
            ├─→ MapManager
            ├─→ CameraManager
            ├─→ CollisionManager
            └─→ Data (src/data/*)
```

---

## 🎯 Component Hierarchy

```
App.jsx (Root)
├── GameUI.jsx (Event listener)
│   ├── DialogBox.jsx
│   │   └── NPC dialog display
│   │
│   ├── QuestPopup.jsx
│   │   └── Quest container
│   │       ├── Lesson.jsx
│   │       │   └── Theory display
│   │       │
│   │       └── Quiz.jsx
│   │           ├── MultipleChoiceQuestion.jsx
│   │           ├── FillInBlanksQuestion.jsx
│   │           └── QuizResults.jsx
│   │
│   └── [Other UI components]
│
└── Phaser Game (Canvas)
```

---

## 📊 Data Flow

```
START GAME
    ↓
GameScene initializes
    ├─ Load map
    ├─ Spawn player
    ├─ Spawn NPCs
    └─ Setup input
    ↓
PLAYER MOVES
    ├─ Phaser emits: player:moved
    ├─ React listens and updates UI
    └─ GameUI shows player position
    ↓
PLAYER PRESSES 'E' NEAR NPC
    ├─ Collision detection triggers
    ├─ Phaser emits: npc:interact
    ├─ React listens: DialogBox appears
    ├─ User reads dialog
    ├─ User clicks 'Start Quest'
    └─ React emits: quest:start
    ↓
QUEST STARTS
    ├─ Phaser emits: game:paused
    ├─ QuestPopup shows Lesson/Quiz
    ├─ React processes answers
    ├─ React emits: quiz:complete
    ├─ Phaser listens: game:resumed
    ├─ DialogBox closes
    └─ Game continues
    ↓
GAME OVER
```

---

## 🎨 Styling Architecture

```
src/styles/ (Global)
├── _variables.scss
│   ├── Colors
│   ├── Fonts
│   ├── Spacing
│   └── Breakpoints
│
├── _mixins.scss
│   ├── Flexbox utilities
│   ├── Grid utilities
│   └── Media queries
│
├── index.scss (Main entry)
│
├── base/
│   └── _reset.scss (Normalize)
│
├── components/
│   ├── _dialog.scss
│   ├── _game-container.scss
│   ├── _header.scss
│   └── _ui.scss
│
└── layouts/
    └── _responsive.scss

src/components/*.jsx
└── Each component has matching _component.scss
```

---

## 🗄️ Database Schema (12 Tables)

```
USERS (Player profiles)
├── id, username, level, experience, gold

QUESTS (Quest definitions)
├── id, title, description, npc_id, reward

LESSONS (Educational content)
├── id, title, content, quest_id, order

QUESTIONS (Quiz questions)
├── id, type, question_text, correct_answer, lesson_id

ANSWERS (User quiz answers)
├── id, user_id, question_id, answer_text, is_correct

NPCS (Non-player characters)
├── id, name, dialog, location_x, location_y

MAPS (Game maps)
├── id, name, width, height, tileset

NPC_SPAWNS (Where NPCs spawn)
├── id, npc_id, map_id, x, y

And more...
```

---

## 📈 Development Timeline

```
Week 1:
  Mon-Tue: Phase 1 (Setup)
  Wed-Thu: Phase 2 (Core Engine)
  Fri:     Phase 2 (Complete) + Phase 3 start

Week 2:
  Mon-Tue: Phase 3 (Game Systems)
  Wed-Thu: Phase 4 (Data Files)
  Fri:     Phase 4 (Complete) + Phase 5 start

Week 3:
  Mon-Wed: Phase 5 (Integration)
  Thu-Fri: Phase 6 start (Testing)

Week 4:
  Full Week: Phase 6 (Testing & Polish)
  
Result: Complete playable game! 🎉
```

---

## ✅ Checklist: Are You Ready?

Before starting Phase 1:
- [ ] You have project folder
- [ ] You have package.json
- [ ] You have src/ folder
- [ ] Internet connection
- [ ] 2-4 GB free disk
- [ ] ~3-4 weeks of time

Before starting Phase 2:
- [ ] Phase 1 complete
- [ ] npm run dev works
- [ ] Browser opens
- [ ] No console errors

Before starting Phase 3:
- [ ] Phase 2 complete
- [ ] Player moves
- [ ] Camera follows
- [ ] No crashes

---

## 🔗 Quick Links

| What | Where |
|------|-------|
| Overview | `START_HERE.md` |
| Nav guide | `ARCHITECTURE/NAVIGATION.md` |
| Phase map | `ARCHITECTURE/WORKFLOW/PHASE-MAP.md` |
| Code snippets | `QUICK_REFERENCE.md` |
| Phase 1 | `ARCHITECTURE/WORKFLOW/PHASE-1-SETUP/README.md` |
| Phase 2 | `ARCHITECTURE/WORKFLOW/PHASE-2-CORE-ENGINE/README.md` |
| Phaser guide | `ARCHITECTURE/02-PHASER-LAYER/PHASER_ARCHITECTURE.md` |
| React guide | `ARCHITECTURE/03-REACT-LAYER/REACT_ARCHITECTURE.md` |
| Events guide | `ARCHITECTURE/04-EVENT-SYSTEM/EVENT_SYSTEM.md` |

---

## 🎬 Ready to Start?

**Step 1:** Read `START_HERE.md` (15 min)

**Step 2:** Go to `ARCHITECTURE/WORKFLOW/PHASE-1-SETUP/README.md`

**Step 3:** Follow the phase guides one by one

**Step 4:** Build the game!

---

**Let's build this game!** 🚀

