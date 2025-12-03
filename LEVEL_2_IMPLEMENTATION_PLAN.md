# 🗺️ LEVEL 2 IMPLEMENTATION PLAN: Town Center (Map 2)

**Date:** December 2, 2025  
**Objective:** Implement Level 2 (Town) with 9 NPCs, quests, and level transitions  
**Status:** Planning Phase

---

## 📊 OVERALL ARCHITECTURE

```
LEVEL PROGRESSION FLOW
├─ Level 1: Jungle (✅ COMPLETE)
│  ├─ 3 NPCs + 3 Quests
│  ├─ Player spawn & endpoint
│  └─ Transitions to Level 2
│
├─ Level 2: Town (🔨 TO BUILD - This Plan)
│  ├─ 9 NPCs + 9 Quests
│  ├─ Player spawn & endpoint
│  ├─ Transitions to Level 1 (left)
│  └─ Transitions to Level 3 (right)
│
└─ Level 3: City (⏳ Future)
   ├─ 9 NPCs + 9 Quests
   ├─ Player spawn & endpoint
   └─ Transitions to Level 2 (left)
```

---

## 📁 RESOURCES AVAILABLE

### NPC Assets (9 Files)
```
public/assets/npc_players/
├─ npc_1.png
├─ npc_2.png
├─ npc_3.png
├─ npc_4.png
├─ npc_5.png
├─ npc_6.png
├─ npc_7.png
├─ npc_8.png
└─ npc_9.png
```

### Map Assets
```
public/assets/
├─ map2_town.tmx .................. Tilemap with layers
├─ map2_town.tmj .................. JSON version
├─ Serene_Village_16x16.tsx/png ... Tileset
└─ tf_jungle_tileset.tsx/png ...... Secondary tileset
```

### Map Objects (Already in Map)
```
player_spawn_point ............... 1x ✅
player_end_point ................. 1x ✅
npc_spawn_point_1 to 9 ........... 9x ✅
```

### Quest Templates
```
Existing Quests (Level 1):
├─ quest1: Variables
├─ quest2: Functions
├─ quest3: Arrays
├─ quest4: Loops
├─ quest5: Objects
└─ quest6: Promises

New Quests Needed (Level 2): 9x
└─ To be generated with progression
```

---

## 🎯 IMPLEMENTATION PLAN

### PHASE 1: NPC Assets & Data Structure
**Duration:** 1-2 hours  
**Goal:** Prepare NPC data for Town level

#### 1.1 Load NPC Assets to Phaser
- [ ] Add `map2_town` tilemap to preload
- [ ] Load 9 NPC textures (npc_1.png - npc_9.png)
- [ ] Load `map-town` tilemap config (same pattern as jungle)

**Code Location:** `BootScene.js` preload() method

```javascript
// In BootScene.js preload()
this.load.image('npc_1', 'assets/npc_players/npc_1.png')
this.load.image('npc_2', 'assets/npc_players/npc_2.png')
// ... npc_3 through npc_9
this.load.tilemapFromURL('map-town', 'assets/map2_town.tmj')
```

#### 1.2 Create NPC Data by Level
- [ ] Create `src/data/npcsByLevel.js`
- [ ] Structure: Level 1 (3 NPCs) + Level 2 (9 NPCs) + Level 3 (9 NPCs)
- [ ] Include: id, name, dialogText, questId, spawn position

**File:** `src/data/npcsByLevel.js`

```javascript
export const NPCsByLevel = {
  1: {
    levelName: 'Jungle Temple',
    map: 'map-jungle',
    tileset: 'tf-jungle-tileset',
    npcs: [
      {
        id: 'npc-mentor',
        name: 'Mage Mentor',
        key: 'npc_1',
        x: 300, y: 200,
        dialogText: 'Welcome, young programmer!',
        questId: 'quest-variables',
        questOrder: 1
      },
      // ... 2 more NPCs
    ],
    playerSpawn: { x: 226, y: 2 },
    playerEntrance: { x: 50, y: 400 }
  },
  2: {
    levelName: 'Town Center',
    map: 'map-town',
    tileset: 'Serene_Village_16x16',
    npcs: [
      {
        id: 'npc-town-1',
        name: 'Town NPC 1',
        key: 'npc_1',
        x: 400, y: 300,
        dialogText: 'Welcome to town!',
        questId: 'quest-arrays',
        questOrder: 4,
        prerequisites: ['quest-functions']
      },
      // ... 8 more NPCs (npc_2 through npc_9)
    ],
    playerSpawn: { x: 100, y: 300 },
    playerEntrance: { x: 50, y: 400 }
  }
}
```

