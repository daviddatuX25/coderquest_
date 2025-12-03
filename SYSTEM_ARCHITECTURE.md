# System Architecture - Level Completion & Mode Synchronization

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         React UI Layer                              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ MainMenu     │  │ GameUI       │  │ QuestLevelUI │             │
│  │              │  │              │  │              │             │
│  │ - Progress   │  │ - Routes UI  │  │ - Lessons    │             │
│  │ - Level Info │  │ - Dialogs    │  │ - Quizzes    │             │
│  │ - Mode Btn   │  │ - Quests     │  │ - Progress   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│         │                 │                    │                   │
│         └─────────────────┼────────────────────┘                   │
│                           │                                         │
│                    Emits/Listens Events                             │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ↓                   ↓                   ↓
┌────────────────┐ ┌─────────────────┐ ┌──────────────┐
│ Event System   │ │ MainScene       │ │ Phaser Game  │
│ (EventEmitter) │ │ (Game Mode)     │ │              │
│                │ │                 │ │ - Physics    │
│ - gameStarted  │ │ - Player        │ │ - Input      │
│ - levelComplet │ │ - NPCs          │ │ - Tilemap    │
│ - questComplet │ │ - Map           │ │ - Collision  │
│ - inputDisable │ │ - Camera        │ │              │
└────────────────┘ └─────────────────┘ └──────────────┘
        │                   │
        └───────────┬───────┘
                    │
                    ↓
        ┌───────────────────────┐
        │  Data Management      │
        │                       │
        │ ┌─────────────────┐   │
        │ │progressManager  │   │
        │ │ - completeQuest │   │
        │ │ - getProgress   │   │
        │ │ - isLevelComp   │   │
        │ │ - getCurrentLv  │   │
        │ │ - completeLevel │   │
        │ └─────────────────┘   │
        │                       │
        │ ┌─────────────────┐   │
        │ │modeSynchronizer │   │
        │ │ - syncOnEnter   │   │
        │ │ - getSyncMeta   │   │
        │ │ - getEdgeCases  │   │
        │ └─────────────────┘   │
        │                       │
        │ ┌─────────────────┐   │
        │ │questsByLevel    │   │
        │ │ - getAllQuests  │   │
        │ └─────────────────┘   │
        └───────────┬───────────┘
                    │
                    ↓
        ┌───────────────────────┐
        │  Browser Storage      │
        │                       │
        │ localStorage key:     │
        │ "coderquest_progress" │
        │                       │
        │ ┌─────────────────┐   │
        │ │currentLevel: 1  │   │
        │ │                 │   │
        │ │completedQuests  │   │
        │ │  {quest: data}  │   │
        │ │                 │   │
        │ │completedLevels  │   │
        │ │  {level1: true} │   │
        │ │                 │   │
        │ │lastMode: 'full' │   │
        │ └─────────────────┘   │
        └───────────────────────┘
```

---

## Data Flow Diagram - User Completes Level 1

```
START: User answers final quiz question
  │
  ├─ QuestLevelUI.nextQuestion() called
  │
  ├─ submitCurrent() saves answer
  │
  ├─ completeQuest(questId, score) called
  │
  ├─ progressManager saves to localStorage
  │
  ├─ Check: isLevelCompleted(segments)?
  │
  ├─ YES:
  │   ├─ completeLevel(1) called
  │   ├─ localStorage.completedLevels.level1 = true
  │   ├─ localStorage.currentLevel = 2 (prepared for Level 2)
  │   ├─ emit('levelCompleted', { levelId: 1 })
  │   └─ Show summary/celebration screen
  │
  └─ END: User sees "Level Complete!" message
```

---

## Data Flow Diagram - User Switches Modes

```
START: User clicks "Start Game"
  │
  ├─ MainMenu.handleStartGame() called
  │
  ├─ syncOnGameModeEnter() executed
  │   ├─ Call getCurrentLevel(getAllQuests())
  │   ├─ Call isLevelCompleted()
  │   ├─ Call recordModeStart('full')
  │   └─ Return { level: 1, levelCompleted: false, message: "..." }
  │
  ├─ emit('gameStarted', { mode: 'full', level: 1 })
  │
  ├─ GameUI receives event
  │   ├─ setGameMode('full')
  │   ├─ setCurrentLevel(1)
  │   └─ Renders MainScene
  │
  ├─ MainScene.create() called
  │   ├─ getCurrentLevel(getAllQuests()) called → returns 1
  │   ├─ this.currentLevel = 1
  │   ├─ createTilemap() with Level 1 map
  │   ├─ createPlayer()
  │   ├─ createSampleNPCs() with Level 1 NPCs
  │   └─ Game ready
  │
  └─ END: User sees game at correct level
```

---

## Event System Connections

```
React Components          Event Emitted           Phaser Listens
─────────────────        ──────────────           ──────────────

MainMenu                 'gameStarted'            MainScene/GameUI
handleStartGame()        { mode, level }          Updates UI

