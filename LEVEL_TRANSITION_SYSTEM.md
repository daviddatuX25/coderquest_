# 🎯 Level Transition System - Event Trigger

**Date:** December 2, 2025  
**Status:** Event System Ready (Map Transition Logic TO BE IMPLEMENTED)  
**Purpose:** Trigger level transitions when player reaches map endpoint

---

## 📋 Overview

The level transition system detects when the player reaches the `player_end_point` object in each map and emits events to notify React and prepare for level transitions.

**Current Status:**
- ✅ Endpoint detection working
- ✅ Event system ready
- ⏳ Map transition logic (TO DO)
- ⏳ NPC loading logic (TO DO)

---

## 🎮 How It Works

### Step 1: Endpoint Detection
Player moves toward the endpoint zone at the edge of the map

```
player → moves → reaches endpoint zone
```

### Step 2: Trigger Event
When player enters endpoint zone:
```javascript
// MainScene emits:
gameEvents.emit('levelTransitionReady', {
  currentLevel: 1,
  playerPosition: { x: 769.5, y: 792.5 }
})
```

### Step 3: Notify React UI
React receives `transitionTriggerActive` event:
```javascript
gameEvents.emit('transitionTriggerActive', {
  level: 1,
  nextLevel: 2,
  previousLevel: 3
})
```

### Step 4: Player Leaves Endpoint (Optional)
If player moves away from endpoint:
```javascript
gameEvents.emit('transitionTriggerInactive', {
  level: 1
})
```

---

## 🗺️ Level Structure

```
Level 1: Jungle Temple (map1_jungle.tmj)
  ├─ Endpoint: Right edge (x: 769.5, y: 792.5)
  ├─ Next: Level 2 (Town)
  └─ NPCs: Mage Mentor, Scholar, Wizard

Level 2: Town Center (map2_town.tmj)
  ├─ Endpoint: Right edge or Left edge
  ├─ Next: Level 3 (City)
  ├─ Previous: Level 1 (Jungle)
  └─ NPCs: Healer, Merchant, Detective

Level 3: City Skyline (map3_city.tmj)
  ├─ Endpoint: Left edge or Right edge
  ├─ Previous: Level 2 (Town)
  └─ NPCs: Engineer, Artist, Scholar
```

---

## 📡 Event Flow

```
PLAYER AT ENDPOINT
        ↓
setupLevelEndpoint() detects overlap
        ↓
emit('levelTransitionReady', data)
        ↓
MainScene catches event
        ↓
emit('transitionTriggerActive', {level, nextLevel, prevLevel})
        ↓
React receives in GameUI
        ↓
(TO DO) Show UI indicator: "Press Arrow keys to transition"
        ↓
(TO DO) Handle transition when player presses arrow
```

---

## 🔧 Event Listeners (Added)

### In MainScene.setupReactEventListeners()

#### Listen for Level Transition Ready
```javascript
gameEvents.on('levelTransitionReady', (data) => {
  console.log(`🚀 Level transition ready! Current level: ${data.currentLevel}`)
  
  // Emit transitionTriggerActive to notify React
  gameEvents.emit('transitionTriggerActive', {
    level: data.currentLevel,
    nextLevel: this.getNextLevel(data.currentLevel),
    previousLevel: this.getPreviousLevel(data.currentLevel)
  })
})
```

#### Listen for Level Transition Canceled
```javascript
gameEvents.on('levelTransitionCanceled', (data) => {
  console.log(`❌ Level transition canceled`)
  
  // Emit transitionTriggerInactive
  gameEvents.emit('transitionTriggerInactive', {
    level: data.currentLevel
  })
})
```

---

## 🎛️ Helper Methods (Added)

### getNextLevel(currentLevel)
```javascript
getNextLevel(currentLevel) {
  const levelMap = {
    1: 2,
    2: 3,
    3: 1  // Wrap around
  }
  return levelMap[currentLevel] || 1
}
```

### getPreviousLevel(currentLevel)
```javascript
getPreviousLevel(currentLevel) {
  const levelMap = {
    1: 3,  // Wrap around
    2: 1,
    3: 2
  }
  return levelMap[currentLevel] || 1
}
```

---

## 🎯 Phase Planning

Per the architecture plan, the next steps are:

### Phase 3: Game Systems
- [ ] **3.1 - NPC Loading**: Load correct NPCs for each level
  - File: `PHASE-3-GAME-SYSTEMS/01-NPC-SYSTEM.md`
  - What: Modify `createSampleNPCs()` to load NPCs based on current level
  - Data: NPC definitions for each level (already in code)

### Phase 4: Data Files
- [ ] **4.1 - NPC Data**: Complete NPC metadata
  - File: `PHASE-4-DATA-FILES/01-NPC-DATA.md`
  - What: Create `npcsByLevel.js` data file

### Phase 5: Integration
- [ ] **5.1 - Map Transitions**: Implement actual level loading
  - File: `PHASE-5-INTEGRATION/README.md`
  - What: Create `levelTransition()` method in MainScene
  - How: Fade out → Load new map → Fade in → Spawn player

---

## 📝 TODO List

### Immediate (Next Steps)

1. **React UI Indicator** (UI Layer)
   - Listen for `transitionTriggerActive` event
   - Show indicator at bottom: "Ready to go to Level 2!"
   - Show arrow key hint: "← Left / Right →"

2. **Player Input for Transition** (InputHandler)
   - Detect LEFT/RIGHT arrow at endpoint
   - Emit `transitionInitiated` event

3. **Map Loading** (MapManager)
   - Implement `loadMapByLevel(levelId)`
   - Clear current NPC sprites
   - Load new tilemap

4. **NPC Respawning** (NPCSystem)
   - Load level-specific NPCs
   - Create NPC data by level
   - Position NPCs correctly

### Architecture References

**For Level Transition Implementation:**
- See: `ARCHITECTURE/WORKFLOW/PHASE-5-INTEGRATION/README.md`
- See: `DOCUMENTATION/GUIDES/SETUP_GUIDE.md` (3-Level System section)

**For Level Structure:**
- See: `public/assets/map1_jungle.tmx` (player_end_point object)
- See: `public/assets/map2_town.tmx` (level 2 endpoints)
- See: `public/assets/map3_city.tmx` (level 3 endpoints)

---

## 🧪 Testing the Current System

To verify endpoint detection is working:

1. **Run game**: `npm run dev`
2. **Move player**: Use WASD to move toward right/left edge
3. **Check console**: Look for logs:
   - `🎯 Player reached level endpoint!`
   - `🚀 Level transition ready!`
   - `transitionTriggerActive event emitted`

4. **Move away**: Player should log:
   - `👈 Player left level endpoint`
   - `levelTransitionCanceled event emitted`

---

## 📚 Relevant Code Files

### Files Modified
- `src/game/scenes/MainScene.js`
  - Added: `setupLevelEndpoint()`
  - Added: `getNextLevel()`
  - Added: `getPreviousLevel()`
  - Modified: `setupReactEventListeners()` (added level transition listeners)

### Files To Modify Next
- `src/game/objects/MapManager.js` - Add level loading
- `src/GameUI.jsx` - Add transition UI
- `src/data/npcsByLevel.js` - Create NPC data by level (NEW)

---

## 🎉 Summary

**What's Done:**
- ✅ Endpoint detection system
- ✅ Event emission framework
- ✅ Level mapping helpers
- ✅ Event listeners in MainScene

**What's Next:**
- React UI to show transition ready state
- Map loading logic
- NPC spawning by level
- Scene transitions with fade effects

**When Complete:** Players can seamlessly move between 3 levels with different NPCs and quests!
