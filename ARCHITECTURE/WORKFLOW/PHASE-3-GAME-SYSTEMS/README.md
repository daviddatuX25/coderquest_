# PHASE 3: GAME SYSTEMS - README

**Duration:** 2-3 days  
**Effort:** Medium (refactoring + new systems)  
**Complexity:** Moderate (multiple systems working together)  
**Goal:** Complete game world with NPCs, maps, camera, collision

---

## 🎯 Phase 3 Overview

Phase 2 got the basics working. Phase 3 is where the game becomes **real**.

You'll create:
- ✅ NPCSystem (spawn NPCs, proximity, interaction)
- ✅ MapManager (load maps, manage layers)
- ✅ CameraManager (smooth camera, boundaries)
- ✅ CollisionManager (physics, callbacks)

By end of Phase 3, you'll have a complete game world!

---

## 🗂️ Phase 3 Structure

```
PHASE 3: GAME SYSTEMS
├── Step 1: NPC System (01-NPC-SYSTEM.md)
│   ├─ Create NPCSystem.js
│   ├─ NPC spawning
│   ├─ Proximity detection
│   └─ Highlighting
│
├── Step 2: Map Manager (02-MAP-MANAGER.md)
│   ├─ Create MapManager.js
│   ├─ Load Tiled maps
│   ├─ Spawn objects
│   └─ Handle layers
│
├── Step 3: Camera Manager (03-CAMERA-MANAGER.md)
│   ├─ Create CameraManager.js
│   ├─ Smooth following
│   ├─ Boundary constraints
│   └─ Viewport management
│
├── Step 4: Collision Manager (04-COLLISION-MANAGER.md)
│   ├─ Create CollisionManager.js
│   ├─ Physics setup
│   ├─ Collision groups
│   └─ Event callbacks
│
└── Step 5: Test Everything (05-TEST-SYSTEMS.md)
    ├─ Test NPC interactions
    ├─ Test map loading
    ├─ Test collisions
    └─ Test performance
```

---

## ✅ Phase 3 Success Criteria

By end of this phase:

1. ✅ Multiple NPCs visible
2. ✅ Can approach and highlight NPCs
3. ✅ Multiple maps can load
4. ✅ Player collides with objects
5. ✅ Camera manages boundaries
6. ✅ All systems working together
7. ✅ No console errors
8. ✅ Game is stable

If all 8 are true → **Phase 3 complete!** ✅

---

## 📊 Time Breakdown

| Step | File | Duration | Focus |
|------|------|----------|-------|
| 1 | 01-NPC-SYSTEM.md | 1-1.5 hours | NPCs |
| 2 | 02-MAP-MANAGER.md | 1-1.5 hours | Maps |
| 3 | 03-CAMERA-MANAGER.md | 45-60 min | Camera |
| 4 | 04-COLLISION-MANAGER.md | 45-60 min | Collisions |
| 5 | 05-TEST-SYSTEMS.md | 45-60 min | Integration |
| **Total** | **All 5** | **5-6 hours** | **Systems done** |

---

## 🎮 Systems Architecture

```
GameScene
├── NPCSystem
│   ├─ NPCs array
│   ├─ Spawn logic
│   ├─ Proximity detection
│   └─ Highlight logic
│
├── MapManager
│   ├─ Tilemap loading
│   ├─ Layer management
│   ├─ Object spawning
│   └─ Collision tiles
│
├── CameraManager
│   ├─ Camera follow
│   ├─ Boundary constraints
│   ├─ Smooth movement
│   └─ Viewport updates
│
└── CollisionManager
    ├─ Physics world
    ├─ Body creation
    ├─ Collision callbacks
    └─ Trigger zones
```

---

## 🔄 Data You'll Need

### NPCs (from data/npcs.js)
- id, name, x, y, dialog, quest

### Maps (from data/maps.js)
- id, name, tilesets, objects, npcs

### Collisions
- Tile collisions (from tilemap)
- Object collisions (walls, obstacles)
- Trigger zones (for NPC interaction)

---

## ⚠️ Common Issues in Phase 3

### "NPCs don't appear"
→ Check NPC data is loaded
→ Check spawn positions are correct
→ See 01-NPC-SYSTEM.md troubleshooting

### "Map doesn't load"
→ Check tilemap path is correct
→ Check asset files exist
→ See 02-MAP-MANAGER.md troubleshooting

### "Camera is jittery"
→ Check follow settings
→ Check boundary values
→ See 03-CAMERA-MANAGER.md troubleshooting

### "Collisions aren't working"
→ Check physics are enabled
→ Check bodies are created
→ See 04-COLLISION-MANAGER.md troubleshooting

---

## 🎯 What You'll Create

### New Files
```
src/gameEngine/
├── NPCSystem.js (100-150 lines)
├── MapManager.js (150-200 lines)
├── CameraManager.js (100-150 lines)
└── CollisionManager.js (150-200 lines)
```

### Modify Files
```
src/gameEngine/GameScene.js
├─ Add NPCSystem initialization
├─ Add MapManager initialization
├─ Add CameraManager initialization
└─ Add CollisionManager initialization
```

---

## 🚀 Let's Build Phase 3!

### Next: Open `01-NPC-SYSTEM.md`

This guide has:
- Detailed step-by-step checklist
- Complete NPCSystem code
- Expected console output
- Troubleshooting section
- Testing instructions

**Go there now!** ▶️

---

## 📖 Phase 3 Files (In Order)

1. **`01-NPC-SYSTEM.md`** ← Start here
   - Create NPC system
   - Spawn NPCs
   - Proximity detection

2. **`02-MAP-MANAGER.md`** ← Then here
   - Load tilemap
   - Manage layers
   - Spawn objects

3. **`03-CAMERA-MANAGER.md`** ← Then here
   - Smooth camera
   - Set boundaries
   - Optimize movement

4. **`04-COLLISION-MANAGER.md`** ← Then here
   - Setup physics
   - Create bodies
   - Handle callbacks

5. **`05-TEST-SYSTEMS.md`** ← Finally here
   - Integration testing
   - Performance check
   - Optimization

---

## 🎉 When Phase 3 is Complete

You'll have:
- ✅ NPC system working
- ✅ Multiple NPCs spawning
- ✅ Map loading system
- ✅ Camera management
- ✅ Physics and collisions
- ✅ All systems integrated
- ✅ Complete game world

**Next:** Phase 4 (Data Files)

