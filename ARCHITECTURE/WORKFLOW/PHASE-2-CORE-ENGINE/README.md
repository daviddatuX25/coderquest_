# PHASE 2: CORE ENGINE

**Duration:** 2-3 days  
**Effort:** Medium (coding + debugging)  
**Complexity:** Moderate (Phaser basics + React integration)  
**Goal:** Functioning Phaser game with player movement and React overlay

---

## 📋 Phase 2 Overview

This phase is about **building the game foundation**. You'll create:
- ✅ Phaser GameScene (the game world)
- ✅ Player sprite with movement
- ✅ Camera following player
- ✅ Input handling (arrow keys)
- ✅ React App wrapper
- ✅ Event system connection

By end of Phase 2, you'll have a playable game world you can move around in.

---

## 🎯 Success Criteria

By end of Phase 2, you should be able to:

1. Run `npm run dev` without errors
2. See Phaser game window
3. See player sprite in center
4. Move player with arrow keys
5. Camera follows player smoothly
6. Player can walk around map area
7. No console errors (just warnings are fine)
8. Open React DevTools and see GameUI component

If all 8 are true → **Phase 2 complete!** ✅

---

## 📁 Phase 2 Files

```
PHASE-2-CORE-ENGINE/
├── 01-GAMESCENE-SETUP.md ........... Create Phaser game
├── 02-PLAYER-CONTROLLER.md ........ Create player movement
├── 03-TEST-MOVEMENT.md ........... Test everything works
└── README.md ..................... This file
```

---

## 🗺️ Phase 2 Workflow

```
START: Phase 1 complete, npm works
  ↓
STEP 1: Follow 01-GAMESCENE-SETUP.md
  ├─ Create src/gameEngine/GameScene.js
  ├─ Create src/App.jsx wrapper
  ├─ Create src/index.jsx entry point
  └─ Test game initializes
  ↓
STEP 2: Follow 02-PLAYER-CONTROLLER.md
  ├─ Refactor movement into PlayerController.js
  ├─ Add animations
  ├─ Add idle/walking states
  └─ Test animations play
  ↓
STEP 3: Follow 03-TEST-MOVEMENT.md
  ├─ Test all movement keys
  ├─ Test camera follow
  ├─ Test performance
  └─ Optimize if needed
  ↓
END: Phase 2 complete! ✅
```

---

## ⏱️ Time Breakdown

| Step | File | Duration | What You Do |
|------|------|----------|------------|
| 1 | 01-GAMESCENE-SETUP.md | 2-3 hours | Create game scene |
| 2 | 02-PLAYER-CONTROLLER.md | 1-2 hours | Add player controller |
| 3 | 03-TEST-MOVEMENT.md | 30-45 min | Test and debug |
| **Total** | **All 3** | **4-6 hours** | **Core engine done** |

---

## 📊 Architecture This Phase Builds

```
React Layer (UI)
    ↓
Event System (Communication)
    ↓
Phaser GameScene (Game World)
    ├─ PlayerController (Player movement)
    ├─ Map (Game area)
    ├─ Camera (Following player)
    └─ Input (Arrow keys)
```

---

## 🎮 Phaser Systems This Phase Uses

### GameScene (Main game world)
- Manages game lifecycle
- Coordinates all systems
- Handles scene events

### PlayerController (Player character)
- Handles player sprite
- Manages animations
- Processes input
- Emits movement events

### Camera
- Follows player
- Keeps viewport centered
- Handles boundaries

### Input Handler
- Listens for keyboard
- Calls player movement
- Can be extended for gamepad

---

## 🚀 Quick Start (TL;DR)

If you're experienced:

```powershell
# You should already be at Phase 1 complete

# Step 1: Create game scene
# → Follow 01-GAMESCENE-SETUP.md checklist
# → Copy all code templates
# → Run npm run dev
# → Test game loads

# Step 2: Create player controller
# → Follow 02-PLAYER-CONTROLLER.md checklist
# → Add movement logic
# → Test movement works

# Step 3: Test everything
# → Follow 03-TEST-MOVEMENT.md checklist
# → Fix any issues
# → Move to Phase 3
```

If anything doesn't work → Follow detailed guides.

---

## 📖 Detailed Guide Order

**Follow in this order:**

