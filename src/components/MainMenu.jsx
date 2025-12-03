import React, { useState, useEffect } from 'react';
import { useGameEventEmitter } from '../hooks/useGameEvents';
import { getProgress, getCurrentLevel, getLevelCompletionPercentage } from '../data/progressManager';
import { getAllQuests } from '../data/questsByLevel';
import { syncOnGameModeEnter, syncOnUIOnlyModeEnter } from '../data/modeSynchronizer';
import StatsPanel from './StatsPanel';
import AudioSettings from './AudioSettings';
import '../styles/_main-menu.scss';

/**
 * MainMenu Component
 * Provides main menu options with:
 * - Start Game / Resume Game
 * - Pause / Resume
 * - UI-Only Mode (lessons and quizzes without game)
 * - Settings
 * - Stats
 */
function MainMenu() {
  const [isOpen, setIsOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [gameMode, setGameMode] = useState('full'); // 'full' or 'ui-only'
  const [currentPage, setCurrentPage] = useState('menu'); // 'menu', 'stats', 'leaderboard', 'settings'
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const { emit } = useGameEventEmitter();

  // Navigation helpers
  const navigateTo = (page) => setCurrentPage(page);
  const backToMenu = () => setCurrentPage('menu');

  // Update level info when component mounts or menu opens
  useEffect(() => {
    const quests = getAllQuests();
    const level = getCurrentLevel(quests);
    const progress = getLevelCompletionPercentage(quests);
    setCurrentLevel(level);
    setLevelProgress(progress);
  }, [isOpen]);

  const handleStartGame = () => {
    const syncResult = syncOnGameModeEnter();
    setGameMode('full');
    setIsOpen(false);
    console.log('🎮 Starting Game Mode:', syncResult);
    emit('gameStarted', { mode: 'full', level: syncResult.level });
  };

  const handleFocusMode = () => {
    const syncResult = syncOnUIOnlyModeEnter();
    setGameMode('ui-only');
    setIsOpen(false);
    console.log('📖 Starting Focus Mode:', syncResult);
    emit('gameModeChanged', { mode: 'ui-only', level: syncResult.level });
  };

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      emit('gameResumed', {});
    } else {
      setIsPaused(true);
      emit('gamePaused', {});
    }
  };

  const handleOpenSettings = () => {
    navigateTo('settings');
  };

  const handleOpenStats = () => {
    navigateTo('stats');
  };

  const handleOpenLeaderboard = () => {
    navigateTo('leaderboard');
  };

  const handleExitGame = () => {
    setGameMode('full');
    setIsOpen(true);
    setIsPaused(false);
    emit('gameExited', {});
  };

  // UI-Only Mode - Show minimal button in corner
  if (gameMode === 'ui-only' && !isOpen) {
    return (
      <div className="main-menu-minimal">
        <button 
          className="menu-button-minimal"
          onClick={() => setIsOpen(true)}
          title="Open Main Menu"
        >
          ≡
        </button>
        {isOpen && (
          <div className="menu-modal-minimal">
            <div className="menu-panel">
              <h2>Focus Mode</h2>
              <p className="mode-description">Lessons and Quizzes only</p>
              
              <button 
                className="menu-action-btn primary"
                onClick={() => setIsOpen(false)}
              >
                Continue
              </button>
              
              <button 
                className="menu-action-btn secondary"
                onClick={handleExitGame}
              >
                Back to Main Menu
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Menu or Pause Menu
  if (!isOpen) {
    // Floating pause button
    return (
      <button 
        className="pause-button-floating"
        onClick={() => setIsOpen(true)}
        title="Open Menu"
      >
        ⏸
      </button>
    );
  }

  return (
    <div className="main-menu-overlay">
      <div className="main-menu-container">
        {/* Header */}
        <div className="menu-header">
          <h1 className="menu-title">CoderQuest</h1>
          {isPaused && <span className="pause-badge">PAUSED</span>}
        </div>

        {/* Main Menu Page */}
        {currentPage === 'menu' && (
          <div className="menu-content">
            {/* Greeting */}
            <div className="menu-greeting">
              {isOpen && !isPaused ? (
                <p>Welcome to CoderQuest!</p>
              ) : (
                <p>Game Paused</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="menu-buttons">
              {isPaused ? (
                <>
                  <button 
                    className="menu-action-btn primary large"
                    onClick={handleTogglePause}
                  >
                    ▶ Resume Game
                  </button>

                  <button 
                    className="menu-action-btn secondary large"
                    onClick={() => {
                      setIsOpen(false);
                      setIsPaused(false);
                    }}
                  >
                    Close Menu
                  </button>

                  <button 
                    className="menu-action-btn secondary"
                    onClick={handleOpenSettings}
                  >
                    ⚙ Settings
                  </button>

                  <button 
                    className="menu-action-btn danger"
                    onClick={handleExitGame}
                  >
                    🚪 Exit to Main Menu
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="menu-action-btn primary large"
                    onClick={handleStartGame}
                  >
                    🎮 Game Mode
                  </button>

                  <button 
                    className="menu-action-btn secondary"
                    onClick={handleFocusMode}
                  >
                    📖 Focus Mode
                  </button>

                  <button 
                    className="menu-action-btn secondary"
                    onClick={handleOpenStats}
                  >
                    📊 Stats
                  </button>

                  <button 
                    className="menu-action-btn secondary"
                    onClick={handleOpenLeaderboard}
                  >
                    🏆 Leaderboard
                  </button>

                  <button 
                    className="menu-action-btn secondary"
                    onClick={handleOpenSettings}
                  >
                    ⚙ Settings
                  </button>
                </>
              )}
            </div>

            {/* Mode Indicator */}
            <div className="menu-footer">
              <div className="level-info">
                <p className="level-badge">Level {currentLevel}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${levelProgress}%` }}></div>
                </div>
                <p className="progress-text">{levelProgress}% Complete</p>
              </div>
              {gameMode === 'full' && !isPaused && (
                <p className="mode-indicator">Ready for adventure!</p>
              )}
              {isPaused && (
                <p className="mode-indicator">Press ESC or click Resume to continue</p>
              )}
              {gameMode === 'ui-only' && (
                <p className="mode-indicator">Focus Mode: Explore lessons without the game</p>
              )}
            </div>
          </div>
        )}

        {/* Stats Page */}
        {currentPage === 'stats' && (
          <div className="menu-content page-stats">
            <div className="page-header">
              <h2>📊 Your Stats</h2>
              <p className="page-subtitle">Track your progress and achievements</p>
            </div>
            
            <StatsPanel />
            
            <div className="page-buttons">
              <button 
                className="menu-action-btn primary"
                onClick={backToMenu}
              >
                ← Back to Menu
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard Page */}
        {currentPage === 'leaderboard' && (
          <div className="menu-content page-leaderboard">
            <div className="page-header">
              <h2>🏆 Leaderboard</h2>
              <p className="page-subtitle">Top players worldwide</p>
            </div>
            
            <div className="leaderboard-container">
              <div className="leaderboard-list">
                <div className="leaderboard-item rank-1">
                  <div className="rank">🥇</div>
                  <div className="player-info">
                    <div className="player-name">CodeMaster</div>
                    <div className="player-score">2,450 points</div>
                  </div>
                  <div className="rank-number">1</div>
                </div>

                <div className="leaderboard-item rank-2">
                  <div className="rank">🥈</div>
                  <div className="player-info">
                    <div className="player-name">DebugNinja</div>
                    <div className="player-score">2,380 points</div>
                  </div>
                  <div className="rank-number">2</div>
                </div>

                <div className="leaderboard-item rank-3">
                  <div className="rank">🥉</div>
                  <div className="player-info">
                    <div className="player-name">SyntaxHero</div>
                    <div className="player-score">2,310 points</div>
                  </div>
                  <div className="rank-number">3</div>
                </div>

                <div className="leaderboard-item">
                  <div className="rank">4</div>
                  <div className="player-info">
                    <div className="player-name">ByteWizard</div>
                    <div className="player-score">2,240 points</div>
                  </div>
                  <div className="rank-number">4</div>
                </div>

                <div className="leaderboard-item">
                  <div className="rank">5</div>
                  <div className="player-info">
                    <div className="player-name">LoopLord</div>
                    <div className="player-score">2,180 points</div>
                  </div>
                  <div className="rank-number">5</div>
                </div>

                <div className="leaderboard-item highlight">
                  <div className="rank">12</div>
                  <div className="player-info">
                    <div className="player-name">You</div>
                    <div className="player-score">1,850 points</div>
                  </div>
                  <div className="rank-number">Your Rank</div>
                </div>
              </div>
            </div>
            
            <div className="page-buttons">
              <button 
                className="menu-action-btn primary"
                onClick={backToMenu}
              >
                ← Back to Menu
              </button>
            </div>
          </div>
        )}

        {/* Settings Page */}
        {currentPage === 'settings' && (
          <div className="menu-content page-settings">
            <div className="page-header">
              <h2>⚙ Settings</h2>
              <p className="page-subtitle">Customize your experience</p>
            </div>
            
            <div className="settings-group">
              <div className="setting-item audio-section">
                <h3>🔊 Audio Settings</h3>
                <AudioSettings />
              </div>

              <label className="setting-item">
                <span>UI Scale</span>
                <select defaultValue="100" className="setting-select">
                  <option value="80">80%</option>
                  <option value="90">90%</option>
                  <option value="100">100%</option>
                  <option value="110">110%</option>
                  <option value="120">120%</option>
                </select>
              </label>

              <label className="setting-item checkbox">
                <input type="checkbox" defaultChecked className="setting-checkbox" />
                <span>Show Performance Stats</span>
              </label>
            </div>

            <div className="page-buttons">
              <button 
                className="menu-action-btn primary"
                onClick={backToMenu}
              >
                ← Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainMenu;
