# 🎮 Phaser Quick Reference - Cheat Sheet

**Quick lookups for common Phaser tasks**

---

## 🚀 Quick Start

### Initialize Game
```javascript
import Phaser from 'phaser'
import { gameConfig } from './game/config/GameConfig'

const game = new Phaser.Game(gameConfig)
```

### Access Game Systems in Scene
```javascript
this.player          // PlayerController instance
this.npcSystem       // NPCSystem instance
this.cameraManager   // CameraManager instance
this.inputHandler    // InputHandler instance
```

---

## 👤 Player Controller

### Move Player
```javascript
player.move('up')      // Move up
player.move('down')    // Move down
player.move('left')    // Move left
player.move('right')   // Move right
player.stop()          // Stop moving
```

### Get Player Info
```javascript
const pos = player.getPosition()  // { x: 400, y: 300 }
player.setPosition(500, 400)      // Move to position
```

---

## 👥 NPC System

### Create NPC
```javascript
const npc = npcSystem.createNPC(300, 300, 'npc-sprite', {
  id: 'merchant-1',
  name: 'Merchant',
  dialogText: 'Welcome to my shop!',
  questId: 'quest-1',
  questData: { type: 'shop', reward: 100 }
})
```

### Find NPCs
```javascript
// Find nearest NPC within 100 pixels
const nearest = npcSystem.findNearestNPC(400, 300, 100)

// Find all NPCs in range
const inRange = npcSystem.findNPCsInRange(400, 300, 150)

// Get specific NPC
const npc = npcSystem.getNPC('merchant-1')
```

### Interact with NPC
```javascript
const data = npc.interact()  // Returns quest/dialog data
// data = {
//   npcName: 'Merchant',
//   dialogText: '...',
//   questId: 'quest-1',
//   questData: {...}
// }
```

---

## 📷 Camera Manager

### Follow Target
```javascript
cameraManager.startFollowing(player.sprite)
cameraManager.stopFollowing()
```

### Camera Effects
```javascript
cameraManager.setZoom(2)           // Zoom to 2x
cameraManager.shake(5, 100)        // Shake 5% for 100ms
cameraManager.fade(0x000000, 1000) // Fade black over 1 second
cameraManager.panTo(500, 500, 1000) // Pan to position
```

### Get Camera Info
```javascript
const pos = cameraManager.getPosition()      // { x, y }
const viewport = cameraManager.getViewport() // { x, y, width, height }
const zoom = cameraManager.getZoom()         // 1 by default
```

---

## 🎮 Input Handler

### Register Key Callbacks
```javascript
inputHandler.onKeyDown('W', () => {
  console.log('W pressed')
})

inputHandler.onKeyUp('E', () => {
  console.log('E released')
})
```

### Check Key Status
```javascript
if (inputHandler.isKeyDown('W')) {
  console.log('W is currently held down')
}

const pressed = inputHandler.getPressedKeys()  // ['W', 'SPACE']
```

### Movement Helpers
```javascript
if (inputHandler.isMoving()) {
  // Any movement key is pressed
  const directions = inputHandler.getMovementDirection()  // ['up', 'left']
}
```

---

## 💾 Game State

### Quest Management
```javascript
// Start a quest
gameState.startQuest({
  id: 'quest-1',
  title: 'Find Treasure',
  description: 'Look for treasure...',
  difficulty: 'hard'
})

// Complete quest
gameState.completeQuest('quest-1')

// Get quests
const active = gameState.getActiveQuests()
const completed = gameState.getCompletedQuests()
```

### Inventory Management
```javascript
// Add item
gameState.addItem({ name: 'Sword', quantity: 1 })

// Remove item
gameState.removeItem(itemId)

// Get inventory
const inventory = gameState.getInventory()
```

### Player Stats
```javascript
// Update stats
gameState.updateStats({
  xp: 100,
  level: 2,
  health: 90
})

// Get stats
const stats = gameState.get('playerStats')
```

### Persistence
```javascript
// Save to localStorage
gameState.saveToStorage()

// Load from localStorage
gameState.loadFromStorage()

// Reset everything
gameState.reset()
```

---

## 📍 Map Manager

### Load Tilemap
```javascript
const map = mapManager.loadMap('jungle-map', 'jungle-tileset')
// Requires preloaded JSON and tileset in BootScene
```

### Collision Setup
```javascript
mapManager.setupCollisions(player.sprite)
// Adds collider between player and collision layer
```

### Get Map Info
```javascript
const spawn = mapManager.getSpawnPoint('start')  // { x, y }
const collisionLayer = mapManager.getCollisionLayer()
const allLayers = mapManager.getAllLayers()
```

---

## ⚡ Collision Manager

### Add Collision
```javascript
// Physical collision (blocks movement)
collisionManager.addCollider(player.sprite, wall, (a, b) => {
  console.log('Hit wall!')
})
```

