# CoderQuest - Complete System Submission

**Date:** November 28, 2025  
**Project Status:** Ready for Submission (Phaser with Pseudocode)

---

## Table of Contents

1. [Database Schema (SQL)](#database-schema-sql)
2. [Phaser Game Engine Layer (Pseudocode)](#phaser-game-engine-layer-pseudocode)
3. [React Event Processors (Logic)](#react-event-processors-logic)
4. [React Components Hierarchy](#react-components-hierarchy)
5. [SCSS Styling](#scss-styling)

---

## Database Schema (SQL)

### Architecture: Normalized 3NF (Third Normal Form)

```sql
-- ============================================
-- 1. USERS TABLE (Entity)
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 2. LESSONS TABLE (Entity)
-- ============================================
CREATE TABLE lessons (
    lesson_id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_title VARCHAR(200) NOT NULL,
    lesson_description TEXT,
    topic_category VARCHAR(100) NOT NULL,
    content_json LONGTEXT,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 3. QUESTS TABLE (Entity)
-- ============================================
CREATE TABLE quests (
    quest_id INT PRIMARY KEY AUTO_INCREMENT,
    quest_title VARCHAR(200) NOT NULL,
    quest_description TEXT,
    lesson_id INT NOT NULL,
    reward_points INT DEFAULT 100,
    difficulty_level ENUM('easy', 'medium', 'hard'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);

-- ============================================
-- 4. QUIZZES TABLE (Entity)
-- ============================================
CREATE TABLE quizzes (
    quiz_id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_title VARCHAR(200) NOT NULL,
    quest_id INT NOT NULL,
    passing_score INT DEFAULT 70,
    total_questions INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id) ON DELETE CASCADE
);

-- ============================================
-- 5. QUIZ_QUESTIONS TABLE (Entity)
-- ============================================
CREATE TABLE quiz_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_type ENUM('multipleChoice', 'fillInBlanks') NOT NULL,
    question_text TEXT NOT NULL,
    explanation TEXT,
    question_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- ============================================
-- 6. QUESTION_OPTIONS TABLE (Weak Entity)
-- ============================================
CREATE TABLE question_options (
    option_id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    option_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(question_id) ON DELETE CASCADE
);

-- ============================================
-- 7. QUESTION_ANSWERS TABLE (Weak Entity)
-- ============================================
CREATE TABLE question_answers (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    correct_answer VARCHAR(500) NOT NULL,
    answer_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(question_id) ON DELETE CASCADE
);

-- ============================================
-- 8. USER_PROGRESS TABLE (Junction/Tracking)
-- ============================================
CREATE TABLE user_progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    lesson_id INT,
    quest_id INT,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    completion_percentage INT DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE SET NULL,
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    UNIQUE KEY unique_user_quest (user_id, quest_id)
);

-- ============================================
-- 9. QUIZ_RESULTS TABLE (Transaction)
-- ============================================
CREATE TABLE quiz_results (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage INT GENERATED ALWAYS AS (ROUND((score / total_questions) * 100)) STORED,
    passed BOOLEAN GENERATED ALWAYS AS (percentage >= 70) STORED,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- ============================================
-- 10. USER_ANSWERS TABLE (Audit/Detail)
-- ============================================
CREATE TABLE user_answers (
    user_answer_id INT PRIMARY KEY AUTO_INCREMENT,
    result_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer VARCHAR(500),
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (result_id) REFERENCES quiz_results(result_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(question_id) ON DELETE CASCADE
);

-- ============================================
-- 11. NPC_CHARACTERS TABLE (Game Entity)
-- ============================================
CREATE TABLE npc_characters (
    npc_id INT PRIMARY KEY AUTO_INCREMENT,
    npc_name VARCHAR(100) NOT NULL,
    character_sprite VARCHAR(255),
    initial_dialog TEXT NOT NULL,
    quest_id INT,
    map_location VARCHAR(100),
    interaction_radius INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id) ON DELETE SET NULL
);

-- ============================================
-- 12. USER_ACHIEVEMENTS TABLE (Gamification)
-- ============================================
CREATE TABLE user_achievements (
    achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_name VARCHAR(200) NOT NULL,
    achievement_description TEXT,
    icon_path VARCHAR(255),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_name)
);
```

### ER Diagram (Relationships)

```
┌─────────────┐
│    USERS    │
└──────┬──────┘
       │
       ├─→ USER_PROGRESS ─→ LESSONS
       ├─→ USER_PROGRESS ─→ QUESTS ─→ QUIZZES ─→ QUIZ_QUESTIONS ─→ QUESTION_OPTIONS
       ├─→ QUIZ_RESULTS ─→ QUIZZES
       ├─→ USER_ANSWERS ─→ QUIZ_RESULTS
       └─→ USER_ACHIEVEMENTS
```

---

## Phaser Game Engine Layer (Pseudocode)

### Layer 1: Game Scene Initialization

```javascript
/**
 * PHASER PSEUDOCODE: Game Scene Setup
 * Location: Phaser/PhaserGameScene.js (to be implemented)
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.gameState = {
            currentMap: 'jungle',
            playerPosition: { x: 100, y: 100 },
            npcsInRange: [],
            activeDialog: null,
            questsActive: []
        };
        
        // Event system to communicate with React
        this.eventEmitter = window.gameEvents;
    }
    
    preload() {
        // LOAD ASSETS
        this.load.image('jungle-map', 'assets/maps/jungle.png');
        this.load.spritesheet('player', 'assets/player/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('npc1', 'assets/characters/npc1.png');
        // ... load all NPCs and maps
    }
    
    create() {
        // INITIALIZE SCENE
        this.createMap('jungle');
        this.createPlayer();
        this.createNPCs();
        this.setupColliders();
        this.setupInputHandling();
    }
    
    update(time, delta) {
        // GAME LOOP
        this.updatePlayer(delta);
        this.checkNPCProximity();
        this.handleCameraTracking();
    }
}
```

### Layer 2: NPC Meeting & Dialog Emission

```javascript
/**
 * PHASER PSEUDOCODE: NPC Interaction System
 * EVENT FLOW: Player → NPC Proximity Check → Dialog Event Emission → React
 */

class NPCSystem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, npcData) {
        super(scene, x, y, npcData.sprite);
        this.npcId = npcData.id;
        this.npcName = npcData.name;
        this.dialog = npcData.dialog;
        this.questId = npcData.questId;
        this.questData = npcData.questData;
        this.interactionRadius = 80;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}

// ============================================
// EVENT CHAIN 1: NPC Proximity Detection
// ============================================
scene.checkNPCProximity = function() {
    this.npcs.forEach(npc => {
        const distance = Phaser.Math.Distance.Between(
            this.player.x, 
            this.player.y, 
            npc.x, 
            npc.y
        );
        
        if (distance < npc.interactionRadius) {
            // PSEUDOCODE: Player is in range
            if (!npc.isHighlighted) {
                npc.isHighlighted = true;
                // VISUAL: Show "Press E to interact" indicator
                this.showInteractionPrompt(npc);
                
                // EMIT: Player entered NPC interaction zone
                this.eventEmitter.emit('npcInRange', {
                    npcId: npc.npcId,
                    npcName: npc.npcName,
                    canInteract: true
                });
            }
        } else {
            if (npc.isHighlighted) {
                npc.isHighlighted = false;
                this.hideInteractionPrompt(npc);
                
                // EMIT: Player left NPC interaction zone
                this.eventEmitter.emit('npcOutOfRange', {
                    npcId: npc.npcId
                });
            }
        }
    });
};

// ============================================
// EVENT CHAIN 2: Player Interaction (E Key Press)
// ============================================
scene.setupInputHandling = function() {
    this.input.keyboard.on('keydown-E', () => {
        // Find NPC in interaction zone
        const targetNPC = this.npcs.find(npc => npc.isHighlighted);
        
        if (targetNPC) {
            this.handleNPCInteraction(targetNPC);
        }
    });
};

// ============================================
// EVENT CHAIN 3: Show Dialog Event
// ============================================
scene.handleNPCInteraction = function(npc) {
    // PSEUDOCODE: NPC interaction triggered
    
    // 1. Pause game
    this.physics.pause();
    this.pause();
    
    // 2. Create dialog data package
    const dialogData = {
        id: npc.npcId,
        name: npc.npcName,
        dialog: npc.dialog,
        sprite: npc.spriteKey,
        availableQuests: npc.questData // array of quests
    };
    
    // 3. EMIT to React: Show dialog overlay
    this.eventEmitter.emit('showDialog', dialogData);
    
    // 4. Save NPC reference for later
    this.activeNPC = npc;
    this.activeDialogData = dialogData;
};

// ============================================
// EVENT CHAIN 4: Dialog Closed, Show Quest
// ============================================
// This listener is set in React's GameUI component
// When user clicks "Continue" on dialog, React emits back:
scene.setupEventListeners = function() {
    this.eventEmitter.on('dialogClosed', (data) => {
        // PSEUDOCODE: Dialog closed in React
        
        // Check if NPC has a quest
        if (this.activeNPC.questData && this.activeNPC.questData.length > 0) {
            const questData = this.activeNPC.questData[0];
            
            // EMIT to React: Show quest popup
            this.eventEmitter.emit('showQuest', {
                id: questData.id,
                title: questData.title,
                description: questData.description,
                lesson: questData.lesson,
                quiz: questData.quiz
            });
        } else {
            // No quest, just resume game
            this.resume();
            this.physics.resume();
        }
    });
};

// ============================================
// EVENT CHAIN 5: Quest Completed, Update State
// ============================================
scene.setupEventListeners = function() {
    this.eventEmitter.on('questCompleted', (data) => {
        // PSEUDOCODE: Quiz/Quest completed in React
        
        const { questId, score, results } = data;
        
        // 1. Mark quest as completed
        this.completedQuests[questId] = {
            score: score,
            timestamp: Date.now(),
            results: results
        };
        
        // 2. Send completion event to backend (database)
        this.saveProgressToDatabase(questId, score);
        
        // 3. Award points/achievements
        if (score >= 70) {
            // EMIT: Achievement earned
            this.eventEmitter.emit('achievementEarned', {
                achievement: 'quiz_passed',
                questId: questId,
                reward: 100
            });
        }
        
        // 4. Resume game
        this.resume();
        this.physics.resume();
        
        // 5. Show NPC reaction/update dialog
        this.showNPCQuestCompletion(this.activeNPC, score);
    });
};
```

### Layer 3: Camera & Player Movement

```javascript
/**
 * PHASER PSEUDOCODE: Player Control & Camera
 * EVENT FLOW: Input → Player Movement → Camera Follow → Collision Detection
 */

scene.createPlayer = function() {
    // PSEUDOCODE: Create player sprite
    this.player = this.physics.add.sprite(100, 100, 'player');
    this.player.setScale(2);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    // Input handling
    this.cursors = this.input.keyboard.createCursorKeys();
};

scene.updatePlayer = function(delta) {
    // PSEUDOCODE: Player movement logic
    
    if (this.cursors.left.isDown) {
        // Move left
        this.player.setVelocityX(-160);
        this.player.anims.play('walk_left', true);
    } else if (this.cursors.right.isDown) {
        // Move right
        this.player.setVelocityX(160);
        this.player.anims.play('walk_right', true);
    } else if (this.cursors.up.isDown) {
        // Move up
        this.player.setVelocityY(-160);
        this.player.anims.play('walk_up', true);
    } else if (this.cursors.down.isDown) {
        // Move down
        this.player.setVelocityY(160);
        this.player.anims.play('walk_down', true);
    } else {
        // Idle
        this.player.setVelocity(0, 0);
        this.player.anims.play('idle', false);
    }
};

scene.handleCameraTracking = function() {
    // PSEUDOCODE: Camera follows player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
};
```

### Layer 4: Map Transitions

```javascript
/**
 * PHASER PSEUDOCODE: Map/Scene Transitions
 * EVENT FLOW: Player → Map Exit Zone → Transition Event → New Scene
 */

scene.createMap = function(mapName) {
    // PSEUDOCODE: Load and display map
    const mapData = {
        'jungle': { image: 'jungle-map', npcs: [npc1, npc3], width: 800, height: 600 },
        'town': { image: 'town-map', npcs: [npc2], width: 1000, height: 800 },
        'city': { image: 'city-map', npcs: [npc4], width: 1200, height: 900 }
    };
    
    const currentMap = mapData[mapName];
    this.mapWidth = currentMap.width;
    this.mapHeight = currentMap.height;
    
    // Add background
    this.add.image(0, 0, currentMap.image).setOrigin(0, 0);
};

scene.setupMapTransitions = function() {
    // PSEUDOCODE: Detect when player reaches map boundary
    
    this.input.keyboard.on('keydown-W', () => {
        if (this.player.y < 50) {
            // TRANSITION: Moving to next map
            this.transitionToMap('town');
        }
    });
};

scene.transitionToMap = function(newMapName) {
    // PSEUDOCODE: Transition between maps
    
    // 1. Fade out effect
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    // 2. Wait for fade
    this.time.delayedCall(500, () => {
        // 3. Switch scene
        this.scene.start('GameScene', { map: newMapName });
        
        // 4. EMIT: Map changed event
        this.eventEmitter.emit('mapChanged', {
            mapName: newMapName
        });
    });
};
```

---

## React Event Processors (Logic)

### Event Processing Flow

```javascript
/**
 * REACT LAYER: Event Processing & State Management
 * This layer connects Phaser events to React components
 */
```

### Processor 1: Game Event Emitter (Hook)

```javascript
// File: src/hooks/useGameEvents.js
// PURPOSE: Central event bus between Phaser and React

import { useEffect, useCallback } from 'react';

export const useGameEvents = () => {
  const getEventEmitter = useCallback(() => {
    if (!window.gameEvents) {
      const eventMap = {};

      window.gameEvents = {
        // LISTEN: Component subscribes to event
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

        // UNSUBSCRIBE: Component cleanup
        off: (eventName, callback) => {
          if (eventMap[eventName]) {
            eventMap[eventName] = eventMap[eventName].filter(cb => cb !== callback);
          }
        },

        // EMIT: Phaser or React sends event
        emit: (eventName, data) => {
          if (eventMap[eventName]) {
            eventMap[eventName].forEach(cb => cb(data));
          }
        },

        // ONE-TIME: Listen once then unsubscribe
        once: (eventName, callback) => {
          const wrapper = (data) => {
            callback(data);
            window.gameEvents.off(eventName, wrapper);
          };
          window.gameEvents.on(eventName, wrapper);
        },

        // CLEAR: Clear all events
        clear: () => {
          Object.keys(eventMap).forEach(key => delete eventMap[key]);
        }
      };
    }

    return window.gameEvents;
  }, []);

  return getEventEmitter();
};

/**
 * HOOK: useGameEventListener
 * Allows components to subscribe to Phaser events
 */
export const useGameEventListener = (eventName, callback, dependencies = []) => {
  const gameEvents = useGameEvents();

  useEffect(() => {
    const unsubscribe = gameEvents.on(eventName, callback);
    return unsubscribe;
  }, [eventName, callback, gameEvents, ...dependencies]);
};

/**
 * HOOK: useGameEventEmitter
 * Allows components to emit events to Phaser
 */
export const useGameEventEmitter = () => {
  const gameEvents = useGameEvents();

  const emit = useCallback((eventName, data) => {
    gameEvents.emit(eventName, data);
  }, [gameEvents]);

  return { emit };
};
```

### Processor 2: Game UI Event Handler

```javascript
// File: src/GameUI.jsx
// PURPOSE: Main event processor and UI coordinator

import React, { useState, useEffect } from 'react';
import DialogBox from './components/DialogBox';
import QuestPopup from './components/QuestPopup';
import { useGameEventListener, useGameEventEmitter } from './hooks/useGameEvents';
import './styles/index.scss';

/**
 * EVENT PROCESSOR: GameUI
 * 
 * EVENT CHAIN:
 * 1. Phaser: emit('showDialog', dialogData)
 *    └─→ GameUI listens and updates state
 *    └─→ DialogBox component renders
 * 
 * 2. User: Click "Continue" on dialog
 *    └─→ DialogBox calls onClose()
 *    └─→ GameUI emits('dialogClosed')
 *    └─→ Phaser receives and shows quest
 * 
 * 3. Phaser: emit('showQuest', questData)
 *    └─→ GameUI listens and updates state
 *    └─→ QuestPopup component renders
 * 
 * 4. User: Complete quiz with score
 *    └─→ Quiz calls onComplete(score, results)
 *    └─→ GameUI emits('questCompleted', { score, results })
 *    └─→ Phaser receives and saves to database
 */
function GameUI() {
  // ========== STATE ==========
  const [dialogOpen, setDialogOpen] = useState(false);
  const [questOpen, setQuestOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [questData, setQuestData] = useState(null);
  const { emit } = useGameEventEmitter();

  // ========== EVENT LISTENERS ==========
  
  /**
   * EVENT 1: showDialog
   * Triggered by: Phaser (NPC interaction)
   * Action: Display dialog overlay
   */
  useGameEventListener('showDialog', (data) => {
    setDialogData(data);
    setDialogOpen(true);
  });

  /**
   * EVENT 2: showQuest
   * Triggered by: Phaser (after dialog closes)
   * Action: Display quest/lesson popup
   */
  useGameEventListener('showQuest', (data) => {
    setQuestData(data);
    setQuestOpen(true);
  });

  /**
   * EVENT 3: closePopup
   * Triggered by: Phaser (manual close)
   * Action: Close any open popups
   */
  useGameEventListener('closePopup', () => {
    setDialogOpen(false);
    setQuestOpen(false);
  });

  // ========== EVENT EMITTERS ==========

  /**
   * EMIT: dialogClosed
   * Received by: Phaser
   * Purpose: Notify game that user finished reading dialog
   * Trigger: User clicks "Continue" button
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
    emit('dialogClosed', { 
      npcId: dialogData?.id,
      timestamp: Date.now()
    });
  };

  /**
   * EMIT: questClosed
   * Received by: Phaser
   * Purpose: Notify game that user closed quest without completing
   * Trigger: User clicks "X" or "Exit" button
   */
  const handleQuestClose = () => {
    setQuestOpen(false);
    emit('questClosed', { 
      questId: questData?.id,
      timestamp: Date.now()
    });
  };

  /**
   * EMIT: questCompleted
   * Received by: Phaser, Database API
   * Purpose: Report quiz results and update player progress
   * Trigger: User completes quiz (passes or fails)
   */
  const handleQuestComplete = (score, results) => {
    emit('questCompleted', { 
      questId: questData?.id,
      score: score,
      results: results,
      timestamp: Date.now()
    });
  };

  // ========== RENDER ==========
  return (
    <div className="game-ui">
      <DialogBox
        npcData={dialogData}
        onClose={handleDialogClose}
        isOpen={dialogOpen}
      />

      <QuestPopup
        questData={questData}
        isOpen={questOpen}
        onClose={handleQuestClose}
        onComplete={handleQuestComplete}
      />
    </div>
  );
}

export default GameUI;
```

---

## React Components Hierarchy

```
PHASER GAME ENGINE
    ↓ (emits events)
    ↓
REACT EVENT BUS (window.gameEvents)
    ↓
    ├─→ useGameEvents() [Hook]
    │   └─→ useGameEventListener() [Hook]
    │   └─→ useGameEventEmitter() [Hook]
    │
    └─→ GameUI (Parent Component)
        ├─→ DialogBox (Child Component)
        │   └─→ Shows NPC dialog
        │   └─→ Emits: dialogClosed
        │
        └─→ QuestPopup (Child Component)
            ├─→ Lesson (Grandchild Component)
            │   ├─→ Displays lesson content
            │   └─→ Emits: startQuiz event
            │
            └─→ Quiz (Grandchild Component)
                ├─→ MultipleChoiceQuestion (Great-grandchild)
                │   └─→ Handles MCQ logic
                │
                ├─→ FillInBlanksQuestion (Great-grandchild)
                │   └─→ Handles fill-in logic
                │
                └─→ QuizResults (Great-grandchild)
                    └─→ Emits: questCompleted
```

### Component Details

#### Parent: GameUI
- **Props:** None
- **State:** dialogOpen, questOpen, dialogData, questData
- **Events Listen:** showDialog, showQuest, closePopup
- **Events Emit:** dialogClosed, questClosed, questCompleted

#### Child 1: DialogBox
- **Props:** npcData, onClose, isOpen
- **State:** isAnimating
- **Events:** None
- **Purpose:** Display NPC dialog with animation

#### Child 2: QuestPopup
- **Props:** questData, isOpen, onClose
- **State:** mode (lesson|quiz), isAnimating
- **Events:** None
- **Children:** Lesson OR Quiz (conditionally rendered)

#### Grandchild 2a: Lesson
- **Props:** lessonData, onStartQuiz, onClose
- **State:** None
- **Purpose:** Display lesson content with code examples

#### Grandchild 2b: Quiz
- **Props:** quizData, onComplete, onBack
- **State:** currentQuestionIndex, score, answers, showResults
- **Children:** MultipleChoiceQuestion OR FillInBlanksQuestion OR QuizResults

#### Great-grandchild 2b1: MultipleChoiceQuestion
- **Props:** question, onAnswer, disabled
- **State:** selected, answered, feedback
- **Purpose:** Single multiple choice question

#### Great-grandchild 2b2: FillInBlanksQuestion
- **Props:** question, onAnswer, disabled
- **State:** answers, answered, feedback
- **Purpose:** Single fill-in-the-blanks question

#### Great-grandchild 2b3: QuizResults
- **Props:** score, totalQuestions, answers, onRetry, onBack
- **State:** None
- **Purpose:** Display quiz score and performance

---

## SCSS Styling

### Architecture: Component-Scoped Styles

#### Global Variables & Mixins

```scss
// File: src/styles/_variables.scss
// PURPOSE: Design tokens and theming

// ========== COLOR PALETTE ==========
$color-primary: #3b82f6;           // Blue
$color-primary-dark: #1e40af;
$color-primary-light: #dbeafe;
$color-secondary: #10b981;         // Green
$color-success: #10b981;
$color-error: #ef4444;             // Red
$color-warning: #f59e0b;           // Amber
$color-info: #0ea5e9;              // Sky

$color-bg-dark: #0d1b2a;           // Very dark blue
$color-bg-darker: #1e3a5f;         // Dark blue
$color-bg-light: #f8fafc;          // Light
$color-text-primary: #1f2937;
$color-text-secondary: #6b7280;
$color-text-light: #e0eaff;
$color-border: #e5e7eb;

// ========== TYPOGRAPHY ==========
$font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
$font-family-mono: 'Courier New', monospace;

$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
$font-size-2xl: 32px;

// ========== SPACING ==========
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// ========== BORDER RADIUS ==========
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 9999px;

// ========== SHADOWS ==========
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

// ========== TRANSITIONS ==========
$transition-fast: 150ms ease-in-out;
$transition-base: 200ms ease-in-out;
$transition-slow: 300ms ease-in-out;

// ========== Z-INDEX LAYERS ==========
$z-background: 0;
$z-dropdown: 100;
$z-sticky: 500;
$z-fixed: 1000;
$z-modal-backdrop: 2000;
$z-modal: 2001;
$z-tooltip: 3000;
```

```scss
// File: src/styles/_mixins.scss
// PURPOSE: Reusable style patterns

// ========== FLEXBOX UTILITIES ==========
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// ========== BUTTON RESET ==========
@mixin button-reset {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

// ========== FOCUS RING ==========
@mixin focus-ring {
  outline: 2px solid $color-primary;
  outline-offset: 2px;
}

// ========== RESPONSIVE ==========
@mixin mobile-only {
  @media (max-width: 768px) {
    @content;
  }
}

@mixin tablet-only {
  @media (min-width: 769px) and (max-width: 1024px) {
    @content;
  }
}

@mixin desktop-only {
  @media (min-width: 1025px) {
    @content;
  }
}

// ========== TEXT TRUNCATION ==========
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin line-clamp($lines) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// ========== GRADIENT TEXT ==========
@mixin gradient-text($from, $to) {
  background: linear-gradient(90deg, $from 0%, $to 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// ========== SMOOTH ANIMATION ==========
@mixin smooth-transition($properties: all, $duration: $transition-base) {
  transition: $properties $duration;
}
```

#### Component Styles: DialogBox

```scss
// File: src/styles/_dialog-box.scss
// PURPOSE: NPC dialog overlay styling
// PARENT COMPONENT: DialogBox

@import './variables';
@import './mixins';

// ========== OVERLAY BACKDROP ==========
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: $z-modal-backdrop;
  opacity: 0;
  transition: opacity $transition-slow;
  pointer-events: none;
  
  &.show {
    opacity: 1;
    pointer-events: auto;
  }
}

// ========== DIALOG BOX ==========
.dialog-box {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  border-radius: $radius-xl;
  box-shadow: $shadow-2xl;
  z-index: $z-modal;
  max-width: 500px;
  width: 90%;
  animation: slideInUp $transition-slow ease-out;
  margin: auto;
  overflow: hidden;
  transform-origin: center;
  pointer-events: auto;

  @include mobile-only {
    max-width: calc(100% - #{$spacing-lg});
  }
}

// ========== DIALOG HEADER ==========
.dialog-header {
  @include flex-between;
  padding: $spacing-lg;
  border-bottom: 2px solid $color-border;
  background: linear-gradient(90deg, $color-primary 0%, $color-secondary 100%);
  color: white;
  gap: $spacing-md;
}

.dialog-npc-name {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.dialog-close-btn {
  @include button-reset;
  width: 36px;
  height: 36px;
  @include flex-center;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: $font-size-lg;
  font-weight: 700;
  transition: all $transition-base;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

// ========== DIALOG CONTENT ==========
.dialog-content {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  min-height: 120px;
  align-items: flex-start;
}

.dialog-sprite {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: $radius-lg;
  overflow: hidden;
  background: $color-primary-light;
  @include flex-center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.dialog-text {
  flex: 1;
  @include flex-column;
  justify-content: center;

  p {
    margin: 0;
    font-size: $font-size-base;
    line-height: 1.6;
    color: $color-text-primary;
  }
}

// ========== DIALOG FOOTER ==========
.dialog-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $color-border;
  background: $color-bg-light;
  justify-content: flex-end;
}

.dialog-action-btn {
  @include button-reset;
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(90deg, $color-primary 0%, $color-primary-dark 100%);
  color: white;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-base;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }

  &:active {
    transform: translateY(0);
    box-shadow: $shadow-md;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

// ========== ANIMATIONS ==========
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

#### Component Styles: Quiz

```scss
// File: src/styles/_quiz.scss
// PURPOSE: Quiz interface styling
// PARENT COMPONENT: Quiz

@import './variables';
@import './mixins';

// ========== QUIZ CONTAINER ==========
.quiz-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: $spacing-lg;
  gap: $spacing-lg;
}

// ========== QUIZ HEADER ==========
.quiz-header {
  border-bottom: 2px solid $color-border;
  padding-bottom: $spacing-md;

  h2 {
    margin: 0;
    font-size: $font-size-2xl;
    color: $color-text-primary;
  }
}

.quiz-meta {
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// ========== PROGRESS BAR ==========
.quiz-progress {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: $color-bg-light;
  border-radius: $radius-full;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-primary 0%, $color-secondary 100%);
  transition: width $transition-base;
}

.progress-text {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $color-primary;
  min-width: 40px;
}

// ========== QUIZ CONTENT ==========
.quiz-content {
  flex: 1;
  padding: $spacing-lg 0;
  overflow-y: auto;
}

// ========== QUIZ FOOTER ==========
.quiz-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  border-top: 1px solid $color-border;
  padding-top: $spacing-lg;
}

.back-btn {
  @include button-reset;
  padding: $spacing-sm $spacing-lg;
  background: $color-bg-light;
  color: $color-text-primary;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  cursor: pointer;
  font-weight: 600;
  transition: all $transition-base;

  &:hover {
    background: $color-border;
    color: $color-text-primary;
  }
}
```

#### Component Styles: MultipleChoice Question

```scss
// File: src/styles/_multiple-choice.scss
// PURPOSE: Multiple choice question styling
// PARENT COMPONENT: MultipleChoiceQuestion

@import './variables';
@import './mixins';

// ========== QUESTION TEXT ==========
.question-text {
  margin-bottom: $spacing-lg;

  h3 {
    margin: 0;
    font-size: $font-size-lg;
    color: $color-text-primary;
  }
}

// ========== OPTIONS CONTAINER ==========
.options-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

// ========== OPTION BUTTON ==========
.option-button {
  @include button-reset;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  background: white;
  border: 2px solid $color-border;
  border-radius: $radius-lg;
  text-align: left;
  cursor: pointer;
  transition: all $transition-base;

  &:hover:not(:disabled) {
    border-color: $color-primary;
    background: $color-primary-light;
  }

  &.selected {
    border-color: $color-primary;
    background: $color-primary-light;
  }

  &.correct {
    border-color: $color-success;
    background: rgba($color-success, 0.1);
  }

  &.incorrect {
    border-color: $color-error;
    background: rgba($color-error, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.option-text {
  flex: 1;
  font-size: $font-size-base;
  color: $color-text-primary;
}

.option-check {
  margin-left: $spacing-sm;
  font-size: $font-size-lg;
  font-weight: 700;
}

// ========== FEEDBACK BOX ==========
.feedback-box {
  padding: $spacing-md;
  border-radius: $radius-lg;
  margin-top: $spacing-md;

  &.success {
    background: rgba($color-success, 0.1);
    border: 1px solid $color-success;
  }

  &.error {
    background: rgba($color-error, 0.1);
    border: 1px solid $color-error;
  }
}

.feedback-message {
  margin: 0 0 $spacing-sm 0;
  font-size: $font-size-base;
  font-weight: 600;

  .success & {
    color: $color-success;
  }

  .error & {
    color: $color-error;
  }
}

.feedback-explanation {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
```

---

## Summary Table

| Layer | Component | Responsibility | Events |
|-------|-----------|-----------------|--------|
| **Phaser** | GameScene | Game loop, rendering, physics | `showDialog`, `showQuest` |
| **Phaser** | NPCSystem | NPC behavior, proximity detection | `npcInRange`, `dialogClosed` |
| **Event Bus** | window.gameEvents | Event mediation | All events pass through |
| **React Hook** | useGameEvents | Create event emitter | N/A |
| **React Hook** | useGameEventListener | Subscribe to events | All events |
| **React Hook** | useGameEventEmitter | Emit to Phaser | All events |
| **React** | GameUI | Main processor | Listens & emits all |
| **React** | DialogBox | NPC dialog display | Emits `dialogClosed` |
| **React** | QuestPopup | Quest container | Routes to Lesson/Quiz |
| **React** | Lesson | Lesson content | Emits `startQuiz` |
| **React** | Quiz | Quiz manager | Displays questions |
| **React** | MultipleChoiceQuestion | MCQ display | Submits answers |
| **React** | FillInBlanksQuestion | Fill-in display | Submits answers |
| **React** | QuizResults | Results display | Emits `questCompleted` |
| **CSS** | Dialog Styles | Visual appearance | N/A |
| **CSS** | Quiz Styles | Visual appearance | N/A |

---

## Implementation Status

✅ **COMPLETE:**
- Database schema (normalized 3NF)
- React component hierarchy with full source code
- Event communication system (useGameEvents hooks)
- SCSS styling with design tokens
- Component prop documentation

🟡 **PSEUDOCODE (Ready for Implementation):**
- Phaser game scene initialization
- NPC interaction system
- Player movement and camera
- Map transitions and events
- Database integration

---

## Next Steps for Implementation

1. **Phaser Layer:** Implement pseudocode in Phaser v3
2. **Backend:** Create REST API endpoints for database operations
3. **Integration:** Connect React components to backend APIs
4. **Testing:** Unit and integration testing for all layers
5. **Deployment:** Deploy to production environment

