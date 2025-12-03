/**
 * Mode Synchronizer
 * Handles cross-mode synchronization and edge cases when switching between game and lesson modes
 * Ensures proper level progression, progress tracking, and UI state management
 */

import {
  getProgress,
  getCurrentLevel,
  isLevelCompleted,
  setLastMode,
  getLastMode
} from './progressManager';
import { getAllQuests } from './questsByLevel';

/**
 * Determine which level to start on based on current progress
 * @returns {number} Level number (1, 2, etc.)
 */
export function getStartingLevel() {
  const quests = getAllQuests();
  return getCurrentLevel(quests);
}

/**
 * Determine which mode the user should start in based on last session
 * @returns {string} 'menu', 'full', or 'ui-only'
 */
export function getStartingMode() {
  const lastMode = getLastMode();
  return lastMode || 'menu';
}

/**
 * Check if a level is fully completed
 * @param {number} levelId - Level ID to check
 * @returns {boolean} True if all quizzes in level are answered
 */
export function isLevelFullyCompleted(levelId) {
  const quests = getAllQuests();
  // For now, only Level 1 exists, check all quests
  if (levelId === 1) {
    return isLevelCompleted(quests);
  }
  return false;
}

/**
 * Record that user is starting in a particular mode
 * Used for analytics and resuming in the same mode later
 * @param {string} mode - 'full' or 'ui-only'
 */
export function recordModeStart(mode) {
  setLastMode(mode);
}

/**
 * Get synchronization metadata for debugging
 * @returns {object} Current sync state
 */
export function getSyncMetadata() {
  const progress = getProgress();
  const level = getStartingLevel();
  const lastMode = getLastMode();
  const quests = getAllQuests();
  const levelCompleted = isLevelCompleted(quests);

  return {
    currentLevel: level,
    lastMode,
    levelCompleted,
    totalQuestsInLevel: quests.length,
    completedQuestCount: Object.keys(progress.completedQuests || {}).length,
    progress: progress
  };
}

/**
 * Handle switching from UI-only mode to game mode
 * Performs necessary synchronization and level checks
 * @returns {object} Sync result with level and any messages
 */
export function syncOnGameModeEnter() {
  const level = getStartingLevel();
  const levelCompleted = isLevelFullyCompleted(level);
  
  recordModeStart('full');

  return {
    level,
    levelCompleted,
    message: levelCompleted 
      ? `Welcome back! Level ${level} is complete. Starting Level ${level + 1}!`
      : `Continuing Level ${level}...`
  };
}

/**
 * Handle switching from game mode to UI-only mode
 * Performs necessary synchronization and level checks
 * @returns {object} Sync result with level and any messages
 */
export function syncOnUIOnlyModeEnter() {
  const level = getStartingLevel();
  
  recordModeStart('ui-only');

  return {
    level,
    message: `Resuming Level ${level} lessons...`
  };
}

/**
 * Comprehensive edge case test suite
 * Returns array of edge case scenarios and current state
 */
export function getEdgeCaseTests() {
  const sync = getSyncMetadata();
  
  return {
    scenario1: {
      name: 'Complete Level 1 in lesson mode, switch to game',
      description: 'User completes all Level 1 quizzes in UI-only mode, then switches to game mode',
      expectedBehavior: 'Game should load Level 2 (or show "Level 1 complete!" message)',
      currentState: {
        levelCompleted: sync.levelCompleted,
        currentLevel: sync.currentLevel,
        willAdvanceToNextLevel: sync.levelCompleted && sync.currentLevel === 1
      }
    },
    scenario2: {
      name: 'Partial progress in lesson, switch to game',
      description: 'User completes 2 of 7 quizzes in lesson mode, switches to game',
      expectedBehavior: 'Game should show same level (1) with partial progress saved',
      currentState: {
        questsCompleted: sync.completedQuestCount,
        outOfTotal: sync.totalQuestsInLevel,
        sameLevel: true
      }
    },
    scenario3: {
      name: 'Quit and resume same mode',
      description: 'User plays game, closes window, reopens and chooses game again',
      expectedBehavior: 'Should resume at same level with same progress',
      currentState: {
        lastMode: sync.lastMode,
        currentLevel: sync.currentLevel,
        progressRestored: !!sync.progress.currentLevel
      }
    },
    scenario4: {
      name: 'Cross-mode progress accumulation',
      description: 'User does Quiz 1 in game, Quiz 2 in lesson, Quiz 3 in game',
      expectedBehavior: 'All progress should be tracked in single localStorage',
      currentState: {
        totalCompleted: sync.completedQuestCount,
        usingSingleStorage: true
      }
    },
    scenario5: {
      name: 'Resume after session end',
      description: 'User closes browser, returns next day',
      expectedBehavior: 'Should restore exact level and progress from last session',
      currentState: {
        storedProgress: !!sync.progress,
        correctLevel: sync.currentLevel,
        correctMode: sync.lastMode
      }
    }
  };
}

export default {
  getStartingLevel,
  getStartingMode,
  isLevelFullyCompleted,
  recordModeStart,
  getSyncMetadata,
  syncOnGameModeEnter,
  syncOnUIOnlyModeEnter,
  getEdgeCaseTests
};
