/**
 * Unified Quest Format
 * Single source of truth for all quests/lessons/quizzes across all modes
 * Combines both game mode (lesson + quiz) and lesson mode (topics + quizzes)
 */

import { SAMPLE_QUESTS } from './sampleQuests.js';
import { level1Quests } from './questsByLevel.js';

/**
 * Convert SAMPLE_QUESTS format to unified format
 * Input: { id, title, lesson, quiz }
 * Output: { id, title, segments: [{ type: 'topic', ... }, { type: 'quiz', ... }] }
 */
const unifyGameModeQuest = (questKey, questData) => {
  return {
    id: questData.id,
    title: questData.title,
    gameQuestId: questData.id, // Keep original game ID for reference
    segments: [
      {
        seg_name: questData.lesson.id,
        type: 'topic',
        title: questData.lesson.title,
        content: questData.lesson.content
      },
      {
        seg_name: questData.quiz.id,
        type: 'quiz-multipart',
        title: questData.quiz.title,
        'quiz-data': {
          questions: questData.quiz.questions
        }
      }
    ]
  };
};

/**
 * Convert questsByLevel format to unified format
 * This is already similar - just normalize it
 */
const unifyLessonModeSegment = (segment) => {
  // Return as-is, it's already in our format
  return segment;
};

/**
 * Build unified quests from both sources
 */
const buildUnifiedQuests = () => {
  const unified = [];

  // First, convert all SAMPLE_QUESTS to unified format
  for (const [key, questData] of Object.entries(SAMPLE_QUESTS)) {
    unified.push(unifyGameModeQuest(key, questData));
  }

  // For lesson mode, use level1Quests as-is (already in unified format)
  // But ensure they link back to game quest IDs for sync
  for (const segment of level1Quests) {
    // Check if this segment belongs to any of the unified quests
    const linkedQuest = findLinkedQuest(segment.seg_name);
    if (linkedQuest) {
      // Mark this segment as linked to a game quest
      segment.linkedGameQuestId = linkedQuest.gameQuestId;
    }
  }

  return unified;
};

/**
 * Find which game quest a lesson segment belongs to
 */
const findLinkedQuest = (segName) => {
  const mapping = {
    // Variables
    'intro-variables': 'quest-variables',
    'vars-quiz': 'quest-variables',
    
    // Functions
    'functions-intro': 'quest-functions',
    'functions-quiz': 'quest-functions',
    
    // Arrays
    'arrays-intro': 'quest-arrays',
    'arrays-quiz': 'quest-arrays',
    
    // Loops
    'loops-intro': 'quest-loops',
    'loops-quiz': 'quest-loops',
    
    // Objects
    'objects-intro': 'quest-objects',
    'objects-quiz': 'quest-objects',
    
    // Conditionals
    'conditionals-intro': 'quest-conditionals',
    'conditionals-quiz': 'quest-conditionals',
    
    // Promises
    'promises-intro': 'quest-promises',
    'promises-quiz': 'quest-promises'
  };

  const gameQuestId = mapping[segName];
  if (gameQuestId && SAMPLE_QUESTS[gameQuestId]) {
    return SAMPLE_QUESTS[gameQuestId];
  }
  return null;
};

/**
 * Get all unified quests
 */
export const getUnifiedQuests = () => {
  return buildUnifiedQuests();
};

/**
 * Get a specific quest by game ID
 */
export const getUnifiedQuestById = (questId) => {
  const quests = buildUnifiedQuests();
  return quests.find(q => q.id === questId || q.gameQuestId === questId);
};

/**
 * Get a quest in game mode format (with lesson and quiz)
 * Used by game mode
 */
export const getQuestForGameMode = (questId) => {
  // questId is like 'quest-variables', 'quest-functions', etc.
  // But SAMPLE_QUESTS keys are 'quest1', 'quest2', etc.
  // So we need to find the quest by its .id property
  for (const [key, questData] of Object.entries(SAMPLE_QUESTS)) {
    if (questData.id === questId) {
      return questData;
    }
  }
  return null;
};

/**
 * Get lesson segments by game quest ID
 * Maps back from game quest to lesson segments
 */
export const getLessonSegmentsForQuest = (gameQuestId) => {
  const mapping = {
    'quest-variables': ['intro-variables', 'vars-quiz'],
    'quest-functions': ['functions-intro', 'functions-quiz'],
    'quest-arrays': ['arrays-intro', 'arrays-quiz'],
    'quest-loops': ['loops-intro', 'loops-quiz'],
    'quest-objects': ['objects-intro', 'objects-quiz'],
    'quest-conditionals': ['conditionals-intro', 'conditionals-quiz'],
    'quest-promises': ['promises-intro', 'promises-quiz']
  };

  const segNames = mapping[gameQuestId] || [];
  return level1Quests.filter(seg => segNames.includes(seg.seg_name));
};

/**
 * Mapping between lesson seg_names and game quest IDs for syncing
 */
export const getLessonToGameMapping = () => {
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

/**
 * Get quiz data from either mode
 * @param {string} questIdOrSegName - Either game quest ID or lesson seg_name
 * @returns {object} Quiz data with questions
 */
export const getQuizData = (questIdOrSegName) => {
  // Try game mode first
  if (SAMPLE_QUESTS[questIdOrSegName]) {
    return SAMPLE_QUESTS[questIdOrSegName].quiz;
  }

  // Try lesson mode
  const segment = level1Quests.find(s => s.seg_name === questIdOrSegName);
  if (segment && segment.type.startsWith('quiz-')) {
    return {
      id: segment.seg_name,
      title: segment.title,
      questions: segment['quiz-data']?.questions || []
    };
  }

  return null;
};

/**
 * Get lesson data from either mode
 * @param {string} questIdOrSegName - Either game quest ID or lesson seg_name
 * @returns {object} Lesson data
 */
export const getLessonData = (questIdOrSegName) => {
  // Try game mode first
  if (SAMPLE_QUESTS[questIdOrSegName]) {
    return SAMPLE_QUESTS[questIdOrSegName].lesson;
  }

  // Try lesson mode (topics)
  const segment = level1Quests.find(s => s.seg_name === questIdOrSegName);
  if (segment && segment.type === 'topic') {
    return {
      id: segment.seg_name,
      title: segment.title,
      content: segment.content
    };
  }

  return null;
};

export default getUnifiedQuests;