1. **01-GAMESCENE-SETUP.md** ⭐ START HERE
   - Creates basic game scene
   - Sets up player sprite
   - Establishes event connection
   - ~2-3 hours to complete

2. **02-PLAYER-CONTROLLER.md**
   - Separates movement logic
   - Adds animations
   - Improves code organization
   - ~1-2 hours to complete

3. **03-TEST-MOVEMENT.md**
   - Comprehensive testing
   - Troubleshooting
   - Performance optimization
   - ~30-45 min to complete

---

## ❌ Common Issues in Phase 2

### "Cannot find module 'phaser'"
→ Make sure Phaser is in package.json
→ Run `npm install`

### "Game doesn't appear"
→ Check browser console (F12)
→ Look for red errors
→ See 01-GAMESCENE-SETUP.md troubleshooting

### "Player doesn't move"
→ Check input handler is set up
→ Check arrow keys aren't already in use
→ See 02-PLAYER-CONTROLLER.md troubleshooting

### "Game is slow/laggy"
→ Check you're running `npm run dev` not build
→ See 03-TEST-MOVEMENT.md performance section

### "Camera is weird"
→ Check camera bounds are set
→ Check camera follows player
→ See camera setup in 01-GAMESCENE-SETUP.md

---

## 🎓 What You'll Learn

### Phaser Basics
- How to create game scene
- How to add sprites
- How to handle input
- How to manage camera

### Game Architecture
- How to structure game code
- How to separate concerns (player vs scene)
- How to handle state

### React-Phaser Integration
- How to create game instance
- How to communicate between frameworks
- How event system works

### Debugging Games
- How to use browser console
- How to log game state
- How to identify performance issues

---

## 🔗 Related Documentation

**Need Phaser reference?**
→ See `ARCHITECTURE/02-PHASER-LAYER/PHASER_ARCHITECTURE.md`

**Need React reference?**
→ See `ARCHITECTURE/03-REACT-LAYER/REACT_ARCHITECTURE.md`

**Need event system reference?**
→ See `ARCHITECTURE/04-EVENT-SYSTEM/EVENT_SYSTEM.md`

**Need quick reference?**
→ See `QUICK_REFERENCE.md` in root

---

## ⚠️ Pre-Phase 2 Checklist

Before starting Phase 2, make sure:

- [ ] Phase 1 is complete
- [ ] `npm run dev` works
- [ ] Browser opens to localhost:5173
- [ ] Console shows no red errors
- [ ] You can Ctrl+C to stop server

If any of these fails → Go back to Phase 1

---

## 📝 What You'll Create

By end of Phase 2, you'll have created:

```
src/
├── gameEngine/
│   ├── GameScene.js ............... Main game world
│   └── PlayerController.js ........ Player movement system
├── App.jsx ...................... React wrapper
├── index.jsx .................... Entry point
└── [other existing files]
```

---

## 🎉 Phase 2 Complete!

When you've completed all 3 steps:

1. ✅ GameScene created and working
2. ✅ Player sprite visible and movable
3. ✅ Camera follows player smoothly
4. ✅ No console errors
5. ✅ Game is responsive
6. ✅ Code is organized in modules

**Next:** Go to `PHASE-3-GAME-SYSTEMS/README.md`

---

## 📞 Stuck?

Each step file has:
- Detailed step-by-step instructions
- Copy-paste code templates
- Expected console output
- Troubleshooting section

**Read the step file carefully first.**

If still stuck:
1. Check console errors (F12)
2. Check that code matches template
3. Look at troubleshooting section
4. Try fresh start: delete cache and restart dev server

---

## 💡 Pro Tips

1. **Keep console open (F12) while coding**
   - You'll see errors immediately
   - Helps you debug faster

2. **Test after each step**
   - Don't code for 2 hours then test
   - Test after 15 min of coding

3. **Use browser DevTools**
   - React DevTools to inspect components
   - Performance tab to check FPS
   - Network tab to check resources loading

4. **Commit your progress**
   - After each step: `git commit -m "Phase 2.1 complete"`
   - After phase complete: `git commit -m "Phase 2 complete"`

---

## 🎬 Ready?

**Start here:** `01-GAMESCENE-SETUP.md`

**Go!** ▶️

