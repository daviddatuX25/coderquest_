# 🏗️ CoderQuest - Complete Project Structure

**Date:** November 30, 2025  
**Status:** Clean Architecture Foundation  
**Approach:** Simple, Modular, Scalable

---

## 📂 Folder Organization

```
coderquest_/
│
├── ARCHITECTURE/                    # This new folder - ALL ARCHITECTURE DOCS
│   ├── 01-FOUNDATION/              # Project setup & overview
│   ├── 02-PHASER-LAYER/            # Game engine architecture
│   ├── 03-REACT-LAYER/             # UI component architecture
│   ├── 04-EVENT-SYSTEM/            # Event flow documentation
│   ├── 05-DATABASE/                # Database schema & queries
│   └── 06-STYLING/                 # SCSS architecture
│
├── src/                             # REACT SOURCE CODE
│   ├── components/                  # React components (DONE)
│   │   ├── DialogBox.jsx           # NPC dialog
│   │   ├── QuestPopup.jsx          # Quest container
│   │   ├── Lesson.jsx              # Lesson display
│   │   ├── Quiz.jsx                # Quiz manager
│   │   ├── MultipleChoiceQuestion.jsx
│   │   ├── FillInBlanksQuestion.jsx
│   │   ├── QuizResults.jsx         # Results screen
│   │   └── README.md
│   │
│   ├── hooks/                       # React hooks (DONE)
│   │   └── useGameEvents.js        # Event system hook
│   │
│   ├── styles/                      # SCSS styles (DONE)
│   │   ├── index.scss
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _dialog-box.scss
│   │   ├── _quest-popup.scss
│   │   ├── _quiz.scss
│   │   ├── _multiple-choice.scss
│   │   ├── _fill-in-blanks.scss
│   │   └── _quiz-results.scss
│   │
│   ├── data/                        # Game data (TO DO)
│   │   ├── npcData.js              # NPC definitions
│   │   ├── mapData.js              # Map definitions
│   │   ├── questsData.js           # Quest definitions
│   │   └── lessonsData.js          # Lesson content
│   │
│   ├── gameEngine/                  # PHASER GAME (TO DO)
│   │   ├── GameScene.js            # Main game scene
│   │   ├── NPCSystem.js            # NPC behavior
│   │   ├── PlayerController.js     # Player movement
│   │   ├── MapManager.js           # Map loading & transitions
│   │   ├── CameraManager.js        # Camera logic
│   │   └── CollisionManager.js     # Collision detection
│   │
│   ├── services/                    # Business logic (TO DO)
│   │   ├── eventBus.js             # Central event emitter
│   │   ├── gameStateManager.js     # Global game state
│   │   └── apiService.js           # Backend API calls
│   │
│   ├── GameUI.jsx                   # Main UI coordinator (DONE)
│   ├── App.jsx                      # React app entry (TO DO)
│   └── index.jsx                    # React DOM render (TO DO)
│
├── public/                          # Static assets
│   ├── index.html                   # Main HTML
│   └── assets/                      # Already exists
│       ├── maps/
│       ├── characters/
│       └── sprites/
│
├── styles/                          # GLOBAL STYLES (DONE)
│   ├── main.scss
│   ├── main.css
│   └── ...
│
├── package.json                     # NPM dependencies (TO UPDATE)
├── README.md                        # Project overview (DONE)
└── .env.example                     # Environment template (TO DO)
```

---

## 🎯 What's Done vs What's TO DO

### ✅ COMPLETED

| Component | Status | Files |
|-----------|--------|-------|
| **React Components** | ✅ Done | 7 components in `src/components/` |
| **React Hooks** | ✅ Done | `useGameEvents.js` |
| **SCSS Styles** | ✅ Done | All style files in `src/styles/` |
| **Global Styles** | ✅ Done | `styles/` directory |
| **Architecture Docs** | ✅ Done | COMPLETE_SYSTEM_SUBMISSION.md |

### ❌ TO DO (Clean Architecture Start)

| Component | Priority | Complexity |
|-----------|----------|-----------|
| **Phaser Game Scene** | 🔴 HIGH | Medium |
| **NPC System** | 🔴 HIGH | Medium |
| **Player Controller** | 🔴 HIGH | Easy |
| **Map Manager** | 🟡 MEDIUM | Medium |
| **Event Bus Service** | 🔴 HIGH | Easy |
| **Game Data Files** | 🔴 HIGH | Easy |
| **API Service** | 🟡 MEDIUM | Medium |
| **Build Configuration** | 🔴 HIGH | Easy |

---

## 🔄 Development Workflow

### Phase 1: Foundation (You are here)
1. **Create architecture documentation** ← Currently doing
2. **Setup project configuration** (package.json, build tools)
3. **Setup development environment** (npm dev server)

### Phase 2: Core Game Engine
1. **Implement Phaser GameScene**
2. **Implement PlayerController**
3. **Implement NPCSystem**
4. **Connect to event bus**

### Phase 3: Gameplay Features
1. **Map Manager & transitions**
2. **Game state management**
3. **Quest/Lesson data loading**

