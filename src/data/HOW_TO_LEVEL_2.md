## How to Proceed to Level 2 🚀

**Status:** Ready to test!

---

## Step-by-Step Instructions

### 1. **Complete All Quests in Level 1**
   - Talk to each of the 6 NPCs in the Jungle:
     - 🐂 **Bull (Mage Mentor)** - Variables
     - 🐑 **Sheep (Scholar)** - Functions  
     - 🐓 **Rooster (Wizard)** - Arrays
     - 🐑 **Lamb (Warrior)** - Loops
     - 🦃 **Turkey (Sage)** - Objects
     - 🐷 **Piglet (Rogue)** - Promises

### 2. **Reach the End-of-Level Trigger**
   - After completing quests, walk your player character to the edge of the map
   - Look for the glowing endpoint zone (marked by `player_end_point` in the tilemap)
   - When you enter this zone, a transition UI will appear

### 3. **Accept the Transition**
   - Click **"🚀 Proceed to Level 2"** button
   - The game will automatically:
     - Fade out the Jungle map
     - Load the Town map (map2_town)
     - Spawn you at the new level's spawn point
     - Load 9 new NPCs with new quests

### 4. **Explore Level 2 - The Town**
   - 9 new NPCs await:
     - 🏛️ Town Keeper (Data Structures)
     - 🏪 Merchant (Debugging)
     - 📚 Scholar Elder (Testing)
     - 🔧 Engineer - Bull NPC (OOP Basics)
     - 📖 Librarian - Sheep NPC (API Calls)
     - 👮 City Guard - Rooster NPC (Async/Await)
     - 🎨 Artisan - Lamb NPC (State Management)
     - 🧙 Town Sage - Turkey NPC (Design Patterns)
     - 👑 Grand Master - Bull NPC (Best Practices)

---

## Technical Details

### What Happens During Transition

**From Game Side (MainScene.js):**
1. `setupLevelEndpoint()` detects when player enters endpoint zone
2. Emits `levelTransitionReady` event to React
3. React shows the transition UI
4. Player clicks "Proceed"
5. React emits `transitionToLevel` event back to game
6. `transitionToLevel()` method executes:
   - Saves current level state
   - Clears old NPCs and map
   - Loads new map tiles
   - Repositions player at new spawn point
   - Creates new NPCs for new level
   - Re-enables input

**From React Side (GameUI.jsx):**
1. `LevelTransitionUI` listens for `levelTransitionReady` event
2. Shows beautiful overlay with level info
3. Player chooses to proceed or stay
4. If proceed: emits `transitionToLevel` to game layer

### Event Flow

```
Player enters endpoint zone
  ↓
setupLevelEndpoint() detects overlap
  ↓
emit 'levelTransitionReady' → React
  ↓
LevelTransitionUI shows overlay
  ↓
Player clicks "Proceed to Level 2"
  ↓
emit 'transitionToLevel' → Game
  ↓
transitionToLevel() executes
  ↓
New map and NPCs loaded
  ↓
Game ready for Level 2!
```

---

## Map Configuration

### Level 1 - Jungle
- **Map Key:** `map-jungle` (3000×2400px)
- **Tileset:** `tf-jungle-tileset`
- **Layers:** bush, tile_platform, trees (multiple), rocks
- **NPCs:** 6 animals
- **Spawn Point:** `player_spawn_point`
- **Endpoint:** `player_end_point`

### Level 2 - Town
- **Map Key:** `map-town` (loaded in BootScene)
- **Tileset:** `village-tileset`
- **Layers:** ground, path, buildings, walls, decorations
- **NPCs:** 9 human/animal NPCs (will load when transitioning)
- **Spawn Point:** `player_spawn_point` (same object name)
- **Endpoint:** `player_end_point` (same object name)

---

## Data Files Involved

| File | Purpose |
|------|---------|
| `src/data/npcsByLevel.js` | NPC definitions for all 3 levels |
| `src/data/sampleQuests.js` | 15 quests (6 for L1, 9 for L2) |
| `src/game/scenes/MainScene.js` | Level loading & transition logic |
| `src/components/LevelTransitionUI.jsx` | Transition overlay component |
| `src/styles/_level-transition.scss` | Transition UI styling |
| `assets/map2_town.tmj` | Town map data |

---

## Troubleshooting

### "Can't find spawn point"
- Ensure `map2_town.tmj` has `player_spawn_point` object layer
- Check the object layer name in Tiled editor

### "NPCs not appearing in Level 2"
- Verify `getNPCsForLevel(2)` returns 9 NPCs from `npcsByLevel.js`
- Check that all animal sprite keys are loaded in BootScene.js
- Verify spawn point names: `npc_spawn_point_1` through `npc_spawn_point_9`

### "Can't proceed past endpoint"
- Walk directly into the endpoint zone
- The zone should be at the edge/exit of the map
- UI overlay should appear within 2 seconds

### "After transition, game feels slow"
- Clear browser cache (Ctrl+Shift+Del)
- Check console for asset loading errors
- Verify all 9 NPC sprites loaded successfully

---

## Testing Checklist

- [ ] Level 1 game loads with 6 animal NPCs
- [ ] Can talk to all 6 NPCs and start quests
- [ ] Can complete each quest by passing quiz
- [ ] Reaching endpoint shows transition UI
- [ ] Clicking "Proceed" transitions to Level 2
- [ ] Level 2 loads successfully (Town map)
- [ ] 9 NPCs appear in Level 2 at spawn points
- [ ] Can interact with Level 2 NPCs
- [ ] Reaching Level 2 endpoint shows next transition
- [ ] Can return to Level 1 or go to Level 3

---

## Next Steps After Testing

1. **Verify Level 2 Map Configuration**
   - Ensure all layer names match `getMapConfigForLevel(2)`
   - Test collision detection with obstacles

2. **Configure Level 3**
   - Set up `map-city.tmj` with spawn points
   - Verify tileset compatibility
   - Update `getMapConfigForLevel(3)` with correct layers

3. **Polish Transitions**
   - Add loading screen animation
   - Add fade effects between levels
   - Add level-specific music/sound

4. **Quest Progression**
   - Test prerequisite chains across levels
   - Verify Level 2 quests require Level 1 completion

---

**Ready to explore? Walk your character to the edge of the map and enter the endpoint zone! 🎮**
