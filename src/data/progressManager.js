/**
 * Progress Manager
 * Centralized system for tracking and persisting player progress
 * Uses localStorage for persistence between sessions
 * Shared between game mode and lesson mode
 */

import { level1Quests } from './questsByLevel.js';

const STORAGE_KEY = 'coderquest_progress';

// Default progress structure
const defaultProgress = {
  currentLevel: 1,
  currentQuestIndex: 0,
  completedLevels: {}, // levelId -> true
  completedQuests: {}, // questId -> true
  questScores: {}, // questId -> score
  questResults: {}, // questId -> { qid -> isCorrect }
  totalQuestsCompleted: 0,
  totalScore: 0, // Average across all quests
  lastUpdated: null,
  lastMode: 'menu' // track which mode user was in
};

/**
 * Get all progress from localStorage
 */
export const getProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { ...defaultProgress };
  } catch (error) {
    console.error('Failed to load progress:', error);
    return { ...defaultProgress };
  }
};

/**
 * Save progress to localStorage
 */
export const saveProgress = (progress) => {
  try {
    const toSave = {
      ...progress,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    
    // Emit custom event so React components in focus mode get notified immediately
    window.dispatchEvent(new CustomEvent('progressUpdated', { 
      detail: { progress: toSave }
    }));
    
    return true;
  } catch (error) {
    console.error('Failed to save progress:', error);
    return false;
  }
};

/**
 * Mark a quest as completed
 */
export const completeQuest = (questId, score, results) => {
  const progress = getProgress();
  
  console.log(`📝 [completeQuest] Marking complete: questId='${questId}', score=${score}`);
  
  progress.completedQuests[questId] = true;
  progress.questScores[questId] = score;
  progress.questResults[questId] = results;
  progress.totalQuestsCompleted = Object.keys(progress.completedQuests).length;
  
  // Calculate average score
  const scores = Object.values(progress.questScores);
  progress.totalScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  
  console.log(`📝 [completeQuest] After marking: completedQuests keys = [${Object.keys(progress.completedQuests).join(', ')}]`);
  
  saveProgress(progress);
  return progress;
};

/**
 * Check if a quest is completed
 */
export const isQuestCompleted = (questId) => {
  const progress = getProgress();
  return progress.completedQuests[questId] === true;
};

/**
 * Get score for a specific quest
 */
export const getQuestScore = (questId) => {
  const progress = getProgress();
  return progress.questScores[questId] || 0;
};

/**
 * Get results for a specific quest
 */
export const getQuestResults = (questId) => {
  const progress = getProgress();
  return progress.questResults[questId] || {};
};

/**
 * Mark a level as completed
 */
export const completeLevel = (levelId) => {
  const progress = getProgress();
  progress.completedLevels[levelId] = true;
  
  // Advance to next level
  progress.currentLevel = levelId + 1;
  progress.currentQuestIndex = 0;
  
  saveProgress(progress);
  return progress;
};

/**
 * Check if all quests in a level are completed
 * @param {Array} levelQuests - Array of quest objects for the level
 * @returns {boolean} - true if all quests completed, false otherwise
 */
export const isLevelCompleted = (levelQuests) => {
  if (!levelQuests || levelQuests.length === 0) return false;
  
  // Filter only quiz segments (not topics)
  const quizzes = levelQuests.filter(q => q.type.startsWith('quiz-'));
  
  // Check if all quizzes are completed
  return quizzes.every(quiz => isQuestCompleted(quiz.seg_name));
};

/**
 * Get current level based on completed quests
 * @param {Array} levelQuests - Array of quest objects for the level
 * @returns {number} - current level (1-based)
 */
export const getCurrentLevel = (levelQuests) => {
  const progress = getProgress();
  
  // If level is completed in lesson mode, it should carry over
  if (isLevelCompleted(levelQuests)) {
    progress.currentLevel = 2; // Next level
    saveProgress(progress);
    return 2;
  }
  
  return progress.currentLevel || 1;
};

/**
 * Get completion percentage for a level
 * @param {Array} levelQuests - Array of quest objects for the level
 * @returns {number} - percentage 0-100
 */
export const getLevelCompletionPercentage = (levelQuests) => {
  if (!levelQuests || levelQuests.length === 0) return 0;
  
  const quizzes = levelQuests.filter(q => q.type.startsWith('quiz-'));
  const completed = quizzes.filter(q => isQuestCompleted(q.seg_name)).length;
  
  return Math.round((completed / quizzes.length) * 100);
};

/**
 * Update last mode
 */
export const setLastMode = (mode) => {
  const progress = getProgress();
  progress.lastMode = mode;
  saveProgress(progress);
};

/**
 * Get last mode
 */
export const getLastMode = () => {
  const progress = getProgress();
  return progress.lastMode || 'menu';
};

/**
 * Reset all progress (for development/testing)
 */
export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { ...defaultProgress };
  } catch (error) {
    console.error('Failed to reset progress:', error);
    return { ...defaultProgress };
  }
};

/**
 * Export progress (for backup)
 */
export const exportProgress = () => {
  const progress = getProgress();
  const dataStr = JSON.stringify(progress, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `coderquest-progress-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Import progress (for restore)
 */
export const importProgress = (jsonData) => {
  try {
    const progress = JSON.parse(jsonData);
    saveProgress(progress);
    return progress;
  } catch (error) {
    console.error('Failed to import progress:', error);
    return null;
  }
};

/**
 * Get mapping of lesson mode quiz names to game mode quest IDs
 * Derives the mapping from questsByLevel data
 * Pattern: {topic}-quiz → quest-{topic}
 * Examples: vars-quiz → quest-variables, functions-quiz → quest-functions
 */
export const getLessonToGameQuestMapping = () => {
  // Fallback to manual mapping (unified quests mapping)
  // Pattern: {topic}-intro/quiz → quest-{topic}
  return {
    'intro-variables': 'quest-variables',
    'vars-quiz': 'quest-variables',
    'functions-intro': 'quest-functions',
    'functions-quiz': 'quest-functions',
    'arrays-intro': 'quest-arrays',
    'arrays-quiz': 'quest-arrays',
    'loops-intro': 'quest-loops',
    'loops-quiz': 'quest-loops',
    'objects-intro': 'quest-objects',
    'objects-quiz': 'quest-objects',
    'conditionals-intro': 'quest-conditionals',
    'conditionals-quiz': 'quest-conditionals',
    'promises-intro': 'quest-promises',
    'promises-quiz': 'quest-promises'
  };
};
