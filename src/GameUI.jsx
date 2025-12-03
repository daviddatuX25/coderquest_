import React, { useState, useCallback, useMemo } from 'react';
import DialogBox from './components/DialogBox';
import QuestPopup from './components/QuestPopup';
import LevelTransitionUI from './components/LevelTransitionUI';
import MainMenu from './components/MainMenu';
import QuestLevelUI from './components/QuestLevelUI';
import { useGameEventListener, useGameEventEmitter } from './hooks/useGameEvents';
import { completeQuest, getCurrentLevel } from './data/progressManager';
import { getAllQuests } from './data/questsByLevel';
import { Logger } from './utils/Logger';
import './styles/index.scss';

/**
 * GameUI Component - Optimized
 * Main wrapper that manages all game UI popups and dialogs
 * Listens to Phaser events and displays corresponding React components
 */
function GameUI() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [questOpen, setQuestOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [questData, setQuestData] = useState(null);
  const [gameMode, setGameMode] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const { emit } = useGameEventEmitter();

  // Memoized level lookup to avoid repeated calls
  const cachedLevel = useMemo(() => getCurrentLevel(getAllQuests()), []);

  // Optimized handlers with useCallback
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    emit('dialogClosed', { npcId: dialogData?.id });
  }, [dialogData?.id, emit]);

  const handleQuestClose = useCallback(() => {
    setQuestOpen(false);
    emit('questClosed', { questId: questData?.id });
  }, [questData?.id, emit]);

  const handleQuestComplete = useCallback((score, results) => {
    completeQuest(questData?.id, score, results);
    emit('questCompleted', { 
      questId: questData?.id,
      score,
      results 
    });
  }, [questData?.id, emit]);

  // Event listeners with optimized handlers
  useGameEventListener('showDialog', (data) => {
    setDialogData(data);
    setDialogOpen(true);
  });

  useGameEventListener('showQuest', (data) => {
    setQuestData(data);
    setQuestOpen(true);
  });

  useGameEventListener('closePopup', () => {
    if (dialogOpen) handleDialogClose();
    if (questOpen) handleQuestClose();
  });

  useGameEventListener('gameStarted', (data) => {
    const level = data?.level || cachedLevel;
    setGameMode('full');
    setCurrentLevel(level);
    Logger.debug(`📊 GameUI: Starting game at level ${level}`);
  });

  useGameEventListener('gameModeChanged', (data) => {
    const level = data?.level || cachedLevel;
    setGameMode(data.mode);
    setCurrentLevel(level);
    Logger.debug(`📊 GameUI: Switching to ${data.mode} mode at level ${level}`);
  });

  useGameEventListener('gamePaused', () => {
    // Handled by MainMenu state
  });

  useGameEventListener('gameResumed', () => {
    // Handled by MainMenu state
  });

  useGameEventListener('gameExited', () => {
    setGameMode('menu');
  });

  return (
    <div className="game-ui">
      <MainMenu />

      {/* Only show game UI components when in full game mode */}
      {gameMode === 'full' && (
        <>
          <DialogBox
            npcData={dialogData}
            onClose={handleDialogClose}
            isOpen={dialogOpen}
          />

          <QuestPopup
            questData={questData}
            isOpen={questOpen}
            onClose={handleQuestClose}
            onComplete={handleQuestComplete}
          />

          <LevelTransitionUI />
        </>
      )}

      {/* Show quest level UI when in UI-only mode */}
      {gameMode === 'ui-only' && <QuestLevelUI />}
    </div>
  );
}

export default GameUI;
