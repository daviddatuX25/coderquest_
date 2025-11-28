# CoderQuest - React Components & SCSS Documentation

**Generated:** 11/28/2025, 1:58:55 PM

## Table of Contents

- [React Components](#react-components)
- [Custom Hooks](#custom-hooks)
- [SCSS Styles](#scss-styles)

---

## React Components

React components for the CoderQuest learning system.

### 1. DialogBox.jsx

```jsx
import React, { useState, useEffect } from 'react';
import '../styles/_dialog-box.scss';

/**
 * DialogBox Component
 * Displays NPC dialog with character name and message
 * Props:
 *   - npcData: { name, dialog, sprite }
 *   - onClose: callback when close button clicked
 *   - isOpen: boolean to control visibility
 */
const DialogBox = ({ npcData, onClose, isOpen }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  if (!isOpen) return null;

  return (
    <div className={`dialog-overlay ${isAnimating ? 'show' : ''}`} onClick={handleClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-npc-name">{npcData?.name || 'NPC'}</h2>
          <button className="dialog-close-btn" onClick={handleClose} title="Close dialog">
            ✕
          </button>
        </div>
        
        <div className="dialog-content">
          {npcData?.sprite && (
            <div className="dialog-sprite">
              <img src={`assets/characters/${npcData.sprite}.png`} alt={npcData.name} />
            </div>
          )}
          <div className="dialog-text">
            <p>{npcData?.dialog || 'Hello, adventurer!'}</p>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="dialog-action-btn" onClick={handleClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;

```

### 2. FillInBlanksQuestion.jsx

```jsx
import React, { useState, useRef } from 'react';
import '../styles/_fill-in-blanks.scss';

/**
 * FillInBlanksQuestion Component
 * Displays a sentence with blanks to fill in
 * Props:
 *   - question: { 
 *       id, 
 *       sentence (with [BLANK] markers), 
 *       answers: [correct answers in order],
 *       explanation 
 *     }
 *   - onAnswer: callback(questionId, userAnswers, isCorrect)
 *   - disabled: boolean to disable interaction
 */
const FillInBlanksQuestion = ({ question, onAnswer, disabled }) => {
  const [answers, setAnswers] = useState({});
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const inputRefs = useRef({});

  // Parse the sentence to find blanks
  const parseSentence = () => {
    const parts = question.sentence.split(/\[BLANK\]/);
    return parts;
  };

  const handleAnswerChange = (blankIndex, value) => {
    if (disabled) return;

    setAnswers(prev => ({
      ...prev,
      [blankIndex]: value
    }));
  };

  const handleSubmit = () => {
    if (answered || disabled) return;

    // Check answers
    const userAnswers = Object.values(answers).map(a => a?.trim().toLowerCase() || '');
    const correctAnswers = question.answers.map(a => a.toLowerCase());
    
    const isCorrect = userAnswers.length === correctAnswers.length &&
      userAnswers.every((answer, i) => answer === correctAnswers[i]);

    setAnswered(true);
    setFeedback({
      isCorrect,
      message: isCorrect ? '✓ Correct!' : '✗ Incorrect',
      explanation: question.explanation,
      correctAnswers: !isCorrect ? correctAnswers : null
    });

    onAnswer(question.id, userAnswers, isCorrect);
  };

  const parts = parseSentence();

  return (
    <div className="fill-in-blanks-question">
      <div className="question-text">
        <h3>{question.prompt || 'Fill in the blanks:'}</h3>
      </div>

      <div className="sentence-container">
        <div className="sentence">
          {parts.map((part, index) => (
            <span key={`part-${index}`}>
              {part}
              {index < parts.length - 1 && (
                <input
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  className={`blank-input ${
                    answered ? (question.answers[index].toLowerCase() === answers[index]?.toLowerCase() ? 'correct' : 'incorrect') : ''
                  }`}
                  placeholder={`Answer ${index + 1}`}
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={disabled || answered}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !answered && !disabled) {
                      handleSubmit();
                    }
                  }}
                />
              )}
            </span>
          ))}
        </div>
      </div>

      {!answered && (
        <div className="submit-button-container">
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={disabled}
          >
            Check Answer
          </button>
        </div>
      )}

      {feedback && (
        <div className={`feedback-box ${feedback.isCorrect ? 'success' : 'error'}`}>
          <p className="feedback-message">{feedback.message}</p>
          {feedback.explanation && (
            <p className="feedback-explanation">{feedback.explanation}</p>
          )}
          {feedback.correctAnswers && (
            <div className="correct-answers">
              <p><strong>Correct answers:</strong></p>
              <ul>
                {feedback.correctAnswers.map((ans, i) => (
                  <li key={i}>{i + 1}. {ans}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FillInBlanksQuestion;

```

### 3. Lesson.jsx

```jsx
import React from 'react';
import '../styles/_lesson.scss';

/**
 * Lesson Component
 * Displays lesson content with ability to start quiz
 * Props:
 *   - lessonData: { id, title, content, quizId }
 *   - onStartQuiz: callback to start associated quiz
 *   - onClose: callback to close lesson
 */
const Lesson = ({ lessonData, onStartQuiz, onClose }) => {
  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <h2>{lessonData.title}</h2>
        <button className="lesson-close-btn" onClick={onClose} title="Close lesson">
          ✕
        </button>
      </div>

      <div className="lesson-content">
        {typeof lessonData.content === 'string' ? (
          <p>{lessonData.content}</p>
        ) : (
          <>
            {lessonData.content.sections && lessonData.content.sections.map((section, index) => (
              <div key={index} className="content-section">
                {section.title && <h3>{section.title}</h3>}
                {section.text && <p>{section.text}</p>}
                {section.code && (
                  <pre className="code-block">
                    <code>{section.code}</code>
                  </pre>
                )}
                {section.list && (
                  <ul className="content-list">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="lesson-footer">
        <button className="lesson-close-btn-secondary" onClick={onClose}>
          Close
        </button>
        {lessonData.quizId && (
          <button className="lesson-start-quiz-btn" onClick={onStartQuiz}>
            Start Quiz →
          </button>
        )}
      </div>
    </div>
  );
};

export default Lesson;

```

### 4. MultipleChoiceQuestion.jsx

```jsx
import React, { useState } from 'react';
import '../styles/_multiple-choice.scss';

/**
 * MultipleChoiceQuestion Component
 * Displays a multiple choice question with options
 * Props:
 *   - question: { id, text, options: [{ id, text, isCorrect }], explanation }
 *   - onAnswer: callback(questionId, selectedOptionId, isCorrect)
 *   - disabled: boolean to disable interaction after answering
 */
const MultipleChoiceQuestion = ({ question, onAnswer, disabled }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSelectOption = (optionId) => {
    if (disabled || answered) return;

    setSelected(optionId);
    const selectedOption = question.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect || false;

    setAnswered(true);
    setFeedback({
      isCorrect,
      message: isCorrect ? '✓ Correct!' : '✗ Incorrect',
      explanation: question.explanation
    });

    onAnswer(question.id, optionId, isCorrect);
  };

  return (
    <div className="multiple-choice-question">
      <div className="question-text">
        <h3>{question.text}</h3>
      </div>

      <div className="options-container">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={`option-button ${selected === option.id ? 'selected' : ''} ${
              answered && option.isCorrect ? 'correct' : ''
            } ${answered && selected === option.id && !option.isCorrect ? 'incorrect' : ''}`}
            onClick={() => handleSelectOption(option.id)}
            disabled={disabled || answered}
          >
            <span className="option-text">{option.text}</span>
            {answered && option.isCorrect && <span className="option-check">✓</span>}
            {answered && selected === option.id && !option.isCorrect && (
              <span className="option-check">✗</span>
            )}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback-box ${feedback.isCorrect ? 'success' : 'error'}`}>
          <p className="feedback-message">{feedback.message}</p>
          {feedback.explanation && (
            <p className="feedback-explanation">{feedback.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;

```

### 5. QuestPopup.jsx

```jsx
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

```

### 6. Quiz.jsx

```jsx
import React, { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import FillInBlanksQuestion from './FillInBlanksQuestion';
import QuizResults from './QuizResults';
import '../styles/_quiz.scss';

/**
 * Quiz Component
 * Manages quiz flow: questions -> results
 * Props:
 *   - quizData: { id, title, questions: [] }
 *   - onComplete: callback(score, results)
 *   - onBack: callback to go back to lesson
 */
const Quiz = ({ quizData, onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  const handleAnswer = (questionId, selectedAnswer, isCorrect) => {
    // Store answer
    const newAnswers = [
      ...answers,
      {
        questionId,
        selectedAnswer,
        isCorrect,
        questionIndex: currentQuestionIndex
      }
    ];
    setAnswers(newAnswers);

    // Update score
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Move to next question after brief delay
    setTimeout(() => {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <QuizResults
        score={score}
        totalQuestions={quizData.questions.length}
        answers={answers}
        onRetry={handleRetry}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quizData.title}</h2>
        <div className="quiz-meta">
          <span className="quiz-question-number">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
        </div>
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">{Math.round(progress)}%</span>
      </div>

      <div className="quiz-content">
        {currentQuestion.type === 'multipleChoice' && (
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={false}
          />
        )}

        {currentQuestion.type === 'fillInBlanks' && (
          <FillInBlanksQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={false}
          />
        )}
      </div>

      <div className="quiz-footer">
        <button className="back-btn" onClick={onBack}>
          Exit Quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz;

```

### 7. QuizResults.jsx

```jsx
import React from 'react';
import '../styles/_quiz-results.scss';

/**
 * QuizResults Component
 * Displays quiz score and performance feedback
 * Props:
 *   - score: number of correct answers
 *   - totalQuestions: total questions in quiz
 *   - answers: array of answer objects
 *   - onRetry: callback to retry quiz
 *   - onBack: callback to go back to lesson
 */
const QuizResults = ({ score, totalQuestions, answers, onRetry, onBack }) => {
  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= 70;

  const getFeedbackMessage = () => {
    if (percentage === 100) {
      return '🌟 Perfect Score! Excellent work!';
    } else if (percentage >= 80) {
      return '⭐ Great job! You did very well!';
    } else if (percentage >= 70) {
      return '👍 Good effort! You passed!';
    } else if (percentage >= 50) {
      return '⚡ Keep practicing! You\'re getting there!';
    } else {
      return '💪 Don\'t give up! Try again!';
    }
  };

  const getFeedbackColor = () => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'fair';
    return 'poor';
  };

  return (
    <div className={`quiz-results-container ${getFeedbackColor()}`}>
      <div className="results-header">
        <h2>Quiz Complete!</h2>
      </div>

      <div className="score-display">
        <div className="score-circle">
          <span className="score-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>

      <div className="score-details">
        <h3>{getFeedbackMessage()}</h3>
        <div className="score-breakdown">
          <p className="score-info">
            <span className="score-label">Correct:</span>
            <span className="score-value correct">{score}</span>
          </p>
          <p className="score-info">
            <span className="score-label">Total:</span>
            <span className="score-value total">{totalQuestions}</span>
          </p>
        </div>
      </div>

      <div className="results-status">
        {passed ? (
          <div className="status-passed">
            <p className="status-message">✓ You passed this quiz!</p>
            <p className="status-note">You can move on to the next lesson.</p>
          </div>
        ) : (
          <div className="status-failed">
            <p className="status-message">⚠ You didn't pass this time.</p>
            <p className="status-note">Try again to improve your score.</p>
          </div>
        )}
      </div>

      <div className="results-footer">
        <button className="results-btn retry-btn" onClick={onRetry}>
          Retry Quiz
        </button>
        <button className="results-btn back-btn" onClick={onBack}>
          Back to Lesson
        </button>
      </div>
    </div>
  );
};

export default QuizResults;

```

---

## Custom Hooks

Custom React hooks for game integration and event handling.

### 1. useGameEvents.js

```javascript
import { useEffect, useCallback } from 'react';

/**
 * useGameEvents Hook
 * Allows React components to listen to and emit events from/to Phaser
 * Uses a global event emitter attached to window
 */
export const useGameEvents = () => {
  // Get or create global event emitter
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

/**
 * useGameEventListener Hook
 * Subscribe to game events in React components
 */
export const useGameEventListener = (eventName, callback, dependencies = []) => {
  const gameEvents = useGameEvents();

  useEffect(() => {
    const unsubscribe = gameEvents.on(eventName, callback);
    return unsubscribe;
  }, [eventName, callback, gameEvents, ...dependencies]);
};

/**
 * useGameEventEmitter Hook
 * Emit events to Phaser from React components
 */
export const useGameEventEmitter = () => {
  const gameEvents = useGameEvents();

  const emit = useCallback((eventName, data) => {
    gameEvents.emit(eventName, data);
  }, [gameEvents]);

  return { emit };
};

```

---

## SCSS Styles

SCSS stylesheets organized by component.

### 1. index.scss

```scss
@import './styles/variables';
@import './styles/mixins';

/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  font-family: $font-family-primary;
  font-size: $font-size-base;
  line-height: 1.6;
  color: $color-text-primary;
  background: $color-bg-dark;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Game UI Container */
.game-ui {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: $z-modal-backdrop;

  /* Allow pointer events on modals */
  > * {
    pointer-events: auto;
  }
}

/* Component-specific imports */
@import './styles/dialog-box';
@import './styles/quest-popup';
@import './styles/lesson';
@import './styles/quiz';
@import './styles/multiple-choice';
@import './styles/fill-in-blanks';
@import './styles/quiz-results';

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .game-ui {
    display: none;
  }
}

```

### 2. _dialog-box.scss

```scss
@import './variables';
@import './mixins';

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  opacity: 0;
  transition: opacity 200ms ease-in-out;
  pointer-events: none;
  
  &.show {
    opacity: 1;
    pointer-events: auto;
  }
}

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
  font-weight: $font-weight-bold;
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
  font-weight: $font-weight-bold;
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
    font-weight: $font-weight-normal;
  }
}

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
  font-weight: $font-weight-semibold;
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

// Animation for dialog appearance
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

### 3. _fill-in-blanks.scss

```scss
@import './variables';
@import './mixins';

.fill-in-blanks-question {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-text h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.sentence-container {
  padding: 20px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}

.sentence {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  line-height: 1.8;
  color: #1f2937;
}

.blank-input {
  padding: 8px 12px;
  min-width: 120px;
  border: none;
  border-bottom: 2px solid #3b82f6;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  text-align: center;
  outline: none;
  transition: all 200ms ease-in-out;

  &:focus {
    border-bottom-color: #0284c7;
    box-shadow: 0 2px 0 #0284c7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.correct {
    border-bottom-color: #10b981;
    box-shadow: 0 2px 0 #10b981;
    background: rgba(16, 185, 129, 0.05);
  }

  &.incorrect {
    border-bottom-color: #ef4444;
    box-shadow: 0 2px 0 #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }
}

.submit-button-container {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  padding: 10px 24px;
  background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease-in-out;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
}

.feedback-box {
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
  animation: slideIn 300ms ease-out;

  &.success {
    border-color: #10b981;
    background: #f0fdf4;
    color: #15803d;
  }

  &.error {
    border-color: #ef4444;
    background: #fef2f2;
    color: #7f1d1d;
  }
}

.feedback-message {
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 16px;
}

.feedback-explanation {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
}

.correct-answers {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid currentColor;
  opacity: 0.8;

  p {
    margin: 0 0 8px 0;
    font-weight: 600;
    font-size: 14px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    list-style: disc;

    li {
      font-size: 14px;
      line-height: 1.6;
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

```

### 4. _lesson.scss

```scss
@import './variables';
@import './mixins';

.lesson-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 2px solid $color-border;

  h2 {
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-primary;
    flex: 1;
  }
}

.lesson-close-btn {
  background: none;
  border: none;
  font-size: $font-size-xl;
  color: $color-text-secondary;
  cursor: pointer;
  padding: $spacing-xs;
  transition: all 200ms ease-in-out;
  display: none; // Redundant with quest-close-btn

  &:hover {
    color: $color-primary;
    transform: scale(1.2);
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
    border-radius: $radius-md;
  }
}

.lesson-content {
  flex: 1;
  color: $color-text-primary;
  line-height: 1.8;
  overflow-y: auto;
  max-height: 400px;
  padding-right: $spacing-sm;

  p {
    margin: 0 0 $spacing-md 0;
    font-size: $font-size-base;
    font-weight: $font-weight-normal;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.content-section {
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-lg;
  border-bottom: 1px solid $color-border;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  h3 {
    margin: 0 0 $spacing-md 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-primary;
  }

  p {
    margin: 0 0 $spacing-md 0;
    font-size: $font-size-base;
    line-height: 1.7;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.code-block {
  background: $color-bg-darker;
  color: #a1e3ff;
  padding: $spacing-md;
  border-radius: $radius-md;
  border-left: 4px solid $color-info;
  overflow-x: auto;
  margin: $spacing-md 0;
  font-family: $font-family-mono;
  font-size: $font-size-sm;
  line-height: 1.6;

  code {
    white-space: pre;
  }
}

.content-list {
  list-style: none;
  padding: 0;
  margin: $spacing-md 0;

  li {
    padding: $spacing-sm 0 $spacing-sm $spacing-lg;
    position: relative;
    font-size: $font-size-base;
    line-height: 1.6;

    &:before {
      content: '▸';
      position: absolute;
      left: 0;
      color: $color-primary;
      font-weight: bold;
    }
  }
}

.lesson-footer {
  display: flex;
  gap: $spacing-md;
  padding-top: $spacing-lg;
  border-top: 1px solid $color-border;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.lesson-close-btn-secondary,
.lesson-start-quiz-btn {
  padding: $spacing-sm $spacing-lg;
  border: none;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.lesson-close-btn-secondary {
  background: $color-border;
  color: $color-text-primary;

  &:hover {
    background: #d1d5db;
  }
}

.lesson-start-quiz-btn {
  background: linear-gradient(90deg, $color-primary 0%, #0284c7 100%);
  color: white;
  min-width: 140px;

  &:hover {
    background: linear-gradient(90deg, #2563eb 0%, #0369a1 100%);
  }
}

// Scrollbar for lesson content
.lesson-content {
  scrollbar-width: thin;
  scrollbar-color: $color-primary rgba(0, 0, 0, 0.05);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: $radius-full;
  }

  &::-webkit-scrollbar-thumb {
    background: $color-primary;
    border-radius: $radius-full;

    &:hover {
      background: $color-primary-dark;
    }
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .lesson-footer {
    flex-direction: column;

    .lesson-close-btn-secondary,
    .lesson-start-quiz-btn {
      width: 100%;
    }
  }
}

```

### 5. _mixins.scss

```scss
@import './variables';

// Flexbox utilities
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// Button reset
@mixin button-reset {
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: all $transition-base;

  &:focus {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

// Input reset
@mixin input-reset {
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  outline: none;
  transition: all $transition-base;

  &:focus {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

// Overlay (backdrop)
@mixin overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: $z-modal-backdrop;
  opacity: 0;
  transition: opacity $transition-base;

  &.show {
    opacity: 1;
  }
}

// Overlay show state (used as class)

// Modal animation
@mixin modal-slide-in {
  animation: slideInUp $transition-slow ease-out;
}

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

// Fade animation
@mixin fade-in {
  animation: fadeIn $transition-base ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Text truncation
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin truncate-lines($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Responsive utilities
@mixin tablet-up {
  @media (min-width: 768px) {
    @content;
  }
}

@mixin desktop-up {
  @media (min-width: 1024px) {
    @content;
  }
}

@mixin mobile-only {
  @media (max-width: 767px) {
    @content;
  }
}

// Scrollbar styling
@mixin scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: $color-primary-light rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: $color-primary;
    border-radius: $radius-full;

    &:hover {
      background: $color-primary-dark;
    }
  }
}

// Focus visible ring
@mixin focus-ring {
  outline: 2px solid $color-primary;
  outline-offset: 2px;
  border-radius: $radius-md;
}

// Gradient background
@mixin gradient-bg($angle: 135deg, $color1: $color-primary, $color2: $color-secondary) {
  background: linear-gradient($angle, $color1, $color2);
}

```

### 6. _multiple-choice.scss

```scss
@import './variables';
@import './mixins';

.multiple-choice-question {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.question-text {
  h3 {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    line-height: 1.6;
  }
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.option-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  padding: $spacing-md;
  background: white;
  border: 2px solid $color-border;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  text-align: left;

  &:hover:not(:disabled) {
    border-color: $color-primary;
    background: $color-primary-light;
    transform: translateX(4px);
  }

  &:active:not(:disabled) {
    transform: translateX(2px);
  }

  &.selected:not(:disabled) {
    border-color: $color-info;
    background: #f0f9ff;
  }

  &.correct {
    border-color: $color-success;
    background: #f0fdf4;
  }

  &.incorrect {
    border-color: $color-error;
    background: #fef2f2;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.option-text {
  flex: 1;
  word-break: break-word;
}

.option-check {
  font-size: $font-size-lg;
  font-weight: bold;
  flex-shrink: 0;

  .option-button.correct & {
    color: $color-success;
  }

  .option-button.incorrect & {
    color: $color-error;
  }
}

.feedback-box {
  padding: $spacing-md;
  border-radius: $radius-lg;
  border-left: 4px solid;
  animation: slideIn 300ms ease-out;

  &.success {
    border-color: $color-success;
    background: #f0fdf4;
    color: #15803d;
  }

  &.error {
    border-color: $color-error;
    background: #fef2f2;
    color: #7f1d1d;
  }
}

.feedback-message {
  margin: 0 0 $spacing-sm 0;
  font-weight: $font-weight-semibold;
  font-size: $font-size-base;
}

.feedback-explanation {
  margin: 0;
  font-size: $font-size-sm;
  line-height: 1.6;
  opacity: 0.9;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive
@media (max-width: 480px) {
  .option-button {
    padding: $spacing-sm;
    font-size: $font-size-sm;
  }

  .question-text h3 {
    font-size: $font-size-base;
  }
}

```

### 7. _quest-popup.scss

```scss
@import './variables';
@import './mixins';

.quest-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  opacity: 0;
  transition: opacity 200ms ease-in-out;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-lg;

  &.show {
    opacity: 1;
    pointer-events: auto;
  }
}

.quest-popup {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-radius: $radius-xl;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 2001;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  animation: slideInUp 300ms ease-out;
  pointer-events: auto;

  @include tablet-up {
    max-width: 700px;
  }

  @include mobile-only {
    max-width: calc(100% - 32px);
  }
}

.quest-close-btn {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $color-primary;
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: $font-size-lg;
  cursor: pointer;
  z-index: 10;
  transition: all 200ms ease-in-out;

  &:hover {
    background: $color-primary-dark;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

.quest-content {
  padding: $spacing-2xl $spacing-lg $spacing-lg;

  @include mobile-only {
    padding: $spacing-xl $spacing-md $spacing-md;
  }

  &.lesson {
    animation: fadeIn 200ms ease-in;
  }

  &.quiz {
    animation: fadeIn 200ms ease-in;
  }
}

// Animations
@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Scrollbar customization
.quest-popup {
  scrollbar-width: thin;
  scrollbar-color: $color-primary-light rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: $radius-full;
  }

  &::-webkit-scrollbar-thumb {
    background: $color-primary;
    border-radius: $radius-full;

    &:hover {
      background: $color-primary-dark;
    }
  }
}

```

### 8. _quiz-results.scss

```scss
@import './variables';
@import './mixins';

.quiz-results-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  animation: fadeIn 300ms ease-in;

  &.excellent {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  &.good {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  &.fair {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  &.poor {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
}

.results-header {
  width: 100%;
  text-align: center;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);

  h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
  }
}

.score-display {
  position: relative;
}

.score-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: popIn 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.score-percentage {
  font-size: 56px;
  font-weight: 700;
  color: white;
}

.score-details {
  text-align: center;

  h3 {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }
}

.score-breakdown {
  display: flex;
  gap: 32px;
  justify-content: center;
}

.score-info {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.score-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score-value {
  font-size: 24px;
  font-weight: 700;

  &.correct {
    color: #10b981;
  }

  &.total {
    color: #3b82f6;
  }
}

.results-status {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  text-align: center;

  .status-passed {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .status-failed {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
}

.status-message {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.status-note {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.results-footer {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.results-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  min-width: 140px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
}

.retry-btn {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  color: white;

  &:hover {
    background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  }
}

.back-btn {
  background: #e5e7eb;
  color: #1f2937;

  &:hover {
    background: #d1d5db;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 480px) {
  .score-breakdown {
    flex-direction: column;
    gap: 16px;
  }

  .results-btn {
    width: 100%;
  }
}

```

### 9. _quiz.scss

```scss
@import './variables';
@import './mixins';

.quiz-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 2px solid $color-border;

  h2 {
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-primary;
    flex: 1;
  }
}

.quiz-meta {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
}

.quiz-question-number {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
  background: $color-primary-light;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-md;
}

.quiz-progress {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: $color-border;
  border-radius: $radius-full;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-primary 0%, $color-secondary 100%);
  border-radius: $radius-full;
  transition: width 500ms ease-in-out;
}

.progress-text {
  min-width: 50px;
  text-align: right;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.quiz-content {
  flex: 1;
  padding: $spacing-lg;
  background: $color-bg-light;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  min-height: 300px;
}

.quiz-footer {
  display: flex;
  gap: $spacing-md;
  padding-top: $spacing-lg;
  border-top: 1px solid $color-border;
  justify-content: flex-start;
}

.back-btn {
  padding: $spacing-sm $spacing-lg;
  background: $color-border;
  color: $color-text-primary;
  border: none;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all 200ms ease-in-out;

  &:hover {
    background: #d1d5db;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

```

### 10. _variables.scss

```scss
// Color Palette
$color-primary: #3b82f6;      // Blue
$color-primary-dark: #1e40af;
$color-primary-light: #dbeafe;
$color-secondary: #10b981;    // Green
$color-success: #10b981;
$color-error: #ef4444;        // Red
$color-warning: #f59e0b;      // Amber
$color-info: #0ea5e9;         // Sky

$color-bg-dark: #0d1b2a;      // Very dark
$color-bg-darker: #1e3a5f;    // Dark blue
$color-bg-light: #f8fafc;     // Light
$color-text-primary: #1f2937;
$color-text-secondary: #6b7280;
$color-text-light: #e0eaff;
$color-border: #e5e7eb;

// Typography
$font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
$font-family-mono: 'Courier New', monospace;

$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
$font-size-2xl: 32px;

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;

// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 9999px;

// Shadows
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
$shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.15);

// Transitions
$transition-fast: 150ms ease-in-out;
$transition-base: 200ms ease-in-out;
$transition-slow: 300ms ease-in-out;

// Z-index layers
$z-background: 0;
$z-dropdown: 100;
$z-sticky: 500;
$z-fixed: 1000;
$z-modal-backdrop: 2000;
$z-modal: 2001;
$z-tooltip: 3000;

```

---

## Summary

**Total Components:** 7

**Total Hooks:** 1

**Total Stylesheets:** 10

**Generated on:** 11/28/2025, 1:58:55 PM
