# 🔌 Event System Architecture

**Purpose:** Central communication between Phaser and React  
**Pattern:** Observer/Pub-Sub  
**Status:** Already implemented as `useGameEvents.js`

---

## 📋 Overview

The event system is a simple event bus that allows Phaser and React to communicate without direct dependencies.

```
Phaser                    Event Bus                    React
(GameScene)           (window.gameEvents)         (GameUI Components)
    │                                                   │
    ├─ emit('showDialog', data) ──────────────────────►│
    │                                                   │
    │◄────────────── emit('dialogClosed') ────────────┤
    │                                                   │
    ├─ emit('showQuest', data) ────────────────────────►│
    │                                                   │
    │◄────────────── emit('questCompleted', score) ────┤
    │                                                   │
```

---

## 🏗️ Event Bus Structure

**File:** `src/hooks/useGameEvents.js`

**Implementation:**
```javascript
// Central event storage
const eventMap = {
    'showDialog': [callback1, callback2, ...],
    'dialogClosed': [callback1, ...],
    'showQuest': [callback1, ...],
    'questCompleted': [callback1, ...]
};

// Methods
window.gameEvents = {
    on(eventName, callback),      // Subscribe to event
    off(eventName, callback),     // Unsubscribe
    once(eventName, callback),    // Listen once
    emit(eventName, data),        // Send event
    clear()                       // Clear all events
};
```

---

## 📋 All Available Events

### Phaser → React Events

| Event | Sent By | Data | Purpose |
|-------|---------|------|---------|
| `showDialog` | GameScene | { id, name, dialog, sprite, quests } | Open NPC dialog |
| `showQuest` | GameScene | { id, title, description, lesson, quiz } | Open quest popup |
| `closePopup` | GameScene | { } | Force close any popup |
| `mapChanged` | GameScene | { mapName } | Map transitioned |
| `npcInRange` | GameScene | { npcId, npcName, canInteract } | NPC nearby |
| `npcOutOfRange` | GameScene | { npcId } | NPC no longer nearby |

### React → Phaser Events

| Event | Sent By | Data | Purpose |
|-------|---------|------|---------|
| `dialogClosed` | GameUI | { npcId, timestamp } | User finished dialog |
| `questClosed` | GameUI | { questId, timestamp } | User exited quest |
| `questCompleted` | GameUI | { questId, score, results, timestamp } | Quiz done |

---

## 🔄 Event Flows

### Flow 1: NPC Interaction

```
1. PHASER: Player enters NPC interaction radius
   └─→ Phaser: emit('npcInRange', { npcId: 1, npcName: 'Mage' })

2. REACT: GameUI listens
   └─→ React: Show "Press E" indicator (visual feedback)

3. PHASER: Player presses E key
   └─→ Phaser: Pause game
   └─→ Phaser: emit('showDialog', { id: 1, name: 'Mage', dialog: '...' })

4. REACT: GameUI listens
   └─→ React: setDialogOpen(true)
   └─→ React: DialogBox renders

5. REACT: User reads and clicks "Continue"
   └─→ React: DialogBox calls onClose()
   └─→ React: GameUI emits 'dialogClosed'

6. PHASER: GameScene listens
   └─→ Phaser: Resume game
   └─→ Phaser: Check if NPC has quest
   └─→ Phaser: emit('showQuest', questData)

7. REACT: GameUI listens
   └─→ React: setQuestOpen(true)
   └─→ React: QuestPopup renders
```

### Flow 2: Quiz Completion

```
1. REACT: User completes quiz
   └─→ React: Quiz calculates score (85%)
   └─→ React: Quiz calls onComplete(85, results)

2. REACT: GameUI receives completion
   └─→ React: handleQuestComplete(score, results)
   └─→ React: emit('questCompleted', { questId: 1, score: 85, results: {...} })

3. PHASER: GameScene listens
   └─→ Phaser: Receive score and results
   └─→ Phaser: Save to database
   └─→ Phaser: Update player progress
   └─→ Phaser: Resume game
   └─→ Phaser: emit('closePopup')

4. REACT: GameUI listens to closePopup
   └─→ React: setQuestOpen(false)
   └─→ React: Modal closes
```

---

## 🎯 How to Use

### From Phaser (Emit to React)

```javascript
// In GameScene.js
class GameScene extends Phaser.Scene {
    emitToReact(eventName, data) {
        window.gameEvents.emit(eventName, data);
    }

    showDialogToReact() {
        const npcData = {
            id: 1,
            name: 'Mage',
            dialog: 'Welcome!',
            sprite: 'mage',
            quests: [1, 2]
        };
        
        this.emitToReact('showDialog', npcData);
    }
}
```

### From React (Listen from Phaser)

