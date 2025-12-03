/**
 * SoundManager - Manages all game audio
 * - Background music (with volume control and pause)
 * - Sound effects for NPC collisions
 * - Settings persistence for volume
 */
export class SoundManager {
  constructor(scene) {
    this.scene = scene
    this.bgMusic = null
    this.soundEffects = {} // Store sound effect keys
    this.lastNPCSoundTime = 0 // Track last NPC sound time for debouncing
    this.settings = {
      musicVolume: 0.3, // Default 30%
      sfxVolume: 0.6,   // Default 60%
      musicEnabled: true,
      sfxEnabled: true
    }
    
    // Load settings from localStorage if available
    this.loadSettings()
    
    // Map NPC types to animal sounds
    this.animalSoundMap = {
      'bull': 'cow',
      'calf': 'cow',
      'lamb': 'lamb',
      'piglet': 'pig',
      'rooster': 'rooster',
      'sheep': 'sheep',
      'turkey': 'turkey',
      'chick': 'rooster' // Chick uses rooster sound
    }
    
    // Listen for game pause/resume events
    this.setupEventListeners()
  }

  /**
   * Setup event listeners for pause/resume
   */
  setupEventListeners() {
    // Listen for pause events from the global event emitter
    if (window.gameEvents) {
      window.gameEvents.on('gamePaused', () => {
        this.pauseBGMusic()
      })

      window.gameEvents.on('gameResumed', () => {
        this.resumeBGMusic()
      })
    }
  }

  /**
   * Load audio settings from localStorage
   */
  loadSettings() {
    const saved = localStorage.getItem('audioSettings')
    if (saved) {
      try {
        this.settings = JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to load audio settings', e)
      }
    }
  }

  /**
   * Save audio settings to localStorage
   */
  saveSettings() {
    localStorage.setItem('audioSettings', JSON.stringify(this.settings))
  }

  /**
   * Play background music on loop
   */
  playBGMusic() {
    try {
      // Check if music key exists in the audio cache
      if (!this.scene.cache.audio.exists('bgmusic')) {
        console.error('❌ Background music asset "bgmusic" not found in cache')
        return
      }

      // If already playing, don't start again
      if (this.bgMusic && this.bgMusic.isPlaying) {
        return
      }

      // Ensure audio context is unlocked - retry if locked
      if (this.scene.sound.locked) {
        // Keep retrying until unlocked
        const retryInterval = setInterval(() => {
          if (!this.scene.sound.locked) {
            clearInterval(retryInterval)
            this.playBGMusic()
          }
        }, 100)
        return
      }

      // Play the music
      this.bgMusic = this.scene.sound.play('bgmusic', {
        loop: true,
        volume: this.settings.musicEnabled ? this.settings.musicVolume : 0
      })
      
      console.log('🎵 Background music started')
    } catch (e) {
      console.error('❌ Error playing background music:', e.message)
    }
  }

  /**
   * Stop background music
   */
  stopBGMusic() {
    if (this.bgMusic) {
      this.bgMusic.stop()
      this.bgMusic = null
    }
  }

  /**
   * Pause background music
   */
  pauseBGMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause()
    }
  }

  /**
   * Resume background music
   */
  resumeBGMusic() {
    if (this.bgMusic && this.bgMusic.isPaused) {
      this.bgMusic.resume()
    }
  }

  /**
   * Play sound effect when NPC is triggered
   * Match animal NPC types to their sounds
   * Debounced to prevent multiple triggers on continuous collision
   */
  playNPCSound(npcKey) {
    if (!this.settings.sfxEnabled) return
    if (this.scene.sound.locked) return
    
    // Debounce: prevent playing same sound within 500ms
    const now = Date.now()
    if (this.lastNPCSoundTime && (now - this.lastNPCSoundTime) < 500) {
      return
    }
    this.lastNPCSoundTime = now
    
    try {
      // Extract animal type from key (e.g., 'animal_bull' -> 'bull')
      let soundKey = null
      
      if (npcKey.startsWith('animal_')) {
        const animalType = npcKey.replace('animal_', '')
        soundKey = this.animalSoundMap[animalType]
      }
      
      // Validate sound mapping exists
      if (!soundKey) {
        console.warn(`⚠️ No sound mapping for NPC type: ${npcKey}`)
        return
      }
      
      // Check if sound exists in the audio cache
      if (!this.scene.cache.audio.exists(soundKey)) {
        console.warn(`⚠️ Sound asset not found in cache: ${soundKey}`)
        return
      }
      
      this.scene.sound.play(soundKey, {
        volume: this.settings.sfxVolume
      })
    } catch (e) {
      console.error(`❌ Error playing NPC sound for ${npcKey}:`, e.message)
    }
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume) {
    this.settings.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.bgMusic && typeof this.bgMusic.setVolume === 'function' && this.settings.musicEnabled) {
      this.bgMusic.setVolume(this.settings.musicVolume)
    }
    this.saveSettings()
  }

  /**
   * Set SFX volume (0-1)
   */
  setSFXVolume(volume) {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  /**
   * Toggle music on/off
   */
  toggleMusic(enabled) {
    this.settings.musicEnabled = enabled
    if (this.bgMusic && typeof this.bgMusic.setVolume === 'function') {
      this.bgMusic.setVolume(enabled ? this.settings.musicVolume : 0)
    }
    this.saveSettings()
  }

  /**
   * Toggle SFX on/off
   */
  toggleSFX(enabled) {
    this.settings.sfxEnabled = enabled
    this.saveSettings()
  }

  /**
   * Get current settings
   */
  getSettings() {
    return { ...this.settings }
  }

  /**
   * Update settings (used by UI)
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings }
    
    // Apply changes immediately
    if (newSettings.musicVolume !== undefined) {
      this.setMusicVolume(newSettings.musicVolume)
    }
    if (newSettings.sfxVolume !== undefined) {
      this.setSFXVolume(newSettings.sfxVolume)
    }
    if (newSettings.musicEnabled !== undefined) {
      this.toggleMusic(newSettings.musicEnabled)
    }
    if (newSettings.sfxEnabled !== undefined) {
      this.toggleSFX(newSettings.sfxEnabled)
    }
  }

  /**
   * Cleanup when scene shuts down
   */
  shutdown() {
    this.stopBGMusic()
  }
}

export default SoundManager