---

### PHASE 2: Quest Generation
**Duration:** 1-2 hours  
**Goal:** Create 9 quests for Level 2

#### 2.1 Extend Quest System
- [ ] Expand `sampleQuests.js` with 9 new quests
- [ ] Topics: Data Structures, Debugging, Testing, OOP Basics, API Calls, Async/Await, State Management, Patterns, Best Practices

**Quests 1-6 (Level 1):** Already exist ✅
- Variables, Functions, Arrays, Loops, Objects, Promises

**Quests 7-15 (Level 2 & 3):** To create
```
quest7:  Data Structures ........... Level 2, NPC 1
quest8:  Debugging ................. Level 2, NPC 2
quest9:  Testing ................... Level 2, NPC 3
quest10: OOP Basics ................ Level 2, NPC 4
quest11: API Calls ................. Level 2, NPC 5
quest12: Async/Await ............... Level 2, NPC 6
quest13: State Management .......... Level 2, NPC 7
quest14: Design Patterns ........... Level 2, NPC 8
quest15: Best Practices ............ Level 2, NPC 9
```

**File:** `src/data/sampleQuests.js` (add quest7-15)

Each quest structure:
```javascript
quest7: {
  id: 'quest-data-structures',
  title: 'Understanding Data Structures',
  lesson: { /* lesson content */ },
  quiz: { /* 5 questions */ }
}
```

---

### PHASE 3: Map Configuration
**Duration:** 30 minutes  
**Goal:** Update map configuration for Level 2

#### 3.1 Update Map Config in MainScene
- [ ] Add map2_town tileset names
- [ ] Add layer configuration (same pattern as jungle)
- [ ] Add spawn point detection logic

**Code Location:** `MainScene.js` createTilemap()

```javascript
// Detect which map and load appropriate config
const mapConfigs = {
  'map-jungle': {
    tileset: 'tf_jungle_tileset',
    walkable: ['bush', 'tile_platform'],
    obstacles: ['trees5', 'trees4+bush', ...]
  },
  'map-town': {
    tileset: 'Serene_Village_16x16',
    walkable: ['tile_plaftform'], // Note: typo in actual map
    obstacles: ['elevated_ground', 'obstacles', ...]
  }
}
```

---

### PHASE 4: NPC Spawning System
**Duration:** 1-2 hours  
**Goal:** Load NPCs based on current level

#### 4.1 Modify NPC Creation Logic
- [ ] Update `createSampleNPCs()` in MainScene
- [ ] Check `this.currentLevel`
- [ ] Load NPCs from `npcsByLevel.js`
- [ ] Position NPCs from map spawn points

**Code Changes:** `src/game/scenes/MainScene.js`

```javascript
createSampleNPCs() {
  const levelNPCs = NPCsByLevel[this.currentLevel]
  
  levelNPCs.npcs.forEach((npcData, index) => {
    // Get spawn point from map
    const spawnPointName = `npc_spawn_point_${index + 1}`
    const spawnPoint = this.getCurrentSpawnPoint(spawnPointName)
    
    // Create NPC
    const npc = new NPC(this, spawnPoint.x, spawnPoint.y, npcData.key, {
      name: npcData.name,
      dialogText: npcData.dialogText,
      questId: npcData.questId,
      questData: SAMPLE_QUESTS[npcData.questId],
      questOrder: npcData.questOrder,
      prerequisites: npcData.prerequisites
    })
    
    this.npcSystem.addNPC(npc)
  })
}
```

---

### PHASE 5: Level Transition System
**Duration:** 1-2 hours  
**Goal:** Implement map transitions

#### 5.1 Create LevelTransitionManager
- [ ] Detect when player reaches endpoint
- [ ] Load next/previous level
- [ ] Fade out current level
- [ ] Load new tilemap
- [ ] Spawn NPCs on new level
- [ ] Fade in new level
- [ ] Position player at entrance

**New File:** `src/game/systems/LevelTransitionManager.js`

