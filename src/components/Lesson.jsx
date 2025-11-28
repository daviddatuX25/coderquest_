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
