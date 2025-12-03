# ✅ Level Transition Implementation Checklist

**Status:** Event System Ready - Awaiting Map/NPC Logic  
**Date:** December 2, 2025

---

## 🎯 Phase Timeline

```
NOW: Event System Ready ✅
  ↓
PHASE 3.1: NPC Loading by Level
  ├─ Create npcsByLevel.js data structure
  ├─ Modify createSampleNPCs() to use level data
  └─ Load correct NPCs based on currentLevel
  ↓
PHASE 3.2: Map Transitions
  ├─ Add levelTransition() to MainScene
  ├─ Implement fade out → load → fade in
  └─ Handle player position on new map
  ↓
PHASE 5: Full Integration Testing
  ├─ Test all 3 levels accessible
  ├─ Test NPC respawning
  └─ Test quest completion across levels
```

---

## 📋 Event System Checklist

### ✅ Completed (This Session)

```javascript
✅ setupLevelEndpoint() method added
   ├─ Detects player in endpoint zone
   ├─ Tracks entry/exit
   └─ Emits levelTransitionReady/Canceled

✅ Event listeners added
   ├─ 'levelTransitionReady' → emit 'transitionTriggerActive'
   ├─ 'levelTransitionCanceled' → emit 'transitionTriggerInactive'
   └─ Passes level data to React

✅ Helper methods
   ├─ getNextLevel(currentLevel)
   ├─ getPreviousLevel(currentLevel)
   └─ Supports 3-level wrap-around navigation
```

### 📋 TODO - React Layer

```
[ ] Listen to 'transitionTriggerActive' in GameUI
[ ] Display transition UI element
    ├─ Show "Level X ready!"
    ├─ Show arrow key hints
    └─ Show current/next level info
[ ] Listen to 'transitionTriggerInactive'
    └─ Hide transition UI
[ ] Listen for player input (arrow keys)
    └─ Emit 'playerInitiatedTransition' event
```

### 📋 TODO - Game Logic

```
[ ] Handle 'playerInitiatedTransition' in MainScene
    ├─ Disable input
    ├─ Show fade effect
    └─ Call mapManager.loadLevel()
[ ] Create/modify MapManager.loadLevel(levelId)
    ├─ Destroy current map
    ├─ Load new tilemap
    ├─ Create new layers
    └─ Setup new collisions
[ ] Modify createSampleNPCs() to use level data
    ├─ Check this.currentLevel
    ├─ Load NPCs for that level
    └─ Position them correctly
[ ] Create NPCs by level structure
    ├─ Level 1: Mage, Scholar, Wizard
    ├─ Level 2: Healer, Merchant, Detective
    └─ Level 3: Engineer, Artist, Scholar
[ ] Handle player respawn on new level
    ├─ Place player at entrance point
    ├─ Not at endpoint
    └─ Face toward level interior
```

---

## 🗂️ File Structure To Create/Modify

### NEW FILES

```
src/data/npcsByLevel.js
├─ Export NPCs organized by level
├─ Include spawn positions
├─ Include quest assignments
└─ Include NPC metadata (name, dialog, etc)

LEVEL_TRANSITION_SYSTEM.md (CREATED ✅)
└─ Documentation of event system
```

### MODIFY FILES

```
src/game/scenes/MainScene.js ✅
├─ setupLevelEndpoint() ........... ADDED ✅
├─ setupReactEventListeners() ..... UPDATED ✅
├─ getNextLevel() ................ ADDED ✅
├─ getPreviousLevel() ............ ADDED ✅
└─ TODO: levelTransition() ........ TO ADD

src/game/objects/MapManager.js
├─ TODO: loadLevel(levelId) ....... TO ADD
├─ TODO: getCurrentLevel() ........ TO ADD
└─ TODO: getLevelConfig() ......... TO ADD

src/game/objects/NPCSystem.js
├─ TODO: getNPCsByLevel() ......... TO ADD
├─ TODO: clearNPCs() .............. TO ADD
└─ TODO: spawnNPCs() .............. TO ADD

src/GameUI.jsx
├─ TODO: Listen for transitionTriggerActive
├─ TODO: Show TransitionUI component
└─ TODO: Listen for transitionTriggerInactive

src/components/TransitionUI.jsx (NEW)
├─ Show "Level X Ready!"
├─ Show arrow hints
└─ Show progress to next level
```

