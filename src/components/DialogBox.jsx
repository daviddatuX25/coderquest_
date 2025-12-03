import React, { useState, useEffect } from 'react';
import { useGameEventEmitter } from '../hooks/useGameEvents';
import '../styles/_dialog-box.scss';

/**
 * DialogBox Component
 * Displays NPC dialog with character name and message
 * Props:
 *   - npcData: { name, dialog, sprite, hasQuest, questData }
 *   - onClose: callback when close button clicked
 *   - isOpen: boolean to control visibility
 */
const DialogBox = ({ npcData, onClose, isOpen }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { emit } = useGameEventEmitter();

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      console.log('💬 DialogBox opened with npcData:', {
        name: npcData?.name,
        hasQuestData: !!npcData?.questData,
        hasQuest: npcData?.hasQuest,
        isQuestLocked: npcData?.isQuestLocked,
        questDataStructure: npcData?.questData ? Object.keys(npcData.questData) : null
      });
    }
  }, [isOpen, npcData]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const handleStartQuest = () => {
    if (npcData?.isQuestLocked) {
      // Quest is locked, don't proceed
      return;
    }
    if (npcData?.questData) {
      // Emit quest to React
      emit('showQuest', npcData.questData);
      // Close dialog
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`dialog-overlay ${isAnimating ? 'show' : ''}`} onClick={handleClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-npc-name">{npcData?.name || 'NPC'}</h2>
          <button className="dialog-close-btn" onClick={handleClose} title="Close dialog">
            ✕
          </button>
        </div>
        
        <div className="dialog-content">
          {npcData?.sprite && (
            <div className="dialog-sprite">
              <img src={`assets/characters/${npcData.sprite}.png`} alt={npcData.name} />
            </div>
          )}
          <div className="dialog-text">
            <p>{npcData?.dialogText || npcData?.dialog || 'Hello, adventurer!'}</p>
            {npcData?.isQuestLocked && npcData?.prerequisiteMessage && (
              <div className="dialog-locked-message">
                <p className="locked-text">🔒 {npcData.prerequisiteMessage}</p>
              </div>
            )}
          </div>
        </div>

        <div className="dialog-footer">
          {npcData?.hasQuest && !npcData?.isQuestLocked ? (
            <>
              <button className="dialog-action-btn secondary" onClick={handleClose}>
                Skip
              </button>
              <button className="dialog-action-btn primary" onClick={handleStartQuest}>
                Start Quest
              </button>
            </>
          ) : npcData?.isQuestLocked ? (
            <button className="dialog-action-btn disabled" onClick={handleClose} disabled>
              Complete Prerequisites First
            </button>
          ) : (
            <button className="dialog-action-btn" onClick={handleClose}>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
