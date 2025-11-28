import React, { useState } from 'react';
import Lesson from './Lesson';
import Quiz from './Quiz';
import '../styles/_quest-popup.scss';

/**
 * QuestPopup Component
 * Main container for quest/lesson system
 * Manages switching between lesson and quiz modes
 * Props:
 *   - questData: { id, lesson, quiz }
 *   - isOpen: boolean to control visibility
 *   - onClose: callback when popup closes
 */
const QuestPopup = ({ questData, isOpen, onClose }) => {
  const [mode, setMode] = useState('lesson'); // 'lesson' or 'quiz'
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setMode('lesson');
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setMode('lesson');
    }, 300);
  };

  const handleStartQuiz = () => {
    setMode('quiz');
  };

  const handleBackToLesson = () => {
    setMode('lesson');
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
              onComplete={() => {
                // Quiz completed - stay on results screen
                // User can retry or go back to lesson
              }}
              onBack={handleBackToLesson}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestPopup;