```javascript
export class LevelTransitionManager {
  constructor(scene) {
    this.scene = scene
  }
  
  transitionToLevel(newLevel, direction) {
    // 1. Fade out
    this.scene.cameras.main.fadeOut(500)
    
    // 2. On fade complete:
    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      // 3. Clear NPCs
      this.scene.npcSystem.clearAllNPCs()
      
      // 4. Change level
      this.scene.currentLevel = newLevel
      
      // 5. Reload map
      this.scene.createTilemap()
      
      // 6. Spawn new NPCs
      this.scene.createSampleNPCs()
      
      // 7. Position player
      this.positionPlayerAtEntrance(direction)
      
      // 8. Fade in
      this.scene.cameras.main.fadeIn(500)
    })
  }
}
```

#### 5.2 Connect Endpoint to Transition
- [ ] Modify existing `levelTransitionReady` event handler
- [ ] Detect player input (arrow keys)
- [ ] Call `LevelTransitionManager.transitionToLevel()`
- [ ] Update `currentLevel` in GameStateManager

---

### PHASE 6: UI Updates for Transitions
**Duration:** 30 minutes  
**Goal:** Show transition prompts to player

#### 6.1 Create TransitionUI Component
- [ ] Listen for `transitionTriggerActive` event
- [ ] Show "Level X Ready!" message
- [ ] Show arrow key hints (← / →)
- [ ] Hide on `transitionTriggerInactive`

**New Component:** `src/components/TransitionUI.jsx`

```javascript
export const TransitionUI = () => {
  const [isReady, setIsReady] = useState(false)
  const [levelInfo, setLevelInfo] = useState(null)
  const { on, off } = useGameEventListener()

  useEffect(() => {
    const handleReady = (data) => {
      setIsReady(true)
      setLevelInfo(data)
    }
    
    const handleInactive = () => {
      setIsReady(false)
    }
    
    on('transitionTriggerActive', handleReady)
    on('transitionTriggerInactive', handleInactive)
    
    return () => {
      off('transitionTriggerActive', handleReady)
      off('transitionTriggerInactive', handleInactive)
    }
  }, [])

  if (!isReady) return null

  return (
    <div className="transition-prompt">
      <h2>Level {levelInfo.nextLevel} Ahead!</h2>
      <p>← Press Left or Press Right →</p>
    </div>
  )
}
```

---

## 🔄 EVENT FLOW FOR TRANSITIONS