MainMenu                 'gameModeChanged'        GameUI
handleUIOnlyMode()       { mode, level }          Renders QuestLevelUI

QuestLevelUI             'questCompleted'         GameUI/progressManager
onQuizComplete()         { questId, score }       Updates localStorage

QuestLevelUI             'levelCompleted'         GameUI
onLevelComplete()        { levelId }              Shows celebration

QuestLevelUI             'inputDisabled'          MainScene
onMount()                { reason }               Disables WASD

QuestLevelUI             'inputEnabled'           MainScene
onUnmount()              { reason }               Enables WASD

GameUI                   'gamePaused'             MainScene
(from MainMenu)          {}                       Pauses physics

GameUI                   'gameResumed'            MainScene
(from MainMenu)          {}                       Resumes physics
```

---

## State Management Flow

### progressManager.js - Single Source of Truth

```javascript
// All progress managed here
const progress = {
  currentLevel: 1,              // Current level (1, 2, 3, ...)
  completedQuests: {            // All completed quizzes
    "vars-quiz": { score: 85, results: {...} },
    "functions-quiz": { score: 100, results: {...} },
    // ...
  },
  questScores: {                // Quick lookup for scores
    "vars-quiz": 85,
    "functions-quiz": 100,
    // ...
  },
  questResults: {               // Detailed quiz results
    "vars-quiz": { q1: true, q2: false, ... },
    // ...
  },
  completedLevels: {            // NEW: Track completed levels
    "level1": true,
    "level2": false,
  },
  lastMode: "ui-only"           // NEW: Track last mode used
}
```

### Component State Hierarchy

```
GameUI (Root State)
├─ gameMode: 'menu' | 'full' | 'ui-only'
├─ currentLevel: 1 (from progressManager)
├─ dialogOpen: boolean
├─ questOpen: boolean
│
├─ MainMenu
│   ├─ currentLevel: 1 (synced from progressManager)
│   ├─ levelProgress: 42
│   ├─ gameMode: 'full' | 'ui-only'
│   └─ isPaused: boolean
│
├─ MainScene (Phaser)
│   ├─ currentLevel: 1 (from progressManager)
│   ├─ mapManager: MapManager
│   ├─ npcSystem: NPCSystem
│   └─ inputHandler: InputHandler
│
└─ QuestLevelUI
    ├─ segments: array (from getAllQuests())
    ├─ currentIndex: number
    ├─ userAnswers: object
    ├─ submitted: object
    ├─ correctMap: object
    └─ unlocked: array
```

---

## Level Detection Algorithm

```javascript
// Input: Array of all quests for a level
// Output: Current level number and completion status

function getCurrentLevel(levelQuests) {
  const progress = getProgress();
  
  // Get only quiz-type segments from the level
  const quizzes = levelQuests.filter(q => 
    q.type.includes('quiz-')
  );
  
  // Check: Are all quizzes completed?
  const allQuizzesCompleted = quizzes.every(quiz =>
    progress.completedQuests[quiz.seg_name]
  );
  
  // If Level 1 complete, return 2 (prepared for Level 2)
  if (allQuizzesCompleted) {
    return 2;  // Will return 1 if Level 2 doesn't exist
  }
  
  // Otherwise, still on Level 1
  return 1;
}

function isLevelCompleted(levelQuests) {
  const progress = getProgress();
  const quizzes = levelQuests.filter(q => 
    q.type.includes('quiz-')
  );
  
  return quizzes.every(quiz =>
    progress.completedQuests[quiz.seg_name]
  );
}

function getLevelCompletionPercentage(levelQuests) {
  const progress = getProgress();
  const quizzes = levelQuests.filter(q => 
    q.type.includes('quiz-')
  );
  
  const completedCount = quizzes.filter(quiz =>
    progress.completedQuests[quiz.seg_name]
  ).length;
  
  return Math.round((completedCount / quizzes.length) * 100);
}
```

---

## Mode Synchronization Algorithm

```javascript
// When user clicks "Start Game"
function syncOnGameModeEnter() {
  const quests = getAllQuests();
  const level = getCurrentLevel(quests);
  const levelCompleted = isLevelCompleted(quests);
  
  // Record that user is starting in game mode
  recordModeStart('full');
  
  return {
    level,
    levelCompleted,
    message: levelCompleted 
      ? `Level ${level} is complete! Starting Level ${level + 1}...`
      : `Resuming Level ${level}...`
  };
}

// When user clicks "Lessons & Quizzes Only"
function syncOnUIOnlyModeEnter() {
  const quests = getAllQuests();
  const level = getCurrentLevel(quests);
  
  recordModeStart('ui-only');
  
  return {
    level,
    message: `Continuing Level ${level} lessons...`
  };
}
```

---

## localStorage Persistence Strategy

```
Session 1 (User playing game):
  ├─ Completes 2 quests
  └─ localStorage.coderquest_progress = {
       currentLevel: 1,
       completedQuests: { quest1: {...}, quest2: {...} },
       lastMode: 'full'
     }

