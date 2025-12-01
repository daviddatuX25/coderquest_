# 🎮 PHASE 2.1 - GAMESCENE SETUP

**Duration:** 2-3 hours  
**Goal:** Create main Phaser game scene  
**Prerequisites:** Phase 1 complete (environment working)

---

## 🎯 What You're Building

The main game scene container. This is the foundation of everything - where the map loads, player renders, NPCs spawn, and events trigger.

```
Before:  Blank Vite dev server

After:   Phaser game renders
         Canvas appears on screen
         Ready for player/NPCs
```

---

## 📋 Implementation Checklist

### Step 1: Create gameEngine Folder (2 min)

```powershell
# Create game engine folder
mkdir src/gameEngine

# Verify folder created
ls src/gameEngine

# Should be empty (we'll add files next)
```

---

### Step 2: Create GameScene.js (30 min)

Create file: `src/gameEngine/GameScene.js`

This is the most important file. Copy this code:

```javascript
// src/gameEngine/GameScene.js

import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ 
            key: 'GameScene',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false,
                    enableBody: true
                }
            }
        });
        
        // Game state
        this.gameState = {
            currentMap: 'jungle',
            playerPosition: { x: 100, y: 100 },
            npcsInRange: [],
            activeDialog: null
        };
        
        // Get event bus
        this.eventEmitter = window.gameEvents;
    }

    preload() {
        // Load assets
        console.log('Preloading assets...');
        
        // Load player sprite (using placeholder)
        this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABsinCxAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA0ElEQVR4nO3WMQrCMBCG4ZRO4uAkiIODi4uDi6uDi4OLg6uDi4uDi3d7d3d3d3d3d3d3d3d3d1dVxgMCxiHASuQN0BKwA/SkNGAEFqQkYAkWpCRgCRakJGAJFqQkYAkWpCRgCRakJGAJFqQkoAlWJCSgCVYkJKAJViQkoAlWJCSgCVYkJKAJViQkoAlWJCSgCVYkJKAJViQkoAlWPjfvH7n82z2+5y32e/zNvt93mY/z9vs93mb/T5vs5/nbfb7vM1+nrfZz/M2+3neZj/P2+zneZv9PG+zX+dt9vO8zX6et9nP8zb7ed5mP8/b7Od5G3/RShIjLm1KEQAAAAASUVORK5CYII=');
        
        // TODO: Load actual sprites later
        // this.load.image('jungle-map', 'assets/maps/jungle.png');
        // this.load.spritesheet('player', 'assets/player/player.png', ...);
        
        console.log('Assets preloaded');
    }

    create() {
        console.log('Creating GameScene...');
        
        // Create simple background
        this.add.graphics()
            .fillStyle(0x1a1a2e)
            .fillRect(0, 0, 800, 600)
            .setDepth(-1);
        
        // Create player
        this.createPlayer();
        
        // Setup input
        this.setupInputHandling();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup camera
        this.setupCamera();
        
        console.log('GameScene created successfully');
    }

    update(time, delta) {
        // Game loop - called every frame
        if (this.player) {
            this.updatePlayer(delta);
        }
    }

    // ========== PLAYER METHODS ==========
    
    createPlayer() {
        // Create player sprite at center
        this.player = this.add.sprite(400, 300, 'player');
        this.player.setScale(2);
        this.player.setDepth(100);
        
        console.log('Player created at', this.player.x, this.player.y);
    }

    updatePlayer(delta) {
        // Placeholder - will be filled by PlayerController
        // For now, just display player
        if (this.input.keyboard.isDown('W') || this.input.keyboard.isDown('UP')) {
            this.player.y -= 3;
        }
        if (this.input.keyboard.isDown('S') || this.input.keyboard.isDown('DOWN')) {
            this.player.y += 3;
        }
        if (this.input.keyboard.isDown('A') || this.input.keyboard.isDown('LEFT')) {
            this.player.x -= 3;
        }
        if (this.input.keyboard.isDown('D') || this.input.keyboard.isDown('RIGHT')) {
            this.player.x += 3;
        }
        
        // Update game state
        this.gameState.playerPosition = { 
            x: this.player.x, 
            y: this.player.y 
        };
    }

    // ========== INPUT HANDLING ==========
    
    setupInputHandling() {
        // Setup keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });
        
        console.log('Input handling setup');
    }

    // ========== EVENT LISTENERS ==========
    
    setupEventListeners() {
        if (!this.eventEmitter) {
            console.warn('Event emitter not available');
            return;
        }
        
        // Listen for React closing dialogs
        this.eventEmitter.on('dialogClosed', (data) => {
            console.log('Dialog closed event received:', data);
            this.onDialogClosed(data);
        });
        
        // Listen for quest completion
        this.eventEmitter.on('questCompleted', (data) => {
            console.log('Quest completed event received:', data);
            this.onQuestCompleted(data);
        });
        
        console.log('Event listeners setup');
    }

    onDialogClosed(data) {
        console.log('Handling dialog closed...');
        // TODO: Handle NPC quest if available
        this.resumeGame();
    }

    onQuestCompleted(data) {
        console.log('Handling quest completion...');
        console.log('Score:', data.score);
        // TODO: Save progress, show rewards
        this.resumeGame();
    }

    // ========== CAMERA ==========
    
    setupCamera() {
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.setZoom(1);
        
        console.log('Camera setup complete');
    }

    // ========== HELPERS ==========
    
    emitToReact(eventName, data) {
        if (this.eventEmitter) {
            console.log('Emitting to React:', eventName, data);
            this.eventEmitter.emit(eventName, data);
        }
    }

    pauseGame() {
        this.scene.pause();
        this.physics.pause();
        console.log('Game paused');
    }

    resumeGame() {
        this.scene.resume();
        this.physics.resume();
        console.log('Game resumed');
    }
}
```