```
PLAYER WALKS TO ENDPOINT
       ↓
setupLevelEndpoint() detects overlap ✅ (Already done)
       ↓
emit('levelTransitionReady')
       ↓
setupReactEventListeners() catches it
       ↓
emit('transitionTriggerActive', {level, nextLevel, prevLevel})
       ↓
React shows TransitionUI "Level 2 Ready!"
       ↓
PLAYER PRESSES ARROW KEY
       ↓
InputHandler detects key + at endpoint
       ↓
emit('playerInitiatedTransition', {direction, targetLevel})
       ↓
LevelTransitionManager.transitionToLevel(2)
       ↓
1. Fade out ......... 500ms
2. Clear NPCs ....... 100ms
3. Load new map .... 200ms
4. Spawn NPCs ...... 100ms
5. Position player . 100ms
6. Fade in ......... 500ms
       ↓
LEVEL 2 LOADED
Level state saved to GameStateManager
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Assets & Data (2 hours)
```
[ ] Load NPC textures (npc_1 - npc_9) in BootScene
[ ] Load map2_town tilemap in BootScene
[ ] Create src/data/npcsByLevel.js
[ ] Add Level 1 data (3 NPCs)
[ ] Add Level 2 data (9 NPCs)
[ ] Add Level 3 data (9 NPCs - placeholder)
```

### Phase 2: Quests (2 hours)
```
[ ] Expand sampleQuests.js
[ ] Create quest7: Data Structures
[ ] Create quest8: Debugging
[ ] Create quest9: Testing
[ ] Create quest10: OOP Basics
[ ] Create quest11: API Calls
[ ] Create quest12: Async/Await
[ ] Create quest13: State Management
[ ] Create quest14: Design Patterns
[ ] Create quest15: Best Practices
```

### Phase 3: Map Config (30 min)
```
[ ] Update MainScene.createTilemap()
[ ] Add map2_town tileset config
[ ] Add layer configuration
[ ] Add spawn point detection
```

### Phase 4: NPC Spawning (1.5 hours)
```
[ ] Create getCurrentSpawnPoint() method
[ ] Update createSampleNPCs() logic
[ ] Load NPCs from npcsByLevel.js
[ ] Test NPC positioning on Level 2
```

### Phase 5: Transitions (1.5 hours)
```
[ ] Create LevelTransitionManager.js
[ ] Implement transitionToLevel() method
[ ] Add fade out/in effects
[ ] Add map cleanup logic
[ ] Add NPC respawning
[ ] Test level transitions
```

### Phase 6: UI (30 min)
```
[ ] Create TransitionUI.jsx component
[ ] Add event listeners
[ ] Style transition prompt
[ ] Test visibility
```

### Phase 7: Testing & Polish (1-2 hours)
```
[ ] Test Level 1 → Level 2 transition
[ ] Test Level 2 → Level 1 transition
[ ] Test Level 2 → Level 3 transition (if ready)
[ ] Verify quest progression
[ ] Verify NPC positions
[ ] Check for visual glitches
[ ] Smooth animations
```

---

## 🎮 TESTING SEQUENCE

### Test 1: Asset Loading
```
1. Run game
2. Watch console for asset loads
3. Verify no missing texture errors
```

### Test 2: NPC Spawning Level 1
```
1. Start game
2. See 3 NPCs at spawn points ✅
3. Move around, NPCs should be there
```

### Test 3: Endpoint Detection
```
1. Move player right
2. Reach endpoint
3. See console: "🎯 Player reached endpoint!"
4. See UI prompt: "Level 2 Ahead!"
```

### Test 4: Level Transition
```
1. At endpoint with UI showing
2. Press RIGHT arrow
3. Fade out ✅
4. Fade in (should be Level 2)
5. See 9 NPCs ✅
6. Player at entrance ✅
```

### Test 5: Reverse Transition
```
1. Walk to left endpoint
2. Press LEFT arrow
3. Back at Level 1 with 3 NPCs ✅
```

### Test 6: Quest Progression
```
1. Complete Level 1 quests
2. Move to Level 2
3. New quests available (quest7+)
4. Old quests locked
5. Progression maintained ✅
```

---

## 📊 TIME ESTIMATE

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Assets & Data | 2 hours |
| 2 | Quest Generation | 2 hours |
| 3 | Map Config | 30 min |
| 4 | NPC Spawning | 1.5 hours |
| 5 | Transitions | 1.5 hours |
| 6 | UI Updates | 30 min |
| 7 | Testing & Polish | 1-2 hours |
| **Total** | **All Phases** | **9-10 hours** |

---

## 🎯 SUCCESS CRITERIA

When complete, system should:

✅ Load 9 NPCs on Level 2  
✅ Each NPC has unique quest (quest7-15)  
✅ Quests follow progression (prerequisites)  
✅ Player can transition Level 1 ↔ 2  
✅ NPCs respawn correctly on each level  
✅ Progress saved across transitions  
✅ UI shows transition prompts  
✅ Smooth animations during transitions  
✅ No visual glitches or errors  
✅ Performance remains smooth  

---

## 🔗 DEPENDENCIES

**Before Starting:**
- ✅ Level 1 system working (3 NPCs, quests)
- ✅ Endpoint detection system ready
- ✅ Event system functional
- ✅ Player collision with obstacles working
- ✅ Quest completion system working

**After Phase 1:**
- Map 2 assets loaded
- NPC data structure ready
- Level configuration possible

**After Phase 2:**
- 9 new quests available
- Quest progression defined

**After Phase 4:**
- Can spawn any NPC on any level

**After Phase 5:**
- Full level transitions working

---

## 💡 OPTIMIZATION NOTES

1. **Asset Loading:** Only load NPC textures/maps as needed (lazy loading possible)
2. **NPC Spawning:** Clear old NPCs before spawning new ones to prevent memory leaks
3. **Transition Speed:** Fade duration (500ms) balances smoothness with responsiveness
4. **Quest Persistence:** GameStateManager saves progress automatically
5. **Camera:** Already optimized for 3x zoom

---

## 📞 NEXT STEPS

**When ready to start:**

1. **Confirm this plan** - Review and approve structure
2. **Start Phase 1** - Load assets and create npcsByLevel.js
3. **Create NPC data** - Populate all 18 NPCs (3 + 9 + 6 placeholders)
4. **Generate 9 quests** - Expand quest system

**Command:** "Let's start with Phase 1: Load the NPC assets and create the npcsByLevel.js data structure"

---

**Status:** 📋 Plan Ready for Approval  
**Next Action:** Await confirmation to begin implementation