---

## 🔄 Event Emission Flow

### Current Implementation ✅

```
Player at endpoint
       ↓
setupLevelEndpoint() detects
       ↓
emit('levelTransitionReady')
       ↓
MainScene.setupReactEventListeners()
       ↓
emit('transitionTriggerActive') → React
```

### TO IMPLEMENT

```
Player presses arrow key at endpoint
       ↓
InputHandler detects
       ↓
emit('playerInitiatedTransition')
       ↓
MainScene.levelTransition()
       ↓
Fade out + Load new map + Spawn NPCs
       ↓
Fade in + Resume input
       ↓
emit('levelTransitioned') → React
```

---

## 📊 Data Structure To Create

### npcsByLevel.js Example

```javascript
export const NPCsByLevel = {
  1: {
    // Level 1: Jungle
    name: 'Jungle Temple',
    map: 'map1_jungle',
    npcs: [
      {
        id: 'npc-mentor',
        name: 'Mage Mentor',
        x: 300,
        y: 200,
        questId: 'quest-variables',
        dialogText: 'Learn about Variables!'
      },
      // ... more NPCs
    ],
    playerSpawn: { x: 226, y: 2 },
    playerEntrance: { x: 50, y: 400 }  // Where to spawn when entering from Level 2
  },
  2: {
    // Level 2: Town
    name: 'Town Center',
    map: 'map2_town',
    npcs: [ /* ... */ ],
    playerSpawn: { x: 100, y: 300 },
    playerEntrance: { x: 50, y: 400 }
  },
  3: {
    // Level 3: City
    name: 'City Skyline',
    map: 'map3_city',
    npcs: [ /* ... */ ],
    playerSpawn: { x: 100, y: 300 },
    playerEntrance: { x: 50, y: 400 }
  }
}
```

---

## 🎮 Testing Sequence

### Test 1: Endpoint Detection
```
1. Run game
2. Move player right toward edge
3. Enter endpoint zone
4. ✅ Console should show:
   - "🎯 Player reached level endpoint!"
   - "🚀 Level transition ready!"
5. Move away
6. ✅ Console should show:
   - "👈 Player left level endpoint"
```

### Test 2: Level Navigation
```
1. At endpoint, press right arrow (NEXT)
   ├─ Should fade out
   ├─ Load Level 2
   ├─ Fade in
   └─ Spawn at entrance
2. Find NPC for next quest
   ├─ Should be Level 2 NPC
   ├─ Not Level 1 NPC
3. Complete quest progression
   ├─ Level 1 quest done
   ├─ Move to Level 2
   ├─ New quests available
```

### Test 3: Full Flow
```
1. Start at Level 1
2. Complete Variables quest
3. Move to Level 2
4. Complete Functions quest
5. Move to Level 3
6. Complete Arrays quest
7. ✅ All progression preserved
```

---

## 🎯 Success Criteria

When complete, the system will:

- ✅ Detect player at level endpoints
- ✅ Emit appropriate events
- ✅ Load new maps on transition
- ✅ Spawn correct NPCs per level
- ✅ Preserve player progress
- ✅ Support 3-level navigation
- ✅ Wrap around (Level 3 → Level 1)
- ✅ Show UI feedback during transitions

---

## 📚 Architecture References

**See These Documents For Guidance:**

1. `ARCHITECTURE/WORKFLOW/PHASE-3-GAME-SYSTEMS/README.md`
   - NPC loading strategy
   - Game systems architecture

2. `ARCHITECTURE/WORKFLOW/PHASE-5-INTEGRATION/README.md`
   - Map transitions
   - Event flow

3. `ARCHITECTURE/02-PHASER-LAYER/PHASER_ARCHITECTURE.md`
   - MapManager design
   - Level structure

4. `DOCUMENTATION/GUIDES/SETUP_GUIDE.md`
   - 3-Level system overview
   - Navigation structure

---

## 🚀 Next Command

When ready to implement Phase 3.1 (NPC loading by level), say:

> "Now create the NPC data by level structure and modify the NPC spawning logic"

This will:
1. Create `src/data/npcsByLevel.js`
2. Update `createSampleNPCs()` to use level data
3. Add level-specific NPC loading
4. Prepare for map transitions
