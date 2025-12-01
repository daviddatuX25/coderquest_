# 🧪 Phaser Testing & Validation Guide

**How to test and validate the Phaser implementation**

---

## ✅ Manual Testing Checklist

### Game Initialization
- [ ] Dev server starts without errors: `npm run dev`
- [ ] Browser opens to `http://localhost:3001`
- [ ] Game canvas appears on screen (green background with grid)
- [ ] No red errors in console (only deprecation warnings are OK)

### Player Movement
- [ ] Press **W** → Player moves up
- [ ] Press **A** → Player moves left
- [ ] Press **S** → Player moves down
- [ ] Press **D** → Player moves right
- [ ] Press **UP** → Player moves up (arrow keys work)
- [ ] Press **DOWN** → Player moves down
- [ ] Press **LEFT** → Player moves left
- [ ] Press **RIGHT** → Player moves right
- [ ] Release key → Player stops moving
- [ ] Hold multiple keys → Player moves diagonally

### Player Display
- [ ] Player sprite visible at start
- [ ] Player has collision bounds
- [ ] Player position text updates in top-left
- [ ] Player stays within world bounds

### Camera
- [ ] Camera follows player as they move
- [ ] Player stays centered on screen
- [ ] Camera smooth follows (not jumpy)
- [ ] HUD text stays in place while moving

### NPCs
- [ ] Three NPCs visible on map:
  - [ ] Mentor at (300, 300)
  - [ ] Wizard at (500, 250)
  - [ ] Warrior at (200, 450)
- [ ] NPC names visible above sprites
- [ ] NPCs have collision and don't move through walls

### NPC Interaction
- [ ] Walk near Mentor
- [ ] Press **E** when close to NPC
- [ ] Dialog box appears with:
  - [ ] NPC name
  - [ ] Dialog text
  - [ ] Quest information
- [ ] Can close dialog
- [ ] Quest added to active quests

### Input & Controls
- [ ] All keys respond correctly
- [ ] Key presses update state
- [ ] No input lag (should be instant)
- [ ] Can hold multiple keys simultaneously

### Game State
- [ ] Player position saved to localStorage
- [ ] Active quests tracked
- [ ] Completed quests tracked
- [ ] Inventory items stored
- [ ] Stats persist across refresh

### Debug Mode
- [ ] Press **ESC** shows debug info
- [ ] Debug info shows current position
- [ ] Debug info shows active quests
- [ ] Debug info shows pressed keys

---

## 🔍 Console Testing

### Check for Errors
Open DevTools (F12) and check Console tab:

```javascript
// You should see these logs:
✅ 🎮 BootScene: Loading assets...
✅ 🎮 BootScene: Assets loaded, starting MainScene...
✅ 🎮 MainScene: Preloading assets...
✅ 🎮 MainScene: Creating game world...
✅ ✅ Player created at { x: 400, y: 300 }
✅ ✅ NPCs created
✅ ✅ Camera setup complete
✅ ✅ Input setup complete
✅ ✅ MainScene: Game ready!
```

### You should NOT see:
```javascript
❌ Undefined variable
❌ Cannot read property
❌ Failed to load resource
❌ SyntaxError
```

---

## 🎮 Interactive Tests

### Test 1: Player Movement Loop
```
1. Start at center of screen
2. Move in circle: Up → Right → Down → Left
3. Watch player animation
4. Check position updates correctly
5. Expected: Smooth circular movement
```

### Test 2: NPC Proximity Detection
```
1. Start near Mentor
2. Walk away slowly
3. Interaction range is 100 pixels
4. Walk until too far (no interaction prompt)
5. Expected: Range detection works
```

### Test 3: Quest System
```
1. Approach Mentor
2. Press E for interaction
3. Dialog box appears
4. Check gameState for new quest
5. Expected: Quest in getActiveQuests()
```

### Test 4: State Persistence
```
1. Open DevTools Console
2. Check: localStorage.getItem('coderquest_save')
3. Should see JSON game state
4. Reload page (Ctrl+R)
5. Expected: Player position same, quests restored
```

### Test 5: Camera Following
```
1. Move to edge of screen
2. Player should stay centered
3. Background scrolls around player
4. Expected: Smooth camera follow
```

---

## 📊 Performance Testing

### Check Frame Rate
```javascript
// In DevTools Console:
setInterval(() => {
  console.log('FPS:', window.phaserGame.loop.actualFps)
}, 1000)
```

**Expected:** 60 FPS (or close to monitor refresh rate)

