ARCHITECTURE/README.md# 🎮 Phaser Game Engine Architecture

**Layer:** Phaser 3 Game Engine  
**Purpose:** Handle all game logic, rendering, and player interaction  
**Status:** Ready for implementation

---

## 📋 Overview

The Phaser layer consists of 6 core systems that work together:

```
GameScene (Main Container)
├── PlayerController (Player movement & input)
├── NPCSystem (NPC behavior & proximity detection)
├── MapManager (Map loading & level transitions)
├── CameraManager (Camera follow & viewport)
├── CollisionManager (Physics & collisions)
└── GameStateManager (Game data & persistence)
        ↓
    EVENT BUS
        ↓
    REACT UI LAYER
```

---

## 🏗️ File Structure

```
src/gameEngine/
├── GameScene.js              # Main scene (Phaser.Scene extends)
├── NPCSystem.js              # NPC class & behavior
├── PlayerController.js       # Player sprite & movement
├── MapManager.js             # Map loading & data
├── CameraManager.js          # Camera behavior
├── CollisionManager.js       # Physics setup
└── CONFIG.js                 # Game configuration constants
```

---

## 1️⃣ GameScene.js - Main Game Scene

**Purpose:** Container for all game objects, orchestrates all systems

**Responsibilities:**
- Initialize Phaser scene
- Create player, NPCs, map
- Setup input handling
- Manage game loop
- Emit events to React

**Key Methods:**
```javascript
class GameScene extends Phaser.Scene {
    constructor()                    // Setup scene name
    preload()                       // Load assets
    create()                        // Initialize objects
    update(time, delta)             // Game loop
    
    // Event handlers
    handlePlayerInput()             // WASD/Arrows input
    handleNPCInteraction()          // E key near NPC
    handleMapTransition()           // Player exits map
    
    // Helpers
    checkNPCProximity()             // Distance to NPCs
    findNPCInRange()                // Get closest NPC
    emitToReact(eventName, data)    // Send event to React
    receiveFromReact(eventName)     // Listen from React
}
```

**Code Template:**
```javascript
// src/gameEngine/GameScene.js

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load map tilemap
        // Load player sprite
        // Load NPC sprites
        // Load UI assets
    }

    create() {
        this.createMap();
        this.createPlayer();
        this.createNPCs();
        this.setupInputHandling();
        this.setupColliders();
        this.setupEventListeners();
    }

    update(time, delta) {
        this.playerController.update(delta);
        this.checkNPCProximity();
        this.handleMapTransitions();
    }

    createMap() {
        // Load map data (jungle, town, city)
        // Add tilemap to scene
        // Store map metadata
    }

    createPlayer() {
        // Create player sprite at starting position
        // Setup physics body
        // Setup animations
    }

    createNPCs() {
        // Loop through NPC data array
        // Create NPCSystem instance for each
        // Add to collider group
    }

    setupInputHandling() {
        // WASD / Arrow keys for movement
        // E key for NPC interaction
        // Escape key to close dialogs
    }

    setupEventListeners() {
        // Listen: dialogClosed
        // Listen: questClosed
        // Listen: questCompleted
        // Listen: closePopup
    }

    checkNPCProximity() {
        // For each NPC:
        //   - Calculate distance to player
        //   - If < interactionRadius: emit npcInRange
        //   - If > interactionRadius: emit npcOutOfRange
    }

    handleNPCInteraction(npc) {
        // Pause game
        // Emit showDialog event to React
        // Store active NPC reference
    }

    handleMapTransitions() {
        // Check if player at map boundary
        // If yes: transition to new map
        // Emit mapChanged event
    }

    emitToReact(eventName, data) {
        window.gameEvents.emit(eventName, data);
    }

    receiveFromReact(eventName, callback) {
        window.gameEvents.on(eventName, callback);
    }
}
```

---

## 2️⃣ PlayerController.js - Player Movement

**Purpose:** Handle player sprite and movement logic

**Responsibilities:**
- Create player sprite
- Handle input (WASD + Arrows)
- Animate player based on direction
- Track player position
- Apply physics

**Key Properties:**
```javascript
class PlayerController {
    sprite              // Phaser sprite object
    velocity            // { x, y } movement speed
    direction           // 'up', 'down', 'left', 'right'
    isMoving            // Boolean
    
    update(delta)       // Called every frame
    moveLeft()          // Set velocity left
    moveRight()         // Set velocity right
    moveUp()            // Set velocity up
    moveDown()          // Set velocity down
    stop()              // Set velocity to 0
    playAnimation()     // Play walk/idle animation
}
```

