import React, { useState, useEffect } from 'react';
import { useGameEventEmitter } from '../hooks/useGameEvents';
import { completeQuest, getProgress, isQuestCompleted, isLevelCompleted, completeLevel, getLevelCompletionPercentage, getLessonToGameQuestMapping } from '../data/progressManager';
import { getNormalizedQuests } from '../data/questNormalizer';
import '../styles/_quest-level.scss';

/**
 * QuestLevelUI Component
 * Standalone UI for lessons and quizzes without the game
 * Provides a clean, focused learning interface
 */
function QuestLevelUI() {
  const [segments, setSegments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlocked, setUnlocked] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [correctMap, setCorrectMap] = useState({});
  const [qaIndex, setQaIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toggleMobileNav, setToggleMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { emit } = useGameEventEmitter();

  // Expose progress checker to window for console access
  useEffect(() => {
    window.coderquestStatus = () => {
      const progress = getProgress();
      const allQuests = getNormalizedQuests();
      const completed = Object.keys(progress.completedQuests).length;
      const inProgress = Object.keys(progress.questResults).length;
      
      console.group('📊 CODERQUEST PROGRESS STATUS');
      console.log('✅ Completed Items:', completed);
      console.log('🔄 In Progress Items:', inProgress);
      console.log('📈 Completion:', `${completed}/${allQuests.length}`);
      console.log('');
      console.group('📚 Lessons & Quizzes:');
      allQuests.forEach((quest, idx) => {
        const isComp = !!progress.completedQuests[quest.seg_name];
        const isIP = !!progress.questResults[quest.seg_name];
        const status = isComp ? '✅' : isIP ? '🔄' : '🆕';
        const type = quest.type === 'topic' ? '📖' : '❓';
        console.log(`  ${status} [${idx + 1}] ${type} ${quest.title || quest.seg_name}`);
      });
      console.groupEnd();
      
      console.log('');
      console.log('Completed Quests:', progress.completedQuests);
      console.log('Quest Results (attempts):', progress.questResults);
      console.log('Quest Scores:', progress.questScores);
      console.groupEnd();
    };
    
    // Also expose game mode sync checker
    window.checkGameModeSync = () => {
      const progress = getProgress();
      const { getLessonToGameQuestMapping } = require('../data/progressManager');
      const mapping = getLessonToGameQuestMapping();
      
      console.group('🎮 GAME MODE SYNC CHECK');
      console.log('Lesson Mode Completed:', Object.keys(progress.completedQuests));
      console.log('');
      console.log('Lesson→Game Mapping:');
      Object.entries(mapping).forEach(([lessonQuest, gameQuest]) => {
        const isCompleted = !!progress.completedQuests[lessonQuest];
        console.log(`  ${isCompleted ? '✅' : '❌'} ${lessonQuest} → ${gameQuest}`);
      });
      console.groupEnd();
    };
  }, []);

  // Load sample quest data
  useEffect(() => {
    loadSampleQuest();
    window.addEventListener('resize', handleResize);
    
    // Disable Phaser input when entering lesson mode
    emit('inputDisabled', { reason: 'lesson-mode' });
    
    // Listen for progress updates via custom event
    // Game mode emits 'progressUpdated' when it syncs quests back to progressManager
    const handleProgressUpdate = (event) => {
      console.log('🔄 [Focus Mode] Progress updated from game mode:', event.detail);
      // Reload progress immediately
      loadSampleQuest();
    };
    
    window.addEventListener('progressUpdated', handleProgressUpdate);
    
    // Also listen to localStorage changes for cross-tab synchronization
    const handleStorageChange = (e) => {
      if (e.key === 'coderquest_progress') {
        console.log('💾 [Focus Mode] Progress storage updated (cross-tab)');
        loadSampleQuest();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('progressUpdated', handleProgressUpdate);
      window.removeEventListener('storage', handleStorageChange);
      // Re-enable Phaser input when leaving lesson mode
      emit('inputEnabled', { reason: 'lesson-mode-exit' });
    };
  }, [emit]);

  const currentSegment = segments[currentIndex];

  // Log state changes for debugging
  useEffect(() => {
    if (currentSegment) {
      const segmentType = currentSegment.type === 'topic' ? '📚 LESSON' : '❓ QUIZ';
      const segmentTitle = currentSegment.title || currentSegment.seg_name;
      const progress = getProgress();
      const isCompleted = !!progress.completedQuests[currentSegment.seg_name];
      const isInProgress = !!progress.questResults[currentSegment.seg_name];
      
      console.log(`${segmentType}: "${segmentTitle}"`, {
        index: currentIndex,
        segName: currentSegment.seg_name,
        type: currentSegment.type,
        status: isCompleted ? '✅ COMPLETED' : isInProgress ? '🔄 IN PROGRESS' : '🆕 NOT STARTED',
        position: `${currentIndex + 1} of ${segments.length}`,
        unlockedCount: Object.values(unlocked).filter(Boolean).length
      });
    }
  }, [currentIndex, segments, unlocked]);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const loadSampleQuest = () => {
    // Load normalized quests from data file
    // This ensures consistency between game mode and lesson mode
    const allQuests = getNormalizedQuests();
    
    setSegments(allQuests);
    // Initialize unlocked state with proper progression gating
    const progress = getProgress();
    const mapping = getLessonToGameQuestMapping();
    
    const unlockedState = {};
    
    unlockedState[0] = true; // First item always unlocked
    
    // Unlock logic:
    // An item is unlocked if:
    // 1. PREVIOUS item is completed (traditional linear progression), OR
    // 2. Current item's corresponding quest is in progress (user can retry), OR
    // 3. Current item's topic quest is completed (game mode completed it, shows in focus mode)
    for (let i = 1; i < allQuests.length; i++) {
      const prevQuest = allQuests[i - 1];
      const currentQuest = allQuests[i];
      
      // Check if previous is completed
      const prevCompleted = !!progress.completedQuests[prevQuest.seg_name];
      
      // Check if current is in progress (user has attempted it)
      const isInProgress = !!progress.questResults[currentQuest.seg_name];
      
      // NEW: Check if this segment's game mode quest is completed
      // This happens when game mode completes a quest and syncs to focus mode
      const gameQuestCompleted = mapping[currentQuest.seg_name] && 
        !!progress.completedQuests[mapping[currentQuest.seg_name]];
      
      unlockedState[i] = prevCompleted || isInProgress || gameQuestCompleted;
      
      if (i < 6) {
        console.log(`  [Unlock ${i}] ${currentQuest.seg_name}: prevCompleted=${prevCompleted}, inProgress=${isInProgress}, gameQuestCompleted=${gameQuestCompleted}, unlocked=${unlockedState[i]}`);
      }
      
      if (gameQuestCompleted) {
        console.log(`    ✅ [Focus] Unlocked by game mode: ${currentQuest.seg_name} (mapped from ${mapping[currentQuest.seg_name]})`);
      }
    }
    
    console.log('🔓 Unlock state initialized:', { 
      unlockedState, 
      allQuestsLength: allQuests.length, 
      completedQuests: progress.completedQuests,
      questResults: progress.questResults,
      mapping
    });
    
    // Debug: show what quizzes have been completed
    console.log('📋 Completed items in focus mode:');
    allQuests.forEach((q, idx) => {
      const isCompleted = !!progress.completedQuests[q.seg_name];
      if (isCompleted && idx < 10) {
        console.log(`  ✅ [${idx}] ${q.seg_name}`);
      }
    });
    
    setUnlocked(unlockedState);
    
    // Auto-advance to next incomplete segment only if current segment is completed
    // This handles when game mode completes a quiz and focus mode needs to move forward
    setCurrentIndex((prevIndex) => {
      const prevSegment = allQuests[prevIndex];
      const prevSegmentType = prevSegment.type;
      
      // Check if the current segment is already completed
      let isCurrentCompleted = !!progress.completedQuests[prevSegment.seg_name];
      
      // Special case: if current is a TOPIC, check if its paired QUIZ is completed
      // Topics don't get completed directly - only their paired quizzes do
      if (!isCurrentCompleted && prevSegmentType === 'topic') {
        // Look for the next quiz segment
        const nextQuiz = allQuests[prevIndex + 1];
        if (nextQuiz && nextQuiz.type.startsWith('quiz-')) {
          // Check if this quiz is completed
          const quizCompleted = !!progress.completedQuests[nextQuiz.seg_name];
          const gameQuestCompleted = mapping[nextQuiz.seg_name] && 
            !!progress.completedQuests[mapping[nextQuiz.seg_name]];
          
          isCurrentCompleted = quizCompleted || gameQuestCompleted;
          
          if (isCurrentCompleted) {
            console.log(`📍 [Focus] Current topic's quiz is completed: ${nextQuiz.seg_name}`);
          }
        }
      }
      
      if (!isCurrentCompleted) {
        // Current segment not done, stay on it
        console.log(`📍 [Focus] Staying on current segment (not completed): ${prevSegment.seg_name}`);
        return prevIndex;
      }
      
      // Current is completed, find next incomplete unlocked segment
      for (let i = prevIndex + 1; i < allQuests.length; i++) {
        const quest = allQuests[i];
        const isCompleted = !!progress.completedQuests[quest.seg_name];
        const isUnlocked = unlockedState[i];
        
        // If this segment is unlocked and NOT completed, advance to it
        if (isUnlocked && !isCompleted) {
          console.log(`📍 [Focus] Auto-advancing from ${prevSegment.seg_name} to ${quest.seg_name}`);
          return i;
        }
      }
      
      // All segments completed or locked, stay at current
      console.log(`📍 [Focus] No more segments to advance to`);
      return prevIndex;
    });
    setQaIndex(0);
  };

  const selectSegment = (idx) => {
    console.log('🔀 selectSegment called:', { idx, isUnlocked: unlocked[idx], unlocked });
    if (unlocked[idx]) {
      console.log('✅ Segment unlocked - setting index to', idx);
      setCurrentIndex(idx);
      setQaIndex(0);
      setToggleMobileNav(false);
    } else {
      console.log('🔒 Segment locked - cannot select', idx);
    }
  };

  const selectChoice = (qid, ci) => {
    setUserAnswers({ ...userAnswers, [qid]: ci });
  };

  const submitCurrent = () => {
    if (!currentSegment || !currentSegment['quiz-data']) return;

    const questions = currentSegment['quiz-data'].questions;
    const currentQuestion = questions[qaIndex];
    
    if (!currentQuestion) return;

    // Check if current question is answered
    if (userAnswers[currentQuestion.qid] === undefined) return;

    // Check if answer is correct
    const userAnswer = userAnswers[currentQuestion.qid];
    const isCorrect = userAnswer === currentQuestion.answer || 
                      (typeof userAnswer === 'string' && userAnswer.toLowerCase().replace(/\s+/g, ' ').trim() === 
                       currentQuestion.answer.toLowerCase().replace(/\s+/g, ' ').trim());
    
    // Mark this question as submitted and store result
    setSubmitted({ ...submitted, [currentQuestion.qid]: true });
    setCorrectMap({ ...correctMap, [currentQuestion.qid]: isCorrect });
  };

  // Move to next question in quiz (or next segment if quiz complete)
  const nextQuestion = () => {
    if (!currentSegment || !currentSegment['quiz-data']) return;

    const questions = currentSegment['quiz-data'].questions;
    const currentQuestion = questions[qaIndex];
    
    // Can only move to next question if current is submitted (regardless of correctness)
    if (!submitted[currentQuestion.qid]) return;

    // If there are more questions in this quiz, go to next
    if (qaIndex < questions.length - 1) {
      setQaIndex(qaIndex + 1);
      return;
    }

    // Otherwise, quiz is complete - save progress and move to next segment
    const totalQuestions = questions.length;
    const correctCount = Object.values(correctMap).filter(Boolean).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // Save progress to localStorage
    completeQuest(currentSegment.seg_name, score, correctMap);
    
    emit('questCompleted', { 
      questId: currentSegment.seg_name,
      score,
      results: correctMap
    });
    
    // Recalculate unlocked states from saved progress
    // This ensures the next topic unlocks after quiz completion
    setTimeout(() => {
      const updatedProgress = getProgress();
      const newUnlocked = { ...unlocked };
      
      console.log('📝 Quiz completed, recalculating unlocks:', {
        completedQuests: updatedProgress.completedQuests,
        currentSegmentName: currentSegment.seg_name
      });
      
      // Recalculate which segments should be unlocked
      // Use same logic as loadSampleQuest: previous completed OR current in progress
      for (let i = 0; i < segments.length; i++) {
        if (i === 0) {
          newUnlocked[i] = true; // First always unlocked
        } else {
          const prevQuest = segments[i - 1];
          const currentQuest = segments[i];
          
          // Check if previous is completed
          const prevCompleted = !!updatedProgress.completedQuests[prevQuest.seg_name];
          
          // Check if current is in progress (user has attempted it)
          const isInProgress = !!updatedProgress.questResults[currentQuest.seg_name];
          
          newUnlocked[i] = prevCompleted || isInProgress;
          
          console.log(`📊 [${i}] ${currentQuest.seg_name} -> prev ${prevQuest.seg_name} completed? ${prevCompleted}, in progress? ${isInProgress}`);
        }
      }
      
      console.log('✅ New unlock states:', newUnlocked);
      setUnlocked(newUnlocked);
    }, 0);
    
    // Check if this completes a level
    // Get fresh data to check current progress
    const currentProgress = getProgress();
    if (isLevelCompleted(segments)) {
      // All quizzes in this level are now complete
      completeLevel(1); // Mark Level 1 as complete
      emit('levelCompleted', { levelId: 1 });
    }
    
    // Move to next segment
    if (currentIndex < segments.length - 1) {
      selectSegment(currentIndex + 1);
    }
  };

  const isQuizSegment = currentSegment && currentSegment.type.startsWith('quiz-');
  const currentQuestion = isQuizSegment ? currentSegment['quiz-data']?.questions[qaIndex] : null;
  const isCurrentQuestionAnswered = currentQuestion && userAnswers[currentQuestion.qid] !== undefined;
  const isCurrentQuestionSubmitted = currentQuestion && submitted[currentQuestion.qid];
  const isCurrentQuestionCorrect = currentQuestion && correctMap[currentQuestion.qid];
  
  const hasPrev = currentIndex > 0;
  
  const canProceedToNextSegment = () => {
    // If already at the last segment, can't proceed further
    if (currentIndex >= segments.length - 1) {
      console.log('❌ canProceed: Already at last segment', { currentIndex, length: segments.length });
      return false;
    }
    
    // Check if CURRENT segment is a quiz
    const isCurrentQuiz = currentSegment && currentSegment.type.startsWith('quiz-');
    console.log('📋 canProceed check:', {
      currentIndex,
      segmentType: currentSegment?.type,
      isCurrentQuiz,
      segmentName: currentSegment?.seg_name
    });
    
    // If current segment is a quiz, all questions must be answered correctly
    if (isCurrentQuiz && currentSegment['quiz-data']) {
      const questions = currentSegment['quiz-data'].questions;
      // All questions must be submitted and correct
      const allSubmitted = questions.every(q => submitted[q.qid]);
      const allCorrect = questions.every(q => correctMap[q.qid] === true);
      const incorrectCount = questions.filter(q => submitted[q.qid] && correctMap[q.qid] === false).length;
      
      console.log('🎯 Quiz segment check:', {
        allSubmitted,
        allCorrect,
        incorrectCount,
        questionsCount: questions.length,
        submittedCount: Object.keys(submitted).length,
        correctCount: Object.keys(correctMap).filter(k => correctMap[k]).length
      });
      
      // Store retry message for UI
      if (!allSubmitted) {
        window.proceedMessage = '📝 Answer all questions first';
      } else if (!allCorrect) {
        window.proceedMessage = `❌ Fix ${incorrectCount} incorrect answer${incorrectCount > 1 ? 's' : ''} to proceed`;
      }
      
      return allSubmitted && allCorrect;
    }
    
    // Topic/intro segments can proceed freely
    console.log('✅ canProceed: Topic segment - can proceed');
    window.proceedMessage = '';
    return true;
  };

  const prev = () => {
    if (hasPrev) selectSegment(currentIndex - 1);
  };

  const next = () => {
    const canProceed = canProceedToNextSegment();
    console.log('🔘 Next button clicked - canProceed:', canProceed);
    if (canProceed) {
      console.log('➡️ Moving to segment:', currentIndex + 1);
      
      // If current segment is a topic (not a quiz), mark it as completed
      if (currentSegment && currentSegment.type === 'topic') {
        console.log('📚 Marking topic as completed:', currentSegment.seg_name);
        completeQuest(currentSegment.seg_name, 100, {}); // Topics get 100% as they're just lessons
        
        // Recalculate unlocks after marking topic complete
        // Use setTimeout to ensure localStorage is synced
        setTimeout(() => {
          const updatedProgress = getProgress();
          const newUnlocked = { ...unlocked };
          
          for (let i = 0; i < segments.length; i++) {
            if (i === 0) {
              newUnlocked[i] = true; // First always unlocked
            } else {
              const prevQuest = segments[i - 1];
              const currentQuest = segments[i];
              
              // Check if previous is completed
              const prevCompleted = !!updatedProgress.completedQuests[prevQuest.seg_name];
              
              // Check if current is in progress (user has attempted it)
              const isInProgress = !!updatedProgress.questResults[currentQuest.seg_name];
              
              newUnlocked[i] = prevCompleted || isInProgress;
            }
          }
          console.log('🔄 Unlocks updated after topic completion:', newUnlocked);
          setUnlocked(newUnlocked);
        }, 0);
      }
      
      selectSegment(currentIndex + 1);
    } else {
      console.log('❌ Cannot proceed - button should be disabled');
    }
  };

  return (
    <div className="quest-level-ui">
      {/* Header */}
      <header className="ql-header">
        <button 
          className="icon-btn hamburger" 
          onClick={() => setToggleMobileNav(!toggleMobileNav)}
          style={{ display: isMobile ? 'block' : 'none' }}
        >
          ☰
        </button>

        <div className="ql-title">
          Lessons & Quizzes
        </div>

        <div className="ql-top-controls">
          {!isMobile && (
            <button 
              className="icon-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title="Toggle sidebar"
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          )}
        </div>
      </header>

      {/* Mobile dropdown */}
      {toggleMobileNav && (
        <div className="ql-mobile-dropdown">
          <div className="ql-dropdown-panel">
            <div className="ql-dropdown-header">
              <strong>Lessons</strong>
              <button 
                className="icon-btn" 
                onClick={() => setToggleMobileNav(false)}
              >
                ✕
              </button>
            </div>
            <nav>
              <ul className="ql-nav-list">
                {segments.map((seg, idx) => (
                  <li 
                    key={idx}
                    className={`ql-nav-item ${currentIndex === idx ? 'active' : ''} ${unlocked[idx] ? '' : 'locked'}`}
                    onClick={() => selectSegment(idx)}
                  >
                    <div className="ql-nav-item-content">
                      <div className="ql-nav-icon">
                        {seg.type.startsWith('quiz') ? '❓' : '📖'}
                      </div>
                      <div>
                        <div className="ql-nav-type">
                          {seg.type.includes('quiz-') ? 'Quiz' : 'Lesson'}
                        </div>
                        <div className="ql-nav-title small">
                          {seg.title}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <div className="ql-container">
        {/* Sidebar */}
        {!isMobile && (
          <aside className={`ql-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <nav className="ql-panel ql-nav-panel">
              <ul className="ql-nav-list">
                {segments.map((seg, idx) => (
                  <li 
                    key={idx}
                    className={`ql-nav-item ${currentIndex === idx ? 'active' : ''} ${unlocked[idx] ? '' : 'locked'}`}
                    onClick={() => selectSegment(idx)}
                    tabIndex="0"
                  >
                    <div className="ql-nav-item-content">
                      <div className="ql-nav-icon">
                        {seg.type.startsWith('quiz') ? '❓' : '📖'}
                      </div>
                      <div className="ql-nav-label">
                        <div className="ql-nav-type">
                          {seg.type.includes('quiz-') ? 'Quiz' : 'Lesson'}
                        </div>
                        <div className="small">
                          {seg.title}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            {/* NPC Avatar at bottom */}
            <div className="ql-panel ql-npc-pin">
              <div className="ql-avatar">
                <div style={{ fontSize: '3rem' }}>📚</div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="ql-main">
          <section className="ql-content-area">
            {segments.length === 0 && (
              <div className="small">Loading content...</div>
            )}

            {/* Topic */}
            {currentSegment && currentSegment.type === 'topic' && (
              <div>
                <h2 style={{ color: '#3b82f6' }}>{currentSegment.title}</h2>
                <div className="small" dangerouslySetInnerHTML={{ __html: currentSegment.content }} />
              </div>
            )}

            {/* Multiple Choice Quiz */}
            {currentSegment && currentSegment.type === 'quiz-multichoice' && (
              <div>
                <h2 style={{ color: '#3b82f6' }}>{currentSegment.title}</h2>
                {currentSegment['quiz-data'].questions.map((q, qi) => (
                  <div 
                    key={q.qid}
                    className="ql-question"
                    style={{ display: qaIndex === qi ? 'block' : 'none' }}
                  >
                    <div className="ql-question-text">{(qi + 1) + '. ' + q.question}</div>

                    <div className="ql-choices">
                      {q.choices.map((c, ci) => (
                        <div
                          key={ci}
                          className={`ql-choice ${userAnswers[q.qid] === ci ? 'selected' : ''}`}
                          onClick={() => selectChoice(q.qid, ci)}
                          role="button"
                          tabIndex="0"
                        >
                          <div>{c}</div>
                        </div>
                      ))}
                    </div>

                    <div className="ql-question-progress small">
                      Question {(qi + 1) + '/' + currentSegment['quiz-data'].questions.length}
                    </div>

                    {submitted[q.qid] && (
                      <div className={`ql-result ${correctMap[q.qid] ? 'correct' : 'incorrect'}`}>
                        <div>{correctMap[q.qid] ? '✓ Correct' : '✗ Incorrect'}</div>
                        {!correctMap[q.qid] && (
                          <div className="small">Answer: {q.answerDisplay || q.answer}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Identification/Fill Blanks Quiz */}
            {currentSegment && (currentSegment.type === 'quiz-identification' || currentSegment.type === 'quiz-fillblanks') && (
              <div>
                <h2 style={{ color: '#3b82f6' }}>{currentSegment.title}</h2>
                {currentSegment['quiz-data'].questions.map((q, qi) => (
                  <div 
                    key={q.qid}
                    className="ql-question"
                    style={{ display: qaIndex === qi ? 'block' : 'none' }}
                  >
                    <div className="ql-question-text">{(qi + 1) + '. ' + q.question}</div>

                    <input 
                      type="text" 
                      className="ql-input-answer"
                      placeholder="Type answer"
                      value={userAnswers[q.qid] || ''}
                      onChange={(e) => setUserAnswers({ ...userAnswers, [q.qid]: e.target.value })}
                    />

                    {submitted[q.qid] && (
                      <div className={`ql-result ${correctMap[q.qid] ? 'correct' : 'incorrect'}`}>
                        <div>{correctMap[q.qid] ? '✓ Correct' : '✗ Incorrect'}</div>
                        {!correctMap[q.qid] && (
                          <div className="small">Answer: {q.answerDisplay || q.answer}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Desktop Controls */}
          <div className="ql-controls-desktop">
            <div>
              <button className="ql-btn" onClick={prev} disabled={!hasPrev}>
                ← Go back
              </button>
            </div>

            <div className="ql-controls">
              {isQuizSegment && !isCurrentQuestionSubmitted && (
                <button 
                  className="ql-btn ql-important"
                  onClick={submitCurrent}
                  disabled={!isCurrentQuestionAnswered}
                  title={!isCurrentQuestionAnswered ? "Answer the question first" : "Submit your answer"}
                >
                  Submit
                </button>
              )}
              {isQuizSegment && isCurrentQuestionSubmitted && (
                <button 
                  className="ql-btn ql-primary"
                  onClick={nextQuestion}
                  title={!isCurrentQuestionCorrect ? `Correct answer: ${currentSegment['quiz-data'].questions[qaIndex].answerDisplay || currentSegment['quiz-data'].questions[qaIndex].answer}` : ""}
                >
                  {qaIndex < currentSegment['quiz-data'].questions.length - 1 ? "Next Question →" : "Complete Quiz →"}
                </button>
              )}
              {!isQuizSegment && (
                <button 
                  className="ql-btn ql-primary"
                  onClick={next}
                  disabled={!canProceedToNextSegment()}
                  title={!canProceedToNextSegment() ? window.proceedMessage || "Complete this lesson first" : ""}
                >
                  Proceed →
                </button>
              )}
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="ql-footer-mobile ql-panel">
            <div className="ql-footer-content">
              <button className="ql-btn" onClick={prev} disabled={!hasPrev}>
                Go back
              </button>
              {isQuizSegment && !isCurrentQuestionSubmitted && (
                <button 
                  className="ql-btn ql-important"
                  onClick={submitCurrent}
                  disabled={!isCurrentQuestionAnswered}
                >
                  Submit
                </button>
              )}
              {isQuizSegment && isCurrentQuestionSubmitted && (
                <button 
                  className="ql-btn ql-primary"
                  onClick={nextQuestion}
                >
                  {qaIndex < currentSegment['quiz-data'].questions.length - 1 ? "Next" : "Complete"}
                </button>
              )}
              {!isQuizSegment && (
                <button className="ql-btn ql-primary" onClick={next} disabled={!canProceedToNextSegment()}>
                  Proceed
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuestLevelUI;
