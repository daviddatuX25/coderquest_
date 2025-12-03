import React, { useState } from 'react';
import { useGameEventListener, useGameEventEmitter } from '../hooks/useGameEvents';
import '../styles/_level-transition.scss';

/**
 * LevelTransitionUI Component
 * Shows when player reaches end-of-level trigger zone
 * Allows player to proceed to next level or stay in current level
 */
function LevelTransitionUI() {
  const [showTransition, setShowTransition] = useState(false);
  const [transitionData, setTransitionData] = useState(null);
  const { emit } = useGameEventEmitter();

  // Listen for level transition ready event
  useGameEventListener('levelTransitionReady', (data) => {
    console.log('🎯 LevelTransitionUI: Transition ready', data);
    const nextLevel = getNextLevel(data.currentLevel);
    setTransitionData({
      ...data,
      nextLevel
    });
    setShowTransition(true);
  });

  // Listen for transition canceled event
  useGameEventListener('levelTransitionCanceled', (data) => {
    console.log('👈 LevelTransitionUI: Transition canceled', data);
    setShowTransition(false);
  });

  const getNextLevel = (currentLevel) => {
    const levelMap = {
      1: 2,
      2: 3,
      3: 1
    };
    return levelMap[currentLevel] || 1;
  };

  // Check if next level is available
  const isLevel2Available = () => {
    // Level 2 is under development in game mode
    // Only available in focus mode (lessons & quizzes)
    return transitionData?.nextLevel === 2;
  };

  const handleProceed = () => {
    if (transitionData && transitionData.nextLevel) {
      console.log(`🚀 Proceeding to Level ${transitionData.nextLevel}`);
      emit('transitionToLevel', { targetLevel: transitionData.nextLevel });
      setShowTransition(false);
    }
  };

  const handleStay = () => {
    console.log(`😊 Staying in Level ${transitionData?.currentLevel}`);
    emit('playerStayed', { 
      level: transitionData?.currentLevel,
      timestamp: Date.now()
    });
    setShowTransition(false);
  };

  if (!showTransition || !transitionData) {
    return null;
  }

  // Level 2 is under development in game mode
  if (isLevel2Available()) {
    return (
      <div className="level-transition-overlay">
        <div className="level-transition-container">
          <div className="level-transition-header">
            <h2>🚧 Level 2 - Under Development</h2>
            <p className="level-info">
              This level is currently being developed!
            </p>
          </div>

          <div className="level-transition-body">
            <div className="level-stats">
              <div className="stat-item">
                <span className="stat-label">Current Level:</span>
                <span className="stat-value">{transitionData.currentLevel}</span>
              </div>
            </div>

            <div className="level-message">
              <p>Level 2 is coming soon in Game Mode! 🔨</p>
              <p className="hint">💡 Tip: Try Focus Mode (📖 Lessons & Quizzes) to access all levels!</p>
              <p className="developer-note">You can keep exploring and mastering Level {transitionData.currentLevel} to prepare for Level 2!</p>
            </div>
          </div>

          <div className="level-transition-actions">
            <button 
              className="btn btn-stay"
              onClick={handleStay}
            >
              <span className="btn-icon">🏠</span>
              <span className="btn-text">Stay in Level {transitionData.currentLevel}</span>
            </button>
          </div>

          <div className="level-transition-footer">
            <small>Keep practicing to master Level {transitionData.currentLevel}!</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="level-transition-overlay">
      <div className="level-transition-container">
        <div className="level-transition-header">
          <h2>🎯 Level Complete!</h2>
          <p className="level-info">
            You've reached the end of Level {transitionData.currentLevel}
          </p>
        </div>

        <div className="level-transition-body">
          <div className="level-stats">
            <div className="stat-item">
              <span className="stat-label">Current Level:</span>
              <span className="stat-value">{transitionData.currentLevel}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Next Level:</span>
              <span className="stat-value">{transitionData.nextLevel}</span>
            </div>
          </div>

          <div className="level-message">
            <p>Are you ready to proceed to the next level?</p>
            <p className="hint">💡 Tip: Complete all quests in a level to learn more!</p>
          </div>
        </div>

        <div className="level-transition-actions">
          <button 
            className="btn btn-proceed"
            onClick={handleProceed}
          >
            <span className="btn-icon">🚀</span>
            <span className="btn-text">Proceed to Level {transitionData.nextLevel}</span>
          </button>
          
          <button 
            className="btn btn-stay"
            onClick={handleStay}
          >
            <span className="btn-icon">🏠</span>
            <span className="btn-text">Stay in Level {transitionData.currentLevel}</span>
          </button>
        </div>

        <div className="level-transition-footer">
          <small>Progress your JavaScript mastery through each level!</small>
        </div>
      </div>
    </div>
  );
}

export default LevelTransitionUI;
