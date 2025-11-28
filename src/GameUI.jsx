import React, { useState, useEffect } from 'react';
import DialogBox from './components/DialogBox';
import QuestPopup from './components/QuestPopup';
import { useGameEventListener, useGameEventEmitter } from './hooks/useGameEvents';
import './styles/index.scss';

/**
 * GameUI Component
 * Main wrapper that manages all game UI popups and dialogs
 * Listens to Phaser events and displays corresponding React components
 */
function GameUI() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [questOpen, setQuestOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [questData, setQuestData] = useState(null);
  const { emit } = useGameEventEmitter();

  // Listen for show dialog event from Phaser
  useGameEventListener('showDialog', (data) => {
    setDialogData(data);
    setDialogOpen(true);
  });

  // Listen for show quest event from Phaser
  useGameEventListener('showQuest', (data) => {
    setQuestData(data);
    setQuestOpen(true);
  });

  // Listen for close popup event from Phaser
  useGameEventListener('closePopup', () => {
    setDialogOpen(false);
    setQuestOpen(false);
  });

  const handleDialogClose = () => {
    setDialogOpen(false);
    emit('dialogClosed', { npcId: dialogData?.id });
  };

  const handleQuestClose = () => {
    setQuestOpen(false);
    emit('questClosed', { questId: questData?.id });
  };

  const handleQuestComplete = (score, results) => {
    emit('questCompleted', { 
      questId: questData?.id,
      score,
      results 
    });
  };

  return (
    <div className="game-ui">
      <DialogBox
        npcData={dialogData}
        onClose={handleDialogClose}
        isOpen={dialogOpen}
      />

      <QuestPopup
        questData={questData}
        isOpen={questOpen}
        onClose={handleQuestClose}
      />
    </div>
  );
}

export default GameUI;
