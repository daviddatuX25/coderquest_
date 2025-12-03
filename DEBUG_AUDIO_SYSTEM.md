# 🔧 Audio System - Debug & Troubleshooting Guide

## Quick Fixes Applied ✅

1. **Sound Cache Access**: Changed from `scene.sound.get()` to `scene.cache.audio.exists()`
2. **Scene Exposure**: MainScene now exposed to `window.gameScene` for React component access
3. **AudioSettings Connection**: Improved SoundManager access with retry logic
4. **Diagnostics Enhanced**: Added cache inspection to identify missing sounds

## 🎯 Step-by-Step Debug Process

### Step 1: Verify Assets Loaded
Run in browser console:
```javascript
audioTests.checkSoundsLoaded()
```

Expected output:
```
✅ bgmusic
✅ cow
✅ lamb
✅ pig
✅ rooster
✅ sheep
✅ turkey
```

If you see ❌ on any, the audio files weren't loaded properly.

### Step 2: Check Cache Contents
```javascript
console.log('Audio cache:', Object.keys(window.gameScene?.cache?.audio?.entries))
```

Should show: `['bgmusic', 'cow', 'lamb', 'pig', 'rooster', 'sheep', 'turkey']`

### Step 3: Test Sound Manager Connection
```javascript
const sm = window.gameScene?.soundManager
console.log('SoundManager:', sm)
console.log('Settings:', sm?.getSettings())
```

Should show SoundManager object with settings.

### Step 4: Test Audio Context
```javascript
const scene = window.gameScene
console.log('Audio locked:', scene?.sound?.locked)
console.log('Music playing:', scene?.soundManager?.bgMusic?.isPlaying)
```

If locked = true, click on the game to unlock.

### Step 5: Manual Test - Play Background Music
```javascript
window.gameScene?.soundManager?.playBGMusic()
```

You should hear music start. If not, check console for error.

### Step 6: Manual Test - Play NPC Sound
```javascript
window.gameScene?.soundManager?.playNPCSound('animal_bull')
```

You should hear a cow sound. Try other animals:
- 'animal_lamb'
- 'animal_piglet'
- 'animal_rooster'
- 'animal_sheep'
- 'animal_turkey'

## 📊 Complete Diagnostic Output

Run this comprehensive check:
```javascript
console.group('🎵 COMPLETE AUDIO DIAGNOSTIC')

const scene = window.gameScene
console.log('1. Scene Loaded:', !!scene)
console.log('2. SoundManager:', !!scene?.soundManager)
console.log('3. Audio Cache Keys:', Object.keys(scene?.cache?.audio?.entries || {}))
console.log('4. Audio Locked:', scene?.sound?.locked)
console.log('5. Background Music Playing:', scene?.soundManager?.bgMusic?.isPlaying)
console.log('6. Audio Settings:', scene?.soundManager?.getSettings())
console.log('7. Animal Sound Map:', scene?.soundManager?.animalSoundMap)

console.groupEnd()
```

## 🔍 Common Issues & Solutions

### Issue: "Sound asset not found: cow"
**Cause**: Audio wasn't loaded during BootScene
**Solution**:
1. Check browser Network tab - are .mp3 files loading?
2. Check file paths in `BootScene.js` match actual files
3. Verify `public/assets/sounds/` directory has all files:
   - farm_bgmusic.mp3
   - cow.mp3
   - lamb.mp3
   - pig.mp3
   - rooster.mp3
   - sheep.mp3
   - turkey.mp3

### Issue: AudioSettings not responding
**Cause**: SoundManager not accessible or settings component not connected
**Solution**:
1. Run `window.gameScene?.soundManager` - does it exist?
2. Check console for connection message: "✅ AudioSettings connected to SoundManager"
3. Wait 1 second after game loads (retry logic)
4. Try opening/closing settings menu

### Issue: No sound even though everything loads
**Cause**: Audio context locked by browser
**Solution**:
1. Click anywhere on the game window
2. Press any keyboard key
3. Audio should unlock automatically
4. Look for console message: "🔓 Audio context unlocked"

### Issue: Settings don't save
**Cause**: localStorage disabled or corrupted
**Solution**:
```javascript
// Clear and reset
localStorage.removeItem('audioSettings')
window.gameScene?.soundManager?.saveSettings()
```

## 🧪 Test Sequence

Run this complete test sequence:

```javascript
console.log('=== AUDIO SYSTEM TEST SEQUENCE ===')

// 1. Check if everything loaded
console.log('\n1️⃣ Checking assets...')
audioTests.checkSoundsLoaded()

// 2. Check settings
console.log('\n2️⃣ Checking settings...')
audioTests.showSettings()

// 3. Try to play background music
console.log('\n3️⃣ Testing background music...')
audioTests.playBGMusic()

// 4. Wait 2 seconds, then test animal sound
console.log('\n4️⃣ Testing animal sounds in 2 seconds...')
setTimeout(() => {
  audioTests.playAnimalSound('bull')
  setTimeout(() => audioTests.playAnimalSound('lamb'), 1000)
  setTimeout(() => audioTests.playAnimalSound('pig'), 2000)
}, 2000)

console.log('✅ Test sequence started. Listen for sounds!')
```

## 📋 Checklist for Troubleshooting

- [ ] Audio files exist in `public/assets/sounds/`
- [ ] BootScene loads all audio files
- [ ] MainScene creates SoundManager
- [ ] MainScene exposed to `window.gameScene`
- [ ] AudioSettings component loads (after game starts)
- [ ] User clicks/interacts to unlock audio context
- [ ] Console shows no errors
- [ ] `audioTests.checkSoundsLoaded()` shows all ✅
- [ ] Background music plays when `playBGMusic()` called
- [ ] NPC sound plays on collision

## 🎯 Success Indicators

You'll know it's working when:

1. ✅ Open game, look at console
2. ✅ See "🎮 MainScene exposed to window.gameScene"
3. ✅ See "✅ AudioSettings connected to SoundManager"
4. ✅ Go to Menu → Settings → Audio Settings
5. ✅ See music and SFX controls
6. ✅ Sliders work and update percentages
7. ✅ Click anywhere or press key
8. ✅ See "🔓 Audio context unlocked"
9. ✅ Hear background music
10. ✅ Walk to NPC and hear animal sound

## 📞 Need More Help?

If all diagnostics pass but still no sound:
1. Check browser console for detailed error messages
2. Try in incognito/private window (no extensions)
3. Try different browser
4. Check system volume isn't muted
5. Check no other tab is playing audio

---

**Use the diagnostic commands above to identify exactly where the issue is!**