### Add Overlap (Trigger)
```javascript
// Trigger overlap (doesn't block, just detects)
collisionManager.addOverlap(player.sprite, coin, (player, coin) => {
  console.log('Collected coin!')
  coin.destroy()
})
```

### Distance & Detection
```javascript
const distance = collisionManager.getDistance(player.sprite, npc.sprite)

if (collisionManager.isTouching(player.sprite, wall)) {
  console.log('Currently touching wall')
}

const hit = collisionManager.raycast(x1, y1, x2, y2, maxDist)
if (hit.hit) {
  console.log('Raycast hit at distance:', hit.distance)
}
```

---

## 🔌 Event System

### Emit Event (Phaser → React)
```javascript
gameEvents.emit('showDialog', {
  npcName: 'Merchant',
  dialogText: 'Welcome!',
  questId: 'quest-1'
})

gameEvents.emit('showQuest', { title: 'My Quest' })
gameEvents.emit('showResults', { score: 85 })
```

### Listen to Event (React → Phaser)
```javascript
gameEvents.on('playerMove', (data) => {
  console.log('Player moved to', data.x, data.y)
})

gameEvents.on('questCompleted', (questId) => {
  console.log('Quest completed:', questId)
})
```

### One-time Event
```javascript
gameEvents.once('gameReady', (data) => {
  console.log('Game is ready!')
  // Only fires once
})
```

---

## 🎬 Common Patterns

### Player Interaction Loop
```javascript
// In setupInput()
this.inputHandler.onKeyDown('E', () => {
  const playerPos = this.player.getPosition()
  const npc = this.npcSystem.findNearestNPC(playerPos.x, playerPos.y, 100)
  
  if (npc) {
    const data = npc.interact()
    gameState.startQuest(data.questData)
    gameEvents.emit('showDialog', data)
  }
})
```

### Add New NPC
```javascript
// In createSampleNPCs()
this.npcSystem.createNPC(500, 400, 'npc-sprite', {
  id: 'npc-new',
  name: 'New NPC',
  dialogText: 'Hello there!',
  questId: 'quest-new',
  questData: { type: 'coding', difficulty: 'medium' }
})
```

### Camera Zoom to Player
```javascript
this.cameraManager.setZoom(1.5, 500)  // Zoom 1.5x over 500ms
```

### Check Multiple Keys
```javascript
const directions = this.inputHandler.getMovementDirection()
if (directions.includes('up') && directions.includes('left')) {
  console.log('Moving up-left diagonally')
}
```

---

## 📊 Debug Tips

### Show Debug Info
```javascript
// Press ESC in game to show:
console.log('Player:', player.getPosition())
console.log('Quests:', gameState.getActiveQuests())
console.log('Keys:', inputHandler.getPressedKeys())
```

### Log Events
```javascript
gameEvents.on('*', (event, data) => {
  console.log('Event:', event, data)
})
```

### Check Distances
```javascript
const playerPos = player.getPosition()
this.npcSystem.getAllNPCs().forEach(npc => {
  const dist = collisionManager.getDistance(player.sprite, npc.sprite)
  console.log(`${npc.name}: ${dist}px away`)
})
```

---

## ⚠️ Common Mistakes

### ❌ Forget to Check null
```javascript
// Wrong - will crash if no NPC in range
const npc = npcSystem.findNearestNPC(x, y)
npc.interact()  // Error if npc is null

// Right
const npc = npcSystem.findNearestNPC(x, y)
if (npc) {
  npc.interact()
}
```

### ❌ Wrong Import Path
```javascript
// Wrong
import PlayerController from 'PlayerController'

// Right
import { PlayerController } from '../objects/PlayerController'
```

### ❌ Forget to Export
```javascript
// Wrong - not exported
class MyClass { }

// Right
export class MyClass { }
export default MyClass
```

### ❌ Modify State Without Saving
```javascript
// Wrong - not persisted
gameState.state.currentLevel = 5

// Right - auto-saves
gameState.set('currentLevel', 5)
```

---

## 🔗 Related Files

```
src/game/
├── config/GameConfig.js
├── scenes/MainScene.js
├── objects/
│   ├── PlayerController.js
│   ├── NPCSystem.js
│   ├── MapManager.js
│   ├── CameraManager.js
│   └── CollisionManager.js
├── input/InputHandler.js
└── utils/
    ├── EventEmitter.js
    └── GameStateManager.js
```

---

## 🎯 Next Section to Read

- **More Details:** `PHASER-IMPLEMENTATION-GUIDE.md`
- **Integration:** `../../../REACT_INTEGRATION.md`
- **Architecture:** `../../../02-PHASER-LAYER/PHASER_ARCHITECTURE.md`
