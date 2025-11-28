import React, { useState, useEffect } from 'react';
import '../styles/_dialog-box.scss';

/**
 * DialogBox Component
 * Displays NPC dialog with character name and message
 * Props:
 *   - npcData: { name, dialog, sprite }
 *   - onClose: callback when close button clicked
 *   - isOpen: boolean to control visibility
 */
const DialogBox = ({ npcData, onClose, isOpen }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
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
            <p>{npcData?.dialog || 'Hello, adventurer!'}</p>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="dialog-action-btn" onClick={handleClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