### Check Memory Usage
```javascript
// In DevTools:
Performance tab → Record → Move around for 30 sec → Stop
Look for memory graph - should be stable, not increasing
```

**Expected:** Stable memory usage (no memory leaks)

### Check Render Performance
```javascript
// In DevTools:
Rendering tab → FPS Meter (top-right)
Move around and watch green bar
```

**Expected:** Consistent green bar, no drops below 30 FPS

---

## 🐛 Common Issues & Solutions

### Issue: Game doesn't load
```
Error: Cannot find module './scenes/BootScene'
```
**Solution:** Check import paths in GameConfig.js
```javascript
// Should be:
import { BootScene } from '../scenes/BootScene'
```

### Issue: SCSS compilation error
```
Error: Undefined variable
```
**Solution:** Check SCSS file paths
```scss
// Should be:
@import './variables';
@import './mixins';
// NOT:
@import './styles/variables';
```

### Issue: Player doesn't move
```
No console errors but W key doesn't work
```
**Solution:** Check InputHandler setup
```javascript
// Make sure in MainScene.create():
this.inputHandler = new InputHandler(this)
this.setupInput()
```

### Issue: Camera doesn't follow
```
Player moves but camera stays in place
```
**Solution:** Check CameraManager initialization
```javascript
this.cameraManager = new CameraManager(this)
this.cameraManager.startFollowing(this.player.sprite)
```

### Issue: NPC interaction doesn't work
```
E key doesn't trigger dialog
```
**Solution:** Verify NPC system setup
```javascript
const npc = this.npcSystem.findNearestNPC(x, y, 100)
if (npc) {
  gameEvents.emit('showDialog', npc.interact())
}
```

---

## 🧬 Code Quality Tests

### Test Player Controller
```javascript
// In browser console:
const mainScene = window.game.scene.scenes[0]
const pos = mainScene.player.getPosition()
console.log('Player at:', pos)
// Should log: Player at: { x: 400, y: 300 }
```

### Test NPC System
```javascript
const mainScene = window.game.scene.scenes[0]
const npcs = mainScene.npcSystem.getAllNPCs()
console.log('NPCs:', npcs.length)
// Should log: NPCs: 3
```

### Test Game State
```javascript
const { gameState } = window
gameState.startQuest({ id: 'test', title: 'Test' })
console.log('Active quests:', gameState.getActiveQuests())
// Should include test quest
```

### Test Input Handler
```javascript
const mainScene = window.game.scene.scenes[0]
console.log('Pressed keys:', mainScene.inputHandler.getPressedKeys())
// Press W and check again
// Should show: ['W']
```

---

## ✨ Validation Checklist

### Core Functionality
- [ ] Game runs without crashes
- [ ] Player renders and moves
- [ ] NPCs render and can be interacted with
- [ ] Camera follows player
- [ ] Game state saves/loads
- [ ] Input handler captures all keys

### System Integration
- [ ] Phaser → React events work
- [ ] React → Phaser events work
- [ ] LocalStorage persistence works
- [ ] Event emitter works
- [ ] Game state manager works

### Performance
- [ ] 60 FPS maintained
- [ ] No memory leaks
- [ ] No excessive logging
- [ ] Smooth animations
- [ ] Responsive input

### User Experience
- [ ] Controls feel responsive
- [ ] Camera feels smooth
- [ ] NPCs are visible and clear
- [ ] No visual glitches
- [ ] Debug info is helpful

---

## 📈 Testing Summary Report

After completing all tests, fill in:

```
PHASE 2 TEST REPORT
==================

Test Date: ___________
Tester: ___________

Core Functionality: [ ] Pass [ ] Fail
System Integration: [ ] Pass [ ] Fail
Performance: [ ] Pass [ ] Fail
User Experience: [ ] Pass [ ] Fail

Issues Found: ___________
Resolution: ___________

Ready for Phase 3: [ ] Yes [ ] No
```

---

## 🚀 Next Testing Phase

After Phase 2 validation, test Phase 3 systems:
- [ ] Multiple maps/levels
- [ ] Advanced NPC behavior
- [ ] Combat system
- [ ] Item pickup
- [ ] Enemy AI

---

## 📞 Getting Help

If tests fail:

1. **Check Console:** Look for error messages
2. **Check Network:** Verify assets are loading
3. **Check Code:** Review MainScene.js setup
4. **Check Logs:** Look for system initialization logs
5. **Restart:** Kill and restart dev server

Ask questions in issues or documentation!
