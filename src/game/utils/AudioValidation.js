/**
 * Audio System Integration Test
 * Quick validation that all components are properly connected
 */

export function validateAudioSystem(scene) {
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: []
  }

  console.log('🎵 Starting Audio System Validation...\n')

  // Test 1: SoundManager exists
  try {
    if (!scene.soundManager) {
      throw new Error('SoundManager not initialized in MainScene')
    }
    console.log('✅ SoundManager initialized')
    results.passed++
  } catch (e) {
    console.error('❌ SoundManager:', e.message)
    results.failed++
    results.errors.push(e.message)
  }

  // Test 2: Audio assets loaded
  try {
    const expectedSounds = ['bgmusic', 'cow', 'lamb', 'pig', 'rooster', 'sheep', 'turkey']
    let loadedCount = 0
    const missingCount = 0

    expectedSounds.forEach(key => {
      const sound = scene.sound.get(key)
      if (sound) {
        loadedCount++
      } else {
        console.warn(`⚠️ Missing sound asset: ${key}`)
      }
    })

    if (loadedCount === expectedSounds.length) {
      console.log(`✅ All ${expectedSounds.length} sound assets loaded`)
      results.passed++
    } else {
      console.warn(`⚠️ Only ${loadedCount}/${expectedSounds.length} sounds loaded`)
      results.warnings++
    }
  } catch (e) {
    console.error('❌ Sound assets:', e.message)
    results.failed++
    results.errors.push(e.message)
  }

  // Test 3: Audio settings
  try {
    const settings = scene.soundManager.getSettings()
    if (settings.musicVolume === undefined || settings.sfxVolume === undefined) {
      throw new Error('Audio settings object incomplete')
    }
    console.log(`✅ Audio settings valid: Music ${Math.round(settings.musicVolume * 100)}%, SFX ${Math.round(settings.sfxVolume * 100)}%`)
    results.passed++
  } catch (e) {
    console.error('❌ Audio settings:', e.message)
    results.failed++
    results.errors.push(e.message)
  }

  // Test 4: Background music playing
  try {
    if (!scene.soundManager.bgMusic || !scene.soundManager.bgMusic.isPlaying) {
      console.warn('⚠️ Background music not currently playing')
      results.warnings++
    } else {
      console.log('✅ Background music is playing')
      results.passed++
    }
  } catch (e) {
    console.error('❌ Background music check:', e.message)
    results.failed++
    results.errors.push(e.message)
  }

  // Test 5: Animal sound mapping
  try {
    const animalTypes = ['bull', 'calf', 'lamb', 'piglet', 'rooster', 'sheep', 'turkey', 'chick']
    let mappedCount = 0

    animalTypes.forEach(type => {
      if (scene.soundManager.animalSoundMap[type]) {
        mappedCount++
      }
    })

    if (mappedCount === animalTypes.length) {
      console.log(`✅ All ${animalTypes.length} animal types have sound mappings`)
      results.passed++
    } else {
      console.warn(`⚠️ Only ${mappedCount}/${animalTypes.length} animals mapped`)
      results.warnings++
    }
  } catch (e) {
    console.error('❌ Animal sound mapping:', e.message)
    results.failed++
    results.errors.push(e.message)
  }

  // Test 6: NPC collision setup
  try {
    if (!scene.npcSystem || !scene.npcSystem.getAllNPCs) {
      throw new Error('NPC system not properly initialized')
    }
    const npcCount = scene.npcSystem.getAllNPCs().length
    console.log(`✅ NPC system ready with ${npcCount} NPCs`)
    results.passed++
  } catch (e) {
    console.error('❌ NPC collision setup:', e.message)
    results.failed++
    results.errors.push(e.message)
  }

  // Test 7: Game events
  try {
    if (!window.gameEvents) {
      throw new Error('Global gameEvents not found')
    }
    console.log('✅ Game events system available')
    results.passed++
  } catch (e) {
    console.error('❌ Game events:', e.message)
    results.failed++
    results.errors.push(e.message)
  }

  // Test 8: Diagnostics available
  try {
    if (!window.audioTests) {
      throw new Error('Audio diagnostic tools not available')
    }
    console.log('✅ Audio diagnostics available (window.audioTests)')
    results.passed++
  } catch (e) {
    console.error('❌ Audio diagnostics:', e.message)
    results.failed++
    results.errors.push(e.message)
  }

  // Summary
  console.log('\n📊 VALIDATION SUMMARY')
  console.log(`✅ Passed: ${results.passed}`)
  console.log(`⚠️  Warnings: ${results.warnings}`)
  console.log(`❌ Failed: ${results.failed}`)

  if (results.failed === 0) {
    console.log('\n🎉 Audio System is fully operational!')
  } else {
    console.log('\n⚠️ Audio System has issues:')
    results.errors.forEach(err => console.log(`   - ${err}`))
  }

  return results
}

// Quick test for NPC sounds
export function testNPCSoundTrigger(scene) {
  console.log('\n🎵 Testing NPC Sound System')
  
  const npcs = scene.npcSystem.getAllNPCs()
  if (npcs.length === 0) {
    console.warn('⚠️ No NPCs available for testing')
    return
  }

  // Test each NPC's sound
  npcs.forEach((npc, index) => {
    setTimeout(() => {
      console.log(`🔊 Testing ${npc.name} (${npc.key})...`)
      scene.soundManager.playNPCSound(npc.key)
    }, index * 1000)
  })
}

export default validateAudioSystem
