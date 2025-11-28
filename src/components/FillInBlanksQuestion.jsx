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