### Phase 4: Integration
1. **Connect Phaser → React events**
2. **Test full modal flow**
3. **Backend API integration**

### Phase 5: Polish
1. **Animation & visual effects**
2. **Audio system**
3. **Performance optimization**

---

## 📋 Key Principles

### Simple & Modular
- Each file has ONE responsibility
- Clear separation of concerns
- No nested complexity

### Event-Driven
- Phaser emits events → React listens
- React emits events → Phaser listens
- Central event bus mediates all communication

### Data-Driven
- Game data separated from logic
- Easy to add new NPCs, quests, maps
- JSON/JavaScript objects for configuration

### Component-Based UI
- React components already built
- Just need to connect to game
- Styling already complete

---

## 🚀 Implementation Order (Recommended)

### Week 1: Foundation
```
Day 1: Setup configuration + build tools
Day 2-3: Implement core Phaser scene
Day 3-4: Implement player controller
Day 5: Connect to React event system
```

### Week 2: Game Features
```
Day 1-2: NPC system
Day 2-3: Map manager
Day 4: Quest/lesson data
Day 5: Full integration test
```

### Week 3: Polish
```
Day 1-2: Animations & effects
Day 3: Audio
Day 4-5: Testing & bugs
```

---

## 🎮 Technology Stack (Simple)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI components |
| **Game Engine** | Phaser 3 | 2D game rendering |
| **Styling** | SCSS | Component styles |
| **Build Tool** | Vite | Fast development |
| **Event System** | Custom EventEmitter | Phaser ↔ React communication |
| **State Management** | React Hooks | Local state |
| **HTTP Client** | Fetch API | Backend API calls |

---

## 📊 System Architecture (High-Level)

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    PHASER GAME ENGINE                       │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  GameScene                                            │  │  │
│  │  │  ├─ Player (Sprite + Physics)                        │  │  │
│  │  │  ├─ NPCs (Sprites + AI)                              │  │  │
│  │  │  ├─ Map (Tilemap)                                    │  │  │
│  │  │  └─ Input Handling (WASD, E key)                     │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                           ↓                                  │  │
│  │                    EVENT EMITTER                            │  │
│  │               (window.gameEvents)                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           ↕                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    REACT UI LAYER                           │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  GameUI (Parent)                                     │  │  │
│  │  │  ├─ DialogBox (NPC dialog)                           │  │  │
│  │  │  └─ QuestPopup                                       │  │  │
│  │  │     ├─ Lesson (lesson content)                       │  │  │
│  │  │     └─ Quiz (quiz manager)                           │  │  │
│  │  │        ├─ MultipleChoiceQuestion                     │  │  │
│  │  │        ├─ FillInBlanksQuestion                       │  │  │
│  │  │        └─ QuizResults                                │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    [BACKEND API]
                      (Future)
                    - User Auth
                    - Quiz Results
                    - Progress Tracking
```

---

## 🎯 Next Steps

1. **Read files in order:**
   - `02-PHASER-LAYER/` → Understand game engine architecture
   - `03-REACT-LAYER/` → Understand UI component flow
   - `04-EVENT-SYSTEM/` → Understand event communication
   - `05-DATABASE/` → Understand data schema
   - `06-STYLING/` → Understand style system

2. **Then proceed to:**
   - Update `package.json` with proper scripts
   - Setup Vite build configuration
   - Implement Phaser GameScene
   - Connect all layers

3. **Start development:**
   - `npm run dev` → Start development server
   - Open browser and see game + modals working together

---

## 📝 File Naming Convention

- **Components:** PascalCase (e.g., `DialogBox.jsx`)
- **Services:** camelCase (e.g., `gameStateManager.js`)
- **Data files:** camelCase (e.g., `npcData.js`)
- **Styles:** kebab-case with underscore (e.g., `_dialog-box.scss`)
- **Config:** UPPER_CASE (e.g., `CONFIG.js`)

---

## ✨ Key Features to Build

### Game Features
- ✅ Player movement (WASD / Arrow keys)
- ✅ NPC interaction (E key)
- ✅ Multiple maps/levels
- ✅ Camera following player
- ✅ Collision detection

### UI Features
- ✅ Dialog boxes (NPC conversations)
- ✅ Lesson display (theory content)
- ✅ Quiz system (2 question types)
- ✅ Results screen (score display)
- ✅ Responsive design

### Data Features
- ✅ NPC definitions (name, dialog, quests)
- ✅ Quest definitions (lesson + quiz)
- ✅ Map definitions (layout, NPCs, exits)
- ✅ Lesson content (text, code examples)

---

## 🔗 Related Files

- **Original Design:** `COMPLETE_SYSTEM_SUBMISSION.md`
- **Testing Guide:** `TEST_INTERFACE_GUIDE.md`
- **Setup Guide:** `QUICK_START.md`
- **Global Styles:** `styles/main.scss`
- **React Components:** `src/components/`

This architecture is your blueprint. Each section folder contains detailed implementation guides.

