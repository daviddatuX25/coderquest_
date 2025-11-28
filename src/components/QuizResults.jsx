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
