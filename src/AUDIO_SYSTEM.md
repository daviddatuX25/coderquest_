## Audio System Implementation

### Overview
Complete audio system with background music and NPC sound effects, fully integrated with the game engine.

### Features

#### 1. **Background Music**
- Farm background music (`farm_bgmusic.mp3`) plays on loop
- Default volume: 30%
- Can be paused/resumed when game is paused
- Volume controllable via UI settings

#### 2. **Sound Effects**
- Individual animal sounds for NPC collisions:
  - **Bull/Calf** → `cow.mp3`
  - **Lamb** → `lamb.mp3`
  - **Piglet** → `pig.mp3`
  - **Rooster** → `rooster.mp3` (also for Chick)
  - **Sheep** → `sheep.mp3`
  - **Turkey** → `turkey.mp3`
- Default SFX volume: 60%
- Plays automatically on NPC collision

#### 3. **Settings Management**
- Volume control for music and SFX (0-100%)
- Enable/disable music and SFX independently
- Settings persisted to localStorage
- Accessible via AudioSettings component in UI

### Files

#### Core Implementation
- `src/game/utils/SoundManager.js` - Main sound manager class
  - Manages audio playback and settings
  - Handles NPC sound mapping
  - Persists settings to localStorage
  - Listens to pause/resume events

- `src/game/utils/AudioDiagnostics.js` - Testing and debugging tools
  - Check loaded sounds status
  - Play individual animal sounds
  - Adjust volumes for testing
  - Test all sounds sequentially

- `src/components/AudioSettings.jsx` - React UI component
  - Toggle music and SFX on/off
  - Adjust volume sliders (0-100%)
  - Collapsible settings panel
  - Green themed UI matching game aesthetic

- `src/components/AudioSettings.scss` - Styling for audio settings
  - Expandable panel with animations
  - Volume sliders with hover effects
  - Checkbox controls

#### Integration
- `src/game/scenes/BootScene.js` - Audio asset loading
  - Loads all sound files from `public/assets/sounds/`

- `src/game/scenes/MainScene.js` - Audio initialization and events
  - Creates SoundManager instance
  - Plays background music on level start
  - Triggers NPC sounds on collision
  - Pauses/resumes music with game pause
  - Cleans up audio on scene shutdown

- `src/GameUI.jsx` - Audio settings integration
  - Imports and displays AudioSettings component

### Usage

#### For Players
1. **Adjusting Volume**: Click the 🔊 button in the top-right corner
2. **Toggling Audio**: Check/uncheck the toggle boxes to enable/disable music and SFX
3. **Volume Adjustment**: Use sliders to fine-tune volume (0-100%)

#### For Developers

**Testing Audio (in browser console)**:
```javascript
// Check if all sounds loaded
audioTests.checkSoundsLoaded()

// Play background music
audioTests.playBGMusic()

// Stop background music
audioTests.stopBGMusic()

// Play specific animal sound
audioTests.playAnimalSound('bull')  // or 'lamb', 'pig', 'rooster', 'sheep', 'turkey'

// Test all animals in sequence (1 second apart)
audioTests.testAllAnimalSounds()

// Show current settings
audioTests.showSettings()

// Adjust volume
audioTests.setMusicVolume(0.5)  // 50%
audioTests.setSFXVolume(0.75)   // 75%
```

**SoundManager Methods**:
```javascript
const soundManager = scene.soundManager

// Playback control
soundManager.playBGMusic()      // Start background music
soundManager.stopBGMusic()      // Stop background music
soundManager.pauseBGMusic()     // Pause background music
soundManager.resumeBGMusic()    // Resume background music

// Volume control
soundManager.setMusicVolume(0.5)   // 0-1 (0% to 100%)
soundManager.setSFXVolume(0.6)     // 0-1 (0% to 100%)

// Toggle on/off
soundManager.toggleMusic(true)     // Enable/disable music
soundManager.toggleSFX(false)      // Enable/disable SFX

// Settings management
soundManager.getSettings()         // Get current settings object
soundManager.updateSettings({      // Update multiple settings
  musicVolume: 0.4,
  sfxVolume: 0.7,
  musicEnabled: true,
  sfxEnabled: true
})
```

### Settings Persistence
Settings are automatically saved to localStorage under the key `audioSettings`:
```javascript
{
  musicVolume: 0.3,      // 0-1
  sfxVolume: 0.6,        // 0-1
  musicEnabled: true,    // boolean
  sfxEnabled: true       // boolean
}
```

These settings are loaded when the game starts and restored on next session.

### Sound Files Location
All audio files are stored in: `public/assets/sounds/`
- `farm_bgmusic.mp3` - Background music (looping)
- `cow.mp3` - Bull/Calf sound
- `lamb.mp3` - Lamb sound
- `pig.mp3` - Piglet sound
- `rooster.mp3` - Rooster/Chick sound
- `sheep.mp3` - Sheep sound
- `turkey.mp3` - Turkey sound

### Audio Events
The system listens to these game events:
- `gamePaused` - Pauses background music
- `gameResumed` - Resumes background music

And triggers NPC sounds on:
- NPC collision with player

### Performance Notes
- Sound effects are played with current SFX volume setting
- Only plays when SFX is enabled
- Efficient memory usage - sounds are streamed, not preloaded into memory
- No audio processing happens in the main game loop

### Troubleshooting

**Sounds not playing?**
1. Check volume settings (they might be muted)
2. Run `audioTests.checkSoundsLoaded()` in console to verify files loaded
3. Check browser console for error messages
4. Ensure audio files exist in `public/assets/sounds/`

**Settings not persisting?**
- Check browser localStorage is enabled
- Clear browser cache and reload
- Check browser console for localStorage errors

**Audio cutting out?**
- Check system volume is not muted
- Reduce game volume if system is at max
- Check for audio conflicts with other browser tabs

### Future Enhancements
- Ambient background sounds (wind, forest)
- Victory/defeat sound effects
- Dialog/interaction sounds
- Audio fade-in/fade-out transitions
- Music volume control by game phase
- Sound effect queuing system
