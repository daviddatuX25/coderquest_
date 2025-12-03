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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;
  const hasAnswered = answers.some(a => a.questionIndex === currentQuestionIndex);

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
  };

  const handleNextQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowResults(true);
      }
      setIsTransitioning(false);
    }, 300);
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
        onSubmit={onComplete}
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

      <div className={`quiz-content ${isTransitioning ? 'transitioning' : ''}`}>
        {currentQuestion.type === 'multipleChoice' && (
          <MultipleChoiceQuestion
            key={`mc-${currentQuestionIndex}`}
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={false}
          />
        )}

        {currentQuestion.type === 'fillInBlanks' && (
          <FillInBlanksQuestion
            key={`fib-${currentQuestionIndex}`}
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
        {hasAnswered && (
          <button 
            className="next-btn" 
            onClick={handleNextQuestion}
            disabled={isTransitioning}
          >
            {isLastQuestion ? 'See Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
