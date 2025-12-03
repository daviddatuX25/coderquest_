# 🎵 Audio System - Quick Start Guide

## What's New?

Your game now has a **complete audio system** with:
- 🎵 Background music that loops continuously
- 🔊 Animal sound effects when you collide with NPCs
- 🎚️ Volume controls accessible from the UI
- 💾 Settings that save automatically

## For Players

### Adjusting Volume
1. **Click the 🔊 button** in the top-right corner of the game UI
2. A settings panel will appear
3. **Adjust the sliders** to change volume (0-100%)
4. **Toggle checkboxes** to mute/unmute music or sound effects
5. Your settings are automatically saved!

### What You'll Hear
- **Background Music**: Farm music plays continuously (default 30% volume)
- **Animal Sounds**: When you bump into an animal NPC, it makes its sound:
  - Bull/Calf 🐂 → Cow sound
  - Lamb 🐑 → Lamb sound
  - Piglet 🐷 → Pig sound
  - Rooster 🐔 → Rooster sound
  - Sheep 🐑 → Sheep sound
  - Turkey 🦃 → Turkey sound

### Game Pausing
- When you **pause the game**, the background music automatically pauses too
- When you **resume**, the music continues from where it stopped

## For Developers

### Testing Audio in the Browser Console

```javascript
// Check if all sounds are loaded
audioTests.checkSoundsLoaded()

// Play background music
audioTests.playBGMusic()

// Test individual animal sounds
audioTests.playAnimalSound('bull')
audioTests.playAnimalSound('lamb')
audioTests.playAnimalSound('pig')
audioTests.playAnimalSound('rooster')
audioTests.playAnimalSound('sheep')
audioTests.playAnimalSound('turkey')

// Play all animal sounds in sequence (1 sec apart)
audioTests.testAllAnimalSounds()

// Show current audio settings
audioTests.showSettings()

// Adjust volume for testing
audioTests.setMusicVolume(0.5)  // 50%
audioTests.setSFXVolume(0.75)   // 75%
```

### Code Examples

**Access the sound manager:**
```javascript
const soundManager = scene.soundManager

// Play/stop music
soundManager.playBGMusic()
soundManager.stopBGMusic()
soundManager.pauseBGMusic()
soundManager.resumeBGMusic()

// Adjust volume
soundManager.setMusicVolume(0.5)  // 0-1 (0% to 100%)
soundManager.setSFXVolume(0.6)    // 0-1 (0% to 100%)

// Toggle on/off
soundManager.toggleMusic(true)  // true = enabled
soundManager.toggleSFX(false)   // false = disabled

// Get current settings
const settings = soundManager.getSettings()
console.log(settings)
// Output:
// {
//   musicVolume: 0.3,
//   sfxVolume: 0.6,
//   musicEnabled: true,
//   sfxEnabled: true
// }
```

### Sound Files Location
All audio files are in: `public/assets/sounds/`
- `farm_bgmusic.mp3` - Background music (looping)
- `cow.mp3` - Bull/Calf sound
- `lamb.mp3` - Lamb sound
- `pig.mp3` - Piglet sound
- `rooster.mp3` - Rooster sound
- `sheep.mp3` - Sheep sound
- `turkey.mp3` - Turkey sound

### How It Works

**On Game Start:**
1. BootScene loads all audio files
2. MainScene creates a SoundManager
3. Background music starts playing

**On NPC Collision:**
1. Player touches NPC
2. System checks NPC type (animal_bull, animal_lamb, etc.)
3. Maps animal type to sound (bull → cow.mp3)
4. Plays sound at current SFX volume

**Settings:**
- Saved to browser localStorage under `audioSettings`
- Automatically loaded when game starts
- Restored if player closes/reopens game

## Files Modified/Created

### New Files
- `src/game/utils/SoundManager.js` - Core audio system
- `src/components/AudioSettings.jsx` - Settings UI component
- `src/components/AudioSettings.scss` - UI styling
- `src/game/utils/AudioDiagnostics.js` - Testing tools
- `src/game/utils/AudioValidation.js` - System validation

### Modified Files
- `src/game/scenes/BootScene.js` - Added audio asset loading
- `src/game/scenes/MainScene.js` - Added SoundManager integration
- `src/GameUI.jsx` - Added AudioSettings component

## Troubleshooting

### No Sound?
1. Check volume settings (click 🔊 button)
2. Verify music/SFX are enabled (checkboxes checked)
3. Check system volume
4. Try: `audioTests.checkSoundsLoaded()` in console

### Settings Not Saving?
1. Check browser localStorage is enabled
2. Try clearing browser cache
3. Check browser console for errors

### Only Background Music, No NPC Sounds?
1. Make sure SFX is enabled
2. Check SFX volume is above 0%
3. Verify you're colliding with NPCs

### Audio Cutting Out?
1. Check for multiple browser tabs playing audio
2. Try reducing game volume
3. Restart browser/game

## Default Settings

| Setting | Default | Range |
|---------|---------|-------|
| Music Volume | 30% | 0-100% |
| SFX Volume | 60% | 0-100% |
| Music Enabled | Yes | Yes/No |
| SFX Enabled | Yes | Yes/No |

## Quick Reference

```
🎵 Audio System Status: ✅ FULLY OPERATIONAL

🎚️ UI Controls:
   - Click 🔊 button to adjust volume
   - Toggle music/SFX on/off
   - Volume persists across sessions

🔊 Sounds:
   - Background music: farm_bgmusic.mp3
   - Animal sounds: 6 unique sounds on collision
   
🧪 Testing:
   - Use audioTests.* in browser console
   - Run audioTests.checkSoundsLoaded()
   
📁 Location:
   - Core: src/game/utils/SoundManager.js
   - UI: src/components/AudioSettings.jsx
   - Assets: public/assets/sounds/
```

## Need More Help?

📖 Full documentation: `src/AUDIO_SYSTEM.md`
✅ Complete checklist: `AUDIO_SYSTEM_CHECKLIST.md`
🎯 Implementation summary: `AUDIO_IMPLEMENTATION_COMPLETE.md`

---

**The audio system is production-ready and fully tested!** 🎉
