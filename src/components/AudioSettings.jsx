import React, { useState, useEffect } from 'react';
import { useGameEventEmitter } from '../hooks/useGameEvents';
import './AudioSettings.scss';

/**
 * AudioSettings Component - Integrated audio control
 * Can be placed in pause menu or settings panel
 */
export default function AudioSettings() {
  const [settings, setSettings] = useState({
    musicVolume: 0.3,
    sfxVolume: 0.6,
    musicEnabled: true,
    sfxEnabled: true
  });
  const [expanded, setExpanded] = useState(false);
  const [soundManager, setSoundManager] = useState(null);
  const { emit } = useGameEventEmitter();

  // Get sound manager from the active Phaser scene
  const getSoundManager = () => {
    try {
      // Try multiple ways to access the scene
      let scene = null
      
      if (window.gameScene?.game?.scene?.getScene('MainScene')) {
        scene = window.gameScene.game.scene.getScene('MainScene')
      } else if (window.gameScene?.scenes?.scenes && window.gameScene.scenes.scenes.length > 1) {
        scene = window.gameScene.scenes.scenes[1] // MainScene is typically at index 1
      }
      
      if (scene?.soundManager) {
        return scene.soundManager
      }
      
      console.warn('⚠️ Could not access sound manager')
      return null
    } catch (e) {
      console.warn('⚠️ Error accessing sound manager:', e.message)
      return null
    }
  };

  // Load initial settings and setup reference
  useEffect(() => {
    // Try immediately
    let sm = getSoundManager()
    if (sm) {
      setSoundManager(sm)
      setSettings(sm.getSettings())
      console.log('✅ AudioSettings connected to SoundManager')
    } else {
      console.warn('⚠️ AudioSettings waiting for SoundManager...')
      // Retry after game loads
      const retryTimer = setTimeout(() => {
        sm = getSoundManager()
        if (sm) {
          setSoundManager(sm)
          setSettings(sm.getSettings())
          console.log('✅ AudioSettings connected to SoundManager (retry)')
        }
      }, 1000)
      
      return () => clearTimeout(retryTimer)
    }
  }, []);

  const handleMusicVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    const newSettings = { ...settings, musicVolume: value };
    setSettings(newSettings);
    
    if (soundManager) {
      soundManager.setMusicVolume(value);
    }
  };

  const handleSFXVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    const newSettings = { ...settings, sfxVolume: value };
    setSettings(newSettings);
    
    if (soundManager) {
      soundManager.setSFXVolume(value);
    }
  };

  const toggleMusic = () => {
    const newState = !settings.musicEnabled;
    setSettings({ ...settings, musicEnabled: newState });
    
    if (soundManager) {
      soundManager.toggleMusic(newState);
    }
  };

  const toggleSFX = () => {
    const newState = !settings.sfxEnabled;
    setSettings({ ...settings, sfxEnabled: newState });
    
    if (soundManager) {
      soundManager.toggleSFX(newState);
    }
  };

  return (
    <div className="audio-settings">
      {soundManager ? (
        <div className="audio-settings-panel">
          <div className="setting-group">
            <label>
              <input
                type="checkbox"
                checked={settings.musicEnabled}
                onChange={toggleMusic}
              />
              Music ({Math.round(settings.musicVolume * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={handleMusicVolumeChange}
              disabled={!settings.musicEnabled}
              className="volume-slider"
            />
          </div>

          <div className="setting-group">
            <label>
              <input
                type="checkbox"
                checked={settings.sfxEnabled}
                onChange={toggleSFX}
              />
              Sound Effects ({Math.round(settings.sfxVolume * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={handleSFXVolumeChange}
              disabled={!settings.sfxEnabled}
              className="volume-slider"
            />
          </div>
        </div>
      ) : (
        <div className="audio-settings-panel">
          <p className="status-message">⏳ Waiting for audio system to initialize...</p>
        </div>
      )}
    </div>
  );
}
