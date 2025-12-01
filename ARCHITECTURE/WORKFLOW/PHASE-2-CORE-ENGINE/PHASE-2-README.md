# PHASE 2: CORE ENGINE - README

**Duration:** 2-3 days  
**Effort:** Medium (coding + debugging)  
**Complexity:** Moderate (Phaser basics + React integration)  
**Goal:** Functioning Phaser game with player movement and React overlay

---

## 🎯 Phase 2 Overview

This phase is where you actually **start coding the game**. You'll create:

- ✅ Phaser GameScene (the game world)
- ✅ Player sprite with movement
- ✅ Camera following player
- ✅ Input handling (arrow keys)
- ✅ React App wrapper
- ✅ Event system connection

By end of Phase 2, you'll have a playable game world!

---

## 📋 Phase 2 Checklist

### Before Starting Phase 2
- [ ] Phase 1 is 100% complete
- [ ] `npm run dev` works
- [ ] Browser opens to localhost:5173
- [ ] Console shows no red errors
- [ ] You can Ctrl+C to stop server

### During Phase 2
- [ ] GameScene.js created and working
- [ ] Player sprite visible
- [ ] Player moves with arrow keys
- [ ] Camera follows player
- [ ] React wrapper functional
- [ ] Event system connected

### After Phase 2
- [ ] Player can walk around
- [ ] Camera follows smoothly
- [ ] No console errors
- [ ] Game is playable

---

## 🗺️ Phase 2 Structure

```
PHASE 2: CORE ENGINE
├── Step 1: GameScene Setup (01-GAMESCENE-SETUP.md)
│   ├─ Create GameScene.js
│   ├─ Create App.jsx
│   ├─ Create index.jsx
│   └─ Test game initializes
│
├── Step 2: Player Controller (02-PLAYER-CONTROLLER.md)
│   ├─ Create PlayerController.js
│   ├─ Add animations
│   ├─ Add idle/walking states
│   └─ Test movement
│
└── Step 3: Test Movement (03-TEST-MOVEMENT.md)
    ├─ Test all movement keys
    ├─ Test camera follow
    ├─ Test performance
    └─ Optimize if needed
```

---

## ✅ Phase 2 Success Criteria

By end of this phase, you should:

1. ✅ Have functioning Phaser game
2. ✅ See player sprite on screen
3. ✅ Move player with arrow keys
4. ✅ Camera follows player
5. ✅ React UI loads without errors
6. ✅ No console crashes
7. ✅ Game is stable and responsive
8. ✅ Code is organized in modules

If all 8 are true → **Phase 2 complete!** ✅

---

## 📊 Time Breakdown

| Step | File | Duration | Focus |
|------|------|----------|-------|
| 1 | 01-GAMESCENE-SETUP.md | 2-3 hours | Create game |
| 2 | 02-PLAYER-CONTROLLER.md | 1-2 hours | Add player |
| 3 | 03-TEST-MOVEMENT.md | 30-45 min | Test & debug |
| **Total** | **All 3** | **4-6 hours** | **Core complete** |

---

## 🎮 What You'll Create

### Files to Create
```
src/
├── gameEngine/
│   ├── GameScene.js (Main game world)
│   └── PlayerController.js (Player movement)
├── App.jsx (React wrapper)
└── index.jsx (Entry point)
```

### Files to Modify
```
index.html (Link to React root)
package.json (Already has dependencies)
vite.config.js (Already configured from Phase 1)
```

---

## 🔄 Workflow This Phase

```
START: Phase 1 complete, npm works
  ↓
STEP 1: Create GameScene
  ├─ Create src/gameEngine/GameScene.js
  ├─ Create src/App.jsx
  ├─ Create src/index.jsx
  ├─ Test game initializes
  └─ Expected: Black canvas with player sprite
  ↓
STEP 2: Create Player Controller
  ├─ Create src/gameEngine/PlayerController.js
  ├─ Add player sprite
  ├─ Add movement
  ├─ Add animations
  └─ Expected: Player moves with arrow keys
  ↓
STEP 3: Test Everything
  ├─ Test movement in all directions
  ├─ Test camera following
  ├─ Test performance
  └─ Expected: Smooth gameplay
  ↓
END: Phase 2 complete! ✅
```

---

## 💡 Key Concepts

### GameScene
- Main Phaser scene
- Manages game world
- Coordinates systems
- Handles lifecycle (preload, create, update)

### PlayerController
- Manages player character
- Handles input
- Manages animations
- Emits events

### Camera
- Follows player
- Keeps viewport centered
- Manages boundaries

### Event System
- React listens to Phaser events
- Phaser listens to React events
- Communication bridge

---

## ⚠️ Common Issues in Phase 2

### "Game doesn't appear"
→ Check browser console (F12)
→ Check GameScene is created
→ See 01-GAMESCENE-SETUP.md troubleshooting

### "Player doesn't move"
→ Check input handler is set up
→ Check arrow keys aren't captured by browser
→ See 02-PLAYER-CONTROLLER.md troubleshooting

### "Game is slow/laggy"
→ Check you're running dev server not build
→ Check browser DevTools performance tab
→ See 03-TEST-MOVEMENT.md optimization

### "Camera is weird"
→ Check camera bounds
→ Check camera follow is enabled
→ See 01-GAMESCENE-SETUP.md camera section

---

## 🎓 Architecture This Phase

```
React Layer
    ↓
index.jsx (Entry)
    ↓
App.jsx (Wrapper)
    ↓
GameUI.jsx (Event listener)
    ↓
Phaser Game Instance
    ↓
GameScene
    ├─ PlayerController
    ├─ Input handler
    └─ Camera
```

---

## 🚀 Let's Build!

### Next: Open `01-GAMESCENE-SETUP.md`

This guide has:
- Detailed step-by-step checklist
- Complete code templates (copy-paste ready)
- Expected console output
- Troubleshooting section
- Testing instructions

**Go there now and start coding!** ▶️

---

## 📖 Phase 2 Files (In Order)

1. **`01-GAMESCENE-SETUP.md`** ← Start here
   - Create basic Phaser game
   - Setup React wrapper
   - Test game initializes

2. **`02-PLAYER-CONTROLLER.md`** ← Then here
   - Add player sprite
   - Add movement
   - Add animations

3. **`03-TEST-MOVEMENT.md`** ← Finally here
   - Comprehensive testing
   - Performance optimization
   - Troubleshooting

---

## 🎉 When Phase 2 is Complete

You'll have:
- ✅ Working Phaser game
- ✅ Player sprite visible
- ✅ Player movement working
- ✅ Camera following
- ✅ React wrapper functional
- ✅ Event system connected
- ✅ Code organized in modules

**Next:** Phase 3 (Game Systems)