**Code Template:**
```javascript
// src/gameEngine/PlayerController.js

class PlayerController {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Create sprite
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        this.sprite.setScale(2);
        this.sprite.setBounce(0.2);
        this.sprite.setCollideWorldBounds(true);
        
        // Properties
        this.speed = 160;
        this.direction = 'down';
        this.isMoving = false;
        
        // Setup animations
        this.createAnimations();
    }

    createAnimations() {
        // Create walk_up, walk_down, walk_left, walk_right
        // Create idle animation
    }

    update(delta) {
        // Called from GameScene.update()
        // Check input and move accordingly
    }

    handleInput(cursors) {
        if (cursors.left.isDown) {
            this.moveLeft();
        } else if (cursors.right.isDown) {
            this.moveRight();
        } else if (cursors.up.isDown) {
            this.moveUp();
        } else if (cursors.down.isDown) {
            this.moveDown();
        } else {
            this.stop();
        }
    }

    moveLeft() {
        this.sprite.setVelocityX(-this.speed);
        this.direction = 'left';
        this.sprite.play('walk_left', true);
        this.isMoving = true;
    }

    moveRight() {
        this.sprite.setVelocityX(this.speed);
        this.direction = 'right';
        this.sprite.play('walk_right', true);
        this.isMoving = true;
    }

    moveUp() {
        this.sprite.setVelocityY(-this.speed);
        this.direction = 'up';
        this.sprite.play('walk_up', true);
        this.isMoving = true;
    }

    moveDown() {
        this.sprite.setVelocityY(this.speed);
        this.direction = 'down';
        this.sprite.play('walk_down', true);
        this.isMoving = true;
    }

    stop() {
        this.sprite.setVelocity(0, 0);
        this.sprite.play('idle');
        this.isMoving = false;
    }

    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }
}

export default PlayerController;
```

---

## 3️⃣ NPCSystem.js - NPC Behavior

**Purpose:** Represent individual NPCs with interaction

**Responsibilities:**
- Create NPC sprite
- Store NPC metadata (name, dialog, quest)
- Detect player proximity
- Emit interaction events
- Highlight when in range

**Key Properties:**
```javascript
class NPCSystem extends Phaser.Physics.Arcade.Sprite {
    npcId               // Unique NPC ID
    npcName             // NPC display name
    dialog              // Initial dialog text
    questData           // Array of quests
    interactionRadius   // Distance for interaction
    isHighlighted       // Is player in range?
    
    checkProximity(playerX, playerY)  // Distance calculation
    highlight()         // Visual feedback (in range)
    dehighlight()       // Remove visual feedback
}
```

**Code Template:**
```javascript
// src/gameEngine/NPCSystem.js

class NPCSystem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, npcData) {
        super(scene, x, y, npcData.sprite);
        
        // Store NPC data
        this.npcId = npcData.id;
        this.npcName = npcData.name;
        this.dialog = npcData.dialog;
        this.questData = npcData.quests; // Array of quest IDs
        this.spriteKey = npcData.sprite;
        
        // Interaction
        this.interactionRadius = 80;
        this.isHighlighted = false;
        this.highlightGraphics = null;
        
        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);
    }

    checkProximity(playerX, playerY) {
        const distance = Phaser.Math.Distance.Between(
            playerX, playerY,
            this.x, this.y
        );
        return distance < this.interactionRadius;
    }

    highlight() {
        if (!this.isHighlighted) {
            this.isHighlighted = true;
            // Draw highlight circle or tint sprite
            this.setTint(0xffff00); // Yellow tint
        }
    }

    dehighlight() {
        if (this.isHighlighted) {
            this.isHighlighted = false;
            this.clearTint();
        }
    }

    getData() {
        return {
            id: this.npcId,
            name: this.npcName,
            dialog: this.dialog,
            sprite: this.spriteKey,
            quests: this.questData
        };
    }
}

export default NPCSystem;
```

---

## 4️⃣ MapManager.js - Map Loading & Transitions

**Purpose:** Handle map/level management

**Responsibilities:**
- Load map data (jungle, town, city)
- Store map metadata
- Handle level transitions
- Track current map state

**Key Methods:**
```javascript
class MapManager {
    currentMap          // Current map name
    mapData             // Map metadata
    
    loadMap(mapName)    // Load new map
    getMapData()        // Get current map info
    transition(newMap)  // Fade & switch
    getNPCsForMap()     // Get NPCs in current map
}
```

