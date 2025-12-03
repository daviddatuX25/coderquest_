/**
 * Quest Data Normalizer
 * Converts questsByLevel format to a unified format that works for both game and lesson modes
 * Ensures quiz consistency across all modes
 */

import { level1Quests } from './questsByLevel';

/**
 * Convert questsByLevel format to unified quest format
 * Handles both topic and quiz segments
 */
const normalizeQuest = (segment) => {
  if (segment.type === 'topic') {
    return {
      seg_name: segment.seg_name,
      type: 'topic',
      title: segment.title,
      content: segment.content,
      id: segment.seg_name // For compatibility
    };
  }
  
  if (segment.type.startsWith('quiz-')) {
    return {
      seg_name: segment.seg_name,
      type: segment.type,
      title: segment.title,
      'quiz-data': segment['quiz-data'],
      id: segment.seg_name // For compatibility
    };
  }
  
  return segment;
};

/**
 * Get normalized quests that work consistently across all modes
 */
export const getNormalizedQuests = () => {
  return level1Quests.map(normalizeQuest);
};

/**
 * Get a specific quiz by seg_name
 */
export const getQuizBySegName = (segName) => {
  const quests = getNormalizedQuests();
  return quests.find(q => q.seg_name === segName);
};

/**
 * Get all quizzes (filter out topics)
 */
export const getAllQuizzes = () => {
  const quests = getNormalizedQuests();
  return quests.filter(q => q.type.startsWith('quiz-'));
};

export default getNormalizedQuests;
