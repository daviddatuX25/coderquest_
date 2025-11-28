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