**Code Template:**
```javascript
// src/gameEngine/MapManager.js

const MAPS = {
    jungle: {
        id: 'jungle',
        name: 'Jungle Temple',
        tilemap: 'jungle-map',
        tileset: 'jungle-tileset',
        width: 800,
        height: 600,
        npcSpawns: [
            { npcId: 1, x: 100, y: 200 },  // Mage
            { npcId: 3, x: 300, y: 150 },  // Archer
        ],
        exits: {
            north: 'town',
            east: 'city'
        }
    },
    town: {
        id: 'town',
        name: 'Town Center',
        tilemap: 'town-map',
        tileset: 'town-tileset',
        width: 1000,
        height: 800,
        npcSpawns: [
            { npcId: 2, x: 150, y: 250 },  // Healer
            { npcId: 5, x: 400, y: 300 },  // Merchant
        ],
        exits: {
            south: 'jungle',
            east: 'city'
        }
    },
    city: {
        id: 'city',
        name: 'City Skyline',
        tilemap: 'city-map',
        tileset: 'city-tileset',
        width: 1200,
        height: 900,
        npcSpawns: [
            { npcId: 6, x: 200, y: 300 },  // Engineer
            { npcId: 8, x: 600, y: 400 },  // Artist
        ],
        exits: {
            west: 'jungle',
            west: 'town'
        }
    }
};

class MapManager {
    constructor(scene) {
        this.scene = scene;
        this.currentMap = null;
        this.mapData = MAPS;
    }

    loadMap(mapName) {
        const mapData = this.mapData[mapName];
        
        if (!mapData) {
            console.error(`Map ${mapName} not found`);
            return;
        }

        this.currentMap = mapName;
        
        // In actual Phaser scene:
        // - Load tilemap data
        // - Create tilemap
        // - Add tileset
        // - Create layers
        
        return mapData;
    }

    getCurrentMapData() {
        return this.mapData[this.currentMap];
    }

    getNPCSpawns() {
        const mapData = this.getCurrentMapData();
        return mapData.npcSpawns;
    }

    getExits() {
        const mapData = this.getCurrentMapData();
        return mapData.exits;
    }

    getMapBounds() {
        const mapData = this.getCurrentMapData();
        return {
            width: mapData.width,
            height: mapData.height
        };
    }
}

export default MapManager;
```

---

## 5️⃣ CameraManager.js - Camera Control

**Purpose:** Handle camera behavior

**Responsibilities:**
- Follow player
- Set camera bounds
- Handle smooth transitions
- Zoom on events

**Key Methods:**
```javascript
class CameraManager {
    camera              // Phaser camera
    
    followPlayer(player)        // Start following
    setBounds(width, height)    // Set world bounds
    smoothTransition(duration)  // Fade effect
}
```

**Code Template:**
```javascript
// src/gameEngine/CameraManager.js

class CameraManager {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;
    }

    followPlayer(player) {
        this.camera.startFollow(player);
        this.camera.setBounds(0, 0, 800, 600); // Default bounds
    }

    setBounds(width, height) {
        this.camera.setBounds(0, 0, width, height);
    }

    smoothTransition(duration = 500) {
        this.camera.fadeOut(duration, 0, 0, 0);
    }

    smoothFadeIn(duration = 500) {
        this.camera.fadeIn(duration);
    }
}

export default CameraManager;
```

---

## 6️⃣ CollisionManager.js - Physics & Collisions

**Purpose:** Setup collision detection

**Responsibilities:**
- Setup physics bodies
- Create collider groups
- Handle collision callbacks
- Manage world bounds

**Code Template:**
```javascript
// src/gameEngine/CollisionManager.js

class CollisionManager {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
    }

    setupPlayerCollisions(player, obstacles) {
        // Player collides with obstacles
        this.physics.add.collider(player, obstacles);
    }

    setupNPCCollisions(npcs) {
        // NPCs are immovable
        // No collision needed, just proximity detection
    }

    setupWorldBounds(player, width, height) {
        player.setCollideWorldBounds(true);
        player.setBounce(0.2);
    }
}

export default CollisionManager;
```

---

## 🎯 EVENT FLOW (Phaser Side)

### Event 1: Player Encounters NPC

```
Input (Player presses E)
    ↓
PlayerController emits keydown-E
    ↓
GameScene checks if NPC in range
    ↓
NPCSystem.checkProximity() = true
    ↓
GameScene emits 'showDialog' to React
    ↓
→ REACT receives event (GameUI.jsx listens)
```

### Event 2: Dialog Closes

```
React (User clicks Continue)
    ↓
DialogBox.jsx calls onClose()
    ↓
GameUI emits 'dialogClosed'
    ↓
→ PHASER receives event (GameScene listens)
    ↓
GameScene emits 'showQuest' to React
    ↓
→ REACT receives event (QuestPopup opens)
```

### Event 3: Quest Completes

```
React (User completes quiz)
    ↓
Quiz.jsx calls onComplete(score, results)
    ↓
GameUI emits 'questCompleted'
    ↓
→ PHASER receives event (GameScene listens)
    ↓
GameScene saves progress
    ↓
GameScene resumes game
    ↓
Player can continue exploring
```

---

## 📊 Phaser Configuration

**CONFIG.js:**
```javascript
// src/gameEngine/CONFIG.js

export const GAME_CONFIG = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            enableBody: true
        }
    },
    scene: GameScene,
    render: {
        pixelArt: true,
        antialias: false
    }
};
```

---

## ✨ Key Points

1. **Single Responsibility:** Each class handles ONE thing
2. **Event-Driven:** Emit events, don't directly call React
3. **Data-Driven:** Use MAP_DATA and NPC_DATA for configuration
4. **Clean Architecture:** Phaser doesn't know about React internals
5. **Testable:** Each system can be tested independently

---

## 📝 Next Steps

1. **Create `GameScene.js`** - Main container
2. **Create `PlayerController.js`** - Player movement
3. **Create `NPCSystem.js`** - NPC behavior
4. **Connect to event bus** - Emit/receive React events
5. **Test in browser** - See game + modals together

