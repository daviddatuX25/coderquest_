# 📋 Quick Reference Card

**Print this out or bookmark it!**

---

## 🎯 Where to Find What

### "I want to understand the overall structure"
→ **ARCHITECTURE/README.md**

### "I'm building the Phaser game"
→ **ARCHITECTURE/02-PHASER-LAYER/PHASER_ARCHITECTURE.md**
- GameScene.js template
- PlayerController.js template
- NPCSystem.js template
- MapManager.js template
- CameraManager.js template
- CollisionManager.js template

### "I want to know what's done vs what's TO DO"
→ **ARCHITECTURE/01-FOUNDATION/PROJECT_STRUCTURE.md**
- Folder organization
- Completed items
- Items to build
- Implementation order

### "How do Phaser and React talk to each other?"
→ **ARCHITECTURE/04-EVENT-SYSTEM/EVENT_SYSTEM.md**
- Event list
- How to emit
- How to listen
- Debugging

### "I need to understand React components"
→ **ARCHITECTURE/03-REACT-LAYER/REACT_ARCHITECTURE.md**
- Component hierarchy
- Props for each
- State for each
- Data types

### "I'm working with styles"
→ **ARCHITECTURE/06-STYLING/STYLING_ARCHITECTURE.md**
- Color variables
- Typography system
- Spacing scale
- Reusable mixins

### "I need the database schema"
→ **ARCHITECTURE/05-DATABASE/DATABASE_ARCHITECTURE.md**
- 12 table definitions
- ER diagram
- SQL queries
- API endpoints

---

## 🔄 Event Quick Reference

### Phaser → React Events

| Event | Emitted When | Data |
|-------|-------------|------|
| `showDialog` | Player E near NPC | npcId, name, dialog |
| `showQuest` | Dialog closed | questId, title, content |
| `npcInRange` | Player near NPC | npcId, npcName |
| `npcOutOfRange` | Player away from NPC | npcId |
| `mapChanged` | Level transitioned | mapName |

### React → Phaser Events

| Event | Emitted When | Data |
|-------|-------------|------|
| `dialogClosed` | User closes dialog | npcId |
| `questClosed` | User exits quest | questId |
| `questCompleted` | User finishes quiz | questId, score |

---

## 🏗️ The 6 Phaser Systems to Build

```
GameScene                       (Main container)
├── PlayerController             (Movement logic)
├── NPCSystem                    (NPC behavior)
├── MapManager                   (Level loading)
├── CameraManager                (Camera control)
└── CollisionManager             (Physics)
```

**Build order:** 1 → 2 → 3 → 4 → 5 → 6

---

## 📁 File Organization

**What's Done ✅**
```
src/
├── components/         ✅ 7 React components
├── hooks/              ✅ Event system (useGameEvents)
├── styles/             ✅ All SCSS complete
└── GameUI.jsx          ✅ Main event processor
```

**What to Build ❌**
```
src/
├── gameEngine/         ❌ Create folder
│   ├── GameScene.js
│   ├── PlayerController.js
│   ├── NPCSystem.js
│   ├── MapManager.js
│   ├── CameraManager.js
│   ├── CollisionManager.js
│   └── CONFIG.js
├── data/               ❌ Create folder
│   ├── npcData.js
│   ├── mapData.js
│   ├── questsData.js
│   └── lessonsData.js
├── services/           ❌ Create folder
│   ├── eventBus.js
│   ├── gameStateManager.js
│   └── apiService.js
├── App.jsx             ❌ Create
└── index.jsx           ❌ Create
```

---

## 🎮 The Main Game Loop

```
1. Player presses WASD/Arrows
   ↓
2. PlayerController moves player
   ↓
3. GameScene checks NPC proximity
   ↓
4. If player near NPC, highlight it
   ↓
5. Player presses E
   ↓
6. GameScene pauses game
   ↓
7. GameScene emits 'showDialog'
   ↓
8. React GameUI opens DialogBox
   ↓
9. User reads and clicks "Continue"
   ↓
10. React emits 'dialogClosed'
   ↓
11. GameScene shows quest
   ↓
12. React opens QuestPopup/Quiz
   ↓
13. User completes quiz
   ↓
14. React emits 'questCompleted'
   ↓
15. GameScene saves progress and resumes
   ↓
Loop back to step 1
```

---

## 🚀 Implementation Steps (In Order)

### Week 1
```
Day 1: Setup environment
  - npm install
  - npm run dev works
  
Day 2-3: Build GameScene.js
  - Follow template from PHASER_ARCHITECTURE.md
  - Test canvas renders
  
Day 4: Build PlayerController.js
  - Implement movement
  - Test WASD works
  
Day 5: Connect to event bus
  - Setup event listeners
  - Test React components load
```

### Week 2
```
Day 1-2: Build NPCSystem.js
  - Create NPC class
  - Test NPC rendering
  
Day 3: Build MapManager.js
  - Load map data
  - Test map displays
  
Day 4: Build other managers
  - CameraManager.js
  - CollisionManager.js
  
Day 5: Full integration test
  - E key → Dialog opens
  - Dialog → Quiz opens
  - Quiz complete → Game resumes
```