**Save this file.**

---

### Step 3: Create Phaser Config File (10 min)

Create file: `src/gameEngine/CONFIG.js`

```javascript
// src/gameEngine/CONFIG.js

import GameScene from './GameScene';

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
        pixelArt: false,
        antialias: true,
        roundPixels: true
    },
    scale: {
        autoCenter: 'CENTER_BOTH',
        mode: 'RESIZE'
    }
};
```

**Save this file.**

---

### Step 4: Create index.jsx - React Entry Point (15 min)

Create file: `src/index.jsx`

```javascript
// src/index.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';

// Initialize event bus before anything else
if (!window.gameEvents) {
    const eventMap = {};
    
    window.gameEvents = {
        on: (eventName, callback) => {
            if (!eventMap[eventName]) eventMap[eventName] = [];
            eventMap[eventName].push(callback);
            return () => {
                eventMap[eventName] = eventMap[eventName].filter(cb => cb !== callback);
            };
        },
        off: (eventName, callback) => {
            if (eventMap[eventName]) {
                eventMap[eventName] = eventMap[eventName].filter(cb => cb !== callback);
            }
        },
        emit: (eventName, data) => {
            if (eventMap[eventName]) {
                eventMap[eventName].forEach(cb => cb(data));
            }
        },
        once: (eventName, callback) => {
            const wrapper = (data) => {
                callback(data);
                window.gameEvents.off(eventName, wrapper);
            };
            window.gameEvents.on(eventName, wrapper);
        },
        clear: () => {
            Object.keys(eventMap).forEach(key => delete eventMap[key]);
        }
    };
}

// Render React app
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
```

**Save this file.**

---

### Step 5: Create App.jsx - React Root (20 min)

Create file: `src/App.jsx`

```javascript
// src/App.jsx

import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from './gameEngine/GameScene';
import GameUI from './GameUI';
import './styles/index.scss';

function App() {
    useEffect(() => {
        // Phaser game instance
        let game = null;

        // Create Phaser game
        const gameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'phaser-container',
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
                pixelArt: false,
                antialias: true
            }
        };

        game = new Phaser.Game(gameConfig);

        console.log('Phaser game initialized');

        // Cleanup on unmount
        return () => {
            if (game) {
                game.destroy(true);
                console.log('Game destroyed');
            }
        };
    }, []);

    return (
        <div className="app-container">
            <div id="phaser-container" />
            <GameUI />
        </div>
    );
}

export default App;
```

**Save this file.**

---

### Step 6: Test It! (30 min)

```powershell
# Make sure dev server is running
npm run dev

# Open browser to:
# http://localhost:5173/

# You should see:
# - A dark canvas/game area
# - A small player sprite in center
```

**Test controls:**
- Press WASD or arrow keys
- Player should move
- No errors in console

**Expected output in console:**
```
Preloading assets...
Assets preloaded
Creating GameScene...
Player created at 400 300
Input handling setup
Event listeners setup
Camera setup complete
GameScene created successfully
```

---

## 🚨 Troubleshooting

### ❌ Blank page, nothing renders
**Solution:**
- Open console (F12)
- Check for errors
- Make sure `App.jsx` and `index.jsx` exist
- Make sure `index.html` points to `/src/index.jsx`

### ❌ "Phaser is not defined"
**Solution:**
- Make sure Phaser is imported: `import Phaser from 'phaser'`
- Run: `npm install phaser`

### ❌ Player doesn't move
**Solution:**
- Check console for errors
- Make sure input handling is setup
- Verify WASD keys are working

### ❌ Black/dark screen but nothing shows
**Solution:**
- This is OK! The game renders but player sprite is placeholder
- Check console for any errors
- Move to Phase 2.2

---

## ✨ What You've Accomplished

- ✅ Created GameScene.js (main game container)
- ✅ Created Phaser config
- ✅ Created React entry point (index.jsx)
- ✅ Created React root component (App.jsx)
- ✅ Game renders in browser
- ✅ Player sprite displays
- ✅ Basic movement works
- ✅ Event system initialized

---

## 📍 Next Step

When you see the game render and controls work:

**Go to:** `PHASE-2-CORE-ENGINE/02-PLAYER-CONTROLLER.md`

---

## ⏱️ Time Check

- Total time for this step: 2-3 hours
- Most time is debugging/understanding code
- Once working, move to next step

---

## 📝 Notes

- The player sprite is currently a placeholder
- We'll improve it in Phase 3
- For now, focus on making sure game renders
- Controls should work with WASD or arrows

---

## ✅ Done?

When you can see game render and move player with WASD:

**[✓] PHASE 2.1 Complete**

**Next:** `PHASE-2-CORE-ENGINE/02-PLAYER-CONTROLLER.md`