Session 2 (Browser closed and reopened):
  ├─ App loads
  ├─ progressManager reads localStorage
  ├─ MainMenu shows 28% (2/7) progress
  ├─ User clicks "Start Game"
  ├─ MainScene checks level → loads Level 1
  └─ Game continues from same point

Session 3 (User switches to lesson mode):
  ├─ User clicks "Lessons & Quizzes Only"
  ├─ QuestLevelUI loads
  ├─ Shows 2 quests as completed (from localStorage)
  ├─ User completes 2 more quests
  ├─ localStorage updated with 4 total
  └─ Progress bar shows 57% (4/7)

Session 4 (User switches back to game):
  ├─ User clicks "Start Game"
  ├─ Game still shows 57% complete (4/7)
  ├─ User completes 1 quest in game
  ├─ localStorage updated to 5 total
  └─ localStorage shows 71% (5/7)

Session 5 (User completes final quizzes):
  ├─ User switches to lessons
  ├─ Completes final 2 quizzes
  ├─ System detects: all 7 quizzes done
  ├─ completeLevel(1) called
  ├─ localStorage.completedLevels.level1 = true
  ├─ Next time game starts
  ├─ getCurrentLevel() returns 2
  └─ Game ready for Level 2
```

---

## File Relationship Diagram

```
src/
├─ data/
│  ├─ progressManager.js ─────────┐
│  │                               │ (reads/writes)
│  ├─ modeSynchronizer.js ────────┤ (imports & uses)
│  │                               │
│  ├─ questsByLevel.js ─────────┐ │
│  │  (getAllQuests)             │ │
│  └─────────────────────────────┼─┼────────────┐
│                                 │ │            │
├─ components/                    │ │            │
│  ├─ MainMenu.jsx ──────────────┤ │ (imports)  │
│  │                              │ │            │
│  ├─ GameUI.jsx ────────────────┤ │ (imports)  │
│  │                              │ │            │
│  ├─ QuestLevelUI.jsx ──────────┤ │ (imports)  │
│  │                              │ │            │
│  └─ DialogBox.jsx              │ │            │
│                                 │ │            │
├─ game/                          │ │            │
│  └─ scenes/                     │ │            │
│     └─ MainScene.js ───────────┼─┘ (imports)  │
│                                 │              │
└─ styles/                        │              │
   ├─ _main-menu.scss            └──────────────┘
   │  (styles for level display)
   └─ _variables.scss
      (color/size constants)
```

---

## Error Handling Strategy

```
Try-Catch Locations:

1. getProgress()
   ├─ Catch: localStorage parse error
   └─ Return: Default empty progress

2. getCurrentLevel()
   ├─ Catch: Missing getAllQuests()
   ├─ Catch: Invalid quest structure
   └─ Return: 1 (default)

3. completeQuest()
   ├─ Catch: localStorage full error
   ├─ Log: Error to console
   └─ Continue: (data may be lost)

4. MainScene.create()
   ├─ Catch: Map loading failure
   ├─ Log: Error details
   └─ Fallback: Load default map

5. Component mounting
   ├─ useEffect with try-catch
   ├─ Log: Errors to console
   └─ Default state values
```

---

## Performance Optimization

```
Optimization              Technique
───────────────          ──────────

localStorage reads        Cache result in state
localStorage writes       Batch updates when possible
Level detection           Only on mode switch/app start
Progress calculation      Memoize if called frequently
Event emissions           Only emit when data changes
Component re-renders      Use React.memo for static components
```

---

## Debugging Checklist

```
Issue: Progress not showing
→ Check: localStorage.coderquest_progress exists
→ Check: getProgress() returns object
→ Check: getAllQuests() returns array
→ Log: JSON.stringify(getProgress())

Issue: Level not advancing
→ Check: All 7 quizzes marked completed
→ Check: isLevelCompleted() returns true
→ Check: completeLevel() called
→ Log: localStorage.completedLevels

Issue: Mode switch not working
→ Check: Events emitted (console logs)
→ Check: GameUI receives event
→ Check: State updated correctly
→ Log: gameMode state value

Issue: WASD not disabled
→ Check: inputDisabled event emitted
→ Check: MainScene receives event
→ Check: inputHandler.disable() called
→ Log: console.log in inputHandler

Issue: Progress lost
→ Check: completeQuest() called
→ Check: localStorage key identical
→ Check: No page refresh between saves
→ Log: All save operations
```

---

## Summary

This architecture provides:

✅ **Separation of Concerns** - Data, UI, and game logic separated
✅ **Single Source of Truth** - All progress in one localStorage key
✅ **Event-Driven Communication** - React-Phaser bridge via events
✅ **Scalable Design** - Ready for multiple levels
✅ **Error Resilience** - Graceful fallbacks
✅ **Debugging Support** - Extensive logging
✅ **Performance** - Minimal overhead
✅ **Maintainability** - Clear structure and documentation

The system handles all edge cases, persists across sessions, and provides a seamless experience when switching between game and lesson modes.