### Week 3
```
Day 1-2: Create data files
  - npcData.js
  - mapData.js
  - questsData.js
  - lessonsData.js
  
Day 3-4: Testing
  - Test each NPC
  - Test all quests
  - Test all maps
  
Day 5: Polish
  - Animations
  - Audio
  - Bug fixes
```

---

## 💾 File Sizes (Current)

| Folder | Size | Status |
|--------|------|--------|
| src/components/ | ~15 KB | ✅ Done |
| src/styles/ | ~20 KB | ✅ Done |
| src/hooks/ | ~3 KB | ✅ Done |
| ARCHITECTURE/ | ~150 KB | ✅ Done |

**Game code to write:** ~50-100 KB (will grow as you build)

---

## 🔑 Key Variables/Objects

### Player Position
```javascript
{ x: 100, y: 200 }
```

### NPC Data
```javascript
{
    id: 1,
    name: "Mage",
    dialog: "Welcome...",
    sprite: "npc_mage",
    quests: [1, 2]
}
```

### Quest Data
```javascript
{
    id: 1,
    title: "Variables Quest",
    lesson: { /* content */ },
    quiz: { /* questions */ }
}
```

### Event Flow
```javascript
// Emit from Phaser
window.gameEvents.emit('showDialog', npcData);

// Listen in React
useGameEventListener('showDialog', (data) => {
    console.log(data);
});

// Emit from React
const { emit } = useGameEventEmitter();
emit('dialogClosed', { npcId: 1 });

// Listen in Phaser
window.gameEvents.on('dialogClosed', (data) => {
    console.log(data);
});
```

---

## 📊 Component Tree

```
App
└── GameUI
    ├── Phaser Canvas (Rendered by GameScene)
    ├── DialogBox (Hidden by default)
    └── QuestPopup
        ├── Lesson OR
        └── Quiz
            ├── MultipleChoiceQuestion OR
            ├── FillInBlanksQuestion OR
            └── QuizResults
```

---

## 🎨 Color Palette

```
Primary:        #3b82f6 (Blue)
Success:        #10b981 (Green) - Correct answers
Error:          #ef4444 (Red) - Wrong answers
Background:     #f8fafc (Light) - Modals
Dark Background: #0d1b2a (Very dark) - Game area
Text Primary:   #1f2937 (Dark gray)
```

---

## 📱 Responsive Breakpoints

```
Mobile:   ≤ 768px
Tablet:   769px - 1024px
Desktop:  ≥ 1025px
```

---

## ⚡ Quick Commands

```powershell
# Read documentation
code ARCHITECTURE/README.md

# Start dev server
npm run dev

# Open browser
start http://localhost:5173/

# Create new folder
mkdir src/gameEngine

# Create new file
echo "" > src/gameEngine/GameScene.js
```

---

## ✅ Pre-Build Checklist

- [ ] package.json updated with proper scripts
- [ ] npm install completed
- [ ] npm run dev works
- [ ] Browser opens on localhost:5173
- [ ] React components display
- [ ] SCSS loads correctly
- [ ] No console errors

---

## ❌ Common Mistakes

- Don't build all 6 systems at once (build one by one)
- Don't put game logic in React (it goes in Phaser)
- Don't hardcode colors/sizes (use variables)
- Don't skip event connections (test early)
- Don't ignore responsive design (test on mobile)
- Don't forget to test (test after each feature)

---

## 🔗 Related Files

**Must Read First:**
- ARCHITECTURE/README.md
- ARCHITECTURE/01-FOUNDATION/PROJECT_STRUCTURE.md
- ARCHITECTURE/02-PHASER-LAYER/PHASER_ARCHITECTURE.md

**Reference As Needed:**
- ARCHITECTURE/03-REACT-LAYER/REACT_ARCHITECTURE.md
- ARCHITECTURE/04-EVENT-SYSTEM/EVENT_SYSTEM.md
- ARCHITECTURE/06-STYLING/STYLING_ARCHITECTURE.md
- ARCHITECTURE/05-DATABASE/DATABASE_ARCHITECTURE.md

**Implementation Summary:**
- CLEAN_START_SUMMARY.md

---

## 📞 FAQ (Super Quick)

**Q: Where do I start?**
A: ARCHITECTURE/README.md

**Q: Do I need a backend?**
A: Not for testing locally

**Q: Should I build database first?**
A: No, build game first

**Q: What language?**
A: JavaScript (Phaser + React)

**Q: How long will it take?**
A: 3-4 weeks if you work on it daily

**Q: Can I test without Phaser?**
A: Yes! Use CoderQuest/component-test.html

**Q: Where's the code?**
A: Templates in PHASER_ARCHITECTURE.md

---

## 🎯 Success Metrics

✅ **Phase 1 Success:** Player can move around and NPC highlights when nearby
✅ **Phase 2 Success:** Press E opens dialog, dialog closes shows quest
✅ **Phase 3 Success:** User completes quiz, game resumes
✅ **Phase 4 Success:** Can play multiple quests and see results
✅ **Phase 5 Success:** Game feels polished and complete

---

**Print this page or bookmark it!**  
**Updated: November 30, 2025**

