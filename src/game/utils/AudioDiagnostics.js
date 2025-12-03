/**
 * Audio System Test & Diagnostics
 * Run this to check if all sounds are loaded and working
 */

export function setupAudioDiagnostics(scene) {
  window.audioTests = {
    /**
     * Check if all sounds are loaded
     */
    checkSoundsLoaded() {
      console.log('🎵 Sound Loading Check:')
      console.log('Cache audio entries:', Object.keys(scene.cache.audio.entries))
      
      const expectedSounds = ['bgmusic', 'cow', 'lamb', 'pig', 'rooster', 'sheep', 'turkey']
      
      expectedSounds.forEach(key => {
        const exists = scene.cache.audio.exists(key)
        const status = exists ? '✅' : '❌'
        console.log(`${status} ${key}`)
      })
    },

    /**
     * Play background music
     */
    playBGMusic() {
      console.log('🎵 Playing background music...')
      scene.soundManager.playBGMusic()
    },

    /**
     * Stop background music
     */
    stopBGMusic() {
      console.log('🛑 Stopping background music...')
      scene.soundManager.stopBGMusic()
    },

    /**
     * Play a specific animal sound
     */
    playAnimalSound(animalType) {
      console.log(`🔊 Playing ${animalType} sound...`)
      const soundKey = scene.soundManager.animalSoundMap[animalType]
      if (soundKey) {
        if (scene.cache.audio.exists(soundKey)) {
          scene.sound.play(soundKey, { volume: 0.6 })
        } else {
          console.warn(`❌ Sound not in cache: ${soundKey}`)
          console.warn(`Available: ${Object.keys(scene.cache.audio.entries)}`)
        }
      } else {
        console.warn(`❌ Unknown animal type: ${animalType}`)
      }
    },

    /**
     * Test all animal sounds
     */
    testAllAnimalSounds() {
      console.log('🎵 Testing all animal sounds...')
      const animals = ['bull', 'lamb', 'piglet', 'rooster', 'sheep', 'turkey']
      
      animals.forEach((animal, index) => {
        setTimeout(() => {
          this.playAnimalSound(animal)
        }, index * 1000)
      })
    },

    /**
     * Show current settings
     */
    showSettings() {
      const settings = scene.soundManager.getSettings()
      console.log('🔊 Current Audio Settings:', settings)
    },

    /**
     * Adjust music volume
     */
    setMusicVolume(volume) {
      console.log(`🔊 Setting music volume to ${volume}`)
      scene.soundManager.setMusicVolume(volume)
    },

    /**
     * Adjust SFX volume
     */
    setSFXVolume(volume) {
      console.log(`🔊 Setting SFX volume to ${volume}`)
      scene.soundManager.setSFXVolume(volume)
    }
  }

  console.log('✅ Audio diagnostics loaded. Run audioTests.checkSoundsLoaded() to test.')
}

export default setupAudioDiagnostics