```javascript
// In GameUI.jsx
import { useGameEventListener, useGameEventEmitter } from '../hooks/useGameEvents';

function GameUI() {
    const { emit } = useGameEventEmitter();

    // LISTEN: Phaser sends showDialog
    useGameEventListener('showDialog', (data) => {
        console.log('Dialog from Phaser:', data);
        setDialogData(data);
        setDialogOpen(true);
    });

    // EMIT: Send dialogClosed to Phaser
    const handleClose = () => {
        emit('dialogClosed', { npcId: data.id });
    };

    return <DialogBox onClose={handleClose} />;
}
```

### From React (Listen from Phaser)

```javascript
// In any React component using custom setup
const unsubscribe = window.gameEvents.on('showQuest', (data) => {
    console.log('Quest data:', data);
    // Do something
});

// Later: Unsubscribe
unsubscribe(); // or window.gameEvents.off('showQuest', callback)
```

### From Phaser (Listen from React)

```javascript
// In GameScene.js or any Phaser code
this.setupEventListeners = function() {
    window.gameEvents.on('questCompleted', (data) => {
        console.log('Quiz score:', data.score);
        this.saveProgressToDB(data);
    });
};
```

---

## 🏗️ Hook Implementation

**File:** `src/hooks/useGameEvents.js` (Already exists)

```javascript
import { useEffect, useCallback } from 'react';

// Main hook: Create/access event bus
export const useGameEvents = () => {
  const getEventEmitter = useCallback(() => {
    if (!window.gameEvents) {
      const eventMap = {};

      window.gameEvents = {
        on: (eventName, callback) => {
          if (!eventMap[eventName]) {
            eventMap[eventName] = [];
          }
          eventMap[eventName].push(callback);
          
          // Return unsubscribe function
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

    return window.gameEvents;
  }, []);

  return getEventEmitter();
};

// Hook: Listen to Phaser events
export const useGameEventListener = (eventName, callback, dependencies = []) => {
  const gameEvents = useGameEvents();

  useEffect(() => {
    const unsubscribe = gameEvents.on(eventName, callback);
    return unsubscribe;
  }, [eventName, callback, gameEvents, ...dependencies]);
};

// Hook: Emit to Phaser
export const useGameEventEmitter = () => {
  const gameEvents = useGameEvents();

  const emit = useCallback((eventName, data) => {
    gameEvents.emit(eventName, data);
  }, [gameEvents]);

  return { emit };
};
```

---

## ✨ Key Features

### Simple
- No external dependencies
- Just JavaScript objects and functions
- Easy to understand and debug

### Flexible
- Works with Phaser and React
- Can emit to multiple listeners
- Can unsubscribe anytime

### Reactive
- React hooks for easy integration
- Automatic cleanup with dependencies
- Hooks return unsub functions

### Testable
- Can mock events in tests
- Can clear all events
- Can listen once (then auto-unsubscribe)

---

## 🔍 Debugging Events

### View all registered events

```javascript
// In browser console
console.log(window.gameEvents);
```

### Listen to all events

```javascript
// Temporary: See all events
const allEvents = ['showDialog', 'dialogClosed', 'showQuest', 'questCompleted'];
allEvents.forEach(event => {
    window.gameEvents.on(event, (data) => {
        console.log(`EVENT: ${event}`, data);
    });
});
```

### Clear all listeners

```javascript
// Start fresh (for testing)
window.gameEvents.clear();
```

---

## 📊 Event Queue (Future Enhancement)

Currently events are synchronous. For future:

```javascript
// Could add event queue for async processing
class EventQueue {
    queue = [];
    processing = false;

    async emit(eventName, data) {
        this.queue.push({ eventName, data });
        if (!this.processing) {
            await this.processQueue();
        }
    }

    async processQueue() {
        this.processing = true;
        while (this.queue.length > 0) {
            const { eventName, data } = this.queue.shift();
            // Process event
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        this.processing = false;
    }
}
```

---

## 🚀 Best Practices

1. **Name clearly:** `showDialog`, not `d` or `event1`
2. **Include relevant data:** Emit enough info so receiver doesn't need to query
3. **Unsubscribe on cleanup:** Use return unsubscribe function
4. **One listener per responsibility:** Don't handle everything in one callback
5. **Emit from top-level component:** Keeps event flow clear
6. **Document events:** List all events somewhere (this file!)

---

## 📝 Event Reference

**To add a new event:**

1. Choose name: `actionObjectResult` format (e.g., `questCompleted`)
2. Decide direction: Phaser→React or React→Phaser?
3. Define data shape: What information needed?
4. Add listener in appropriate component
5. Add emitter in appropriate layer
6. Document here

---

## 🔗 Related Files

- **Hook Implementation:** `src/hooks/useGameEvents.js`
- **Main Processor:** `src/GameUI.jsx`
- **Game Scene:** `src/gameEngine/GameScene.js` (TO DO)

