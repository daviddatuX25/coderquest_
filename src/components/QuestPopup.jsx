import React, { useState } from 'react';
import Lesson from './Lesson';
import Quiz from './Quiz';
import { useGameEventEmitter } from '../hooks/useGameEvents';
import '../styles/_quest-popup.scss';

/**
 * QuestPopup Component
 * Main container for quest/lesson system
 * Manages switching between lesson and quiz modes
 * Props:
 *   - questData: { id, lesson, quiz }
 *   - isOpen: boolean to control visibility
 *   - onClose: callback when popup closes
 *   - onComplete: callback(score, results) when quiz completes
 */
const QuestPopup = ({ questData, isOpen, onClose, onComplete }) => {
  const [mode, setMode] = useState('lesson'); // 'lesson' or 'quiz'
  const [isAnimating, setIsAnimating] = useState(false);
  const { emit } = useGameEventEmitter();

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setMode('lesson');
      console.log('🎯 QuestPopup opened with questData:', {
        hasQuestData: !!questData,
        hasLesson: !!questData?.lesson,
        hasQuiz: !!questData?.quiz,
        lessonTitle: questData?.lesson?.title,
        quizTitle: questData?.quiz?.title,
        quizQuestionCount: questData?.quiz?.questions?.length || 0
      });
    }
  }, [isOpen, questData]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setMode('lesson');
    }, 300);
  };

  const handleStartQuiz = () => {
    // Keep input disabled when entering quiz
    setMode('quiz');
    emit('quizStarted', { questId: questData?.id });
  };

  const handleBackToLesson = () => {
    // Keep input disabled - still in UI
    setMode('lesson');
    emit('quizEnded', { questId: questData?.id });
  };

  if (!isOpen) return null;

  return (
    <div className={`quest-overlay ${isAnimating ? 'show' : ''}`} onClick={handleClose}>
      <div className="quest-popup" onClick={(e) => e.stopPropagation()}>
        <button className="quest-close-btn" onClick={handleClose} title="Close quest">
          ✕
        </button>

        <div className={`quest-content ${mode}`}>
          {mode === 'lesson' && questData.lesson && (
            <Lesson
              lessonData={questData.lesson}
              onStartQuiz={handleStartQuiz}
              onClose={handleClose}
            />
          )}

          {mode === 'quiz' && questData.quiz && (
            <Quiz
              quizData={questData.quiz}
              onComplete={onComplete}
              onBack={handleBackToLesson}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestPopup;
