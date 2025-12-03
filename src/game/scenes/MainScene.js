import Phaser from 'phaser'
import { gameEvents } from '../utils/EventEmitter'
import { gameState } from '../utils/GameStateManager'
import { PlayerController } from '../objects/PlayerController'
import { NPCSystem } from '../objects/NPCSystem'
import { MapManager } from '../objects/MapManager'
import { CameraManager } from '../objects/CameraManager'
import { CollisionManager } from '../objects/CollisionManager'
import { InputHandler } from '../input/InputHandler'
import { SoundManager } from '../utils/SoundManager'
import { setupAudioDiagnostics } from '../utils/AudioDiagnostics'
import { Logger } from '../../utils/Logger'
import { getQuestForGameMode, getLessonToGameMapping } from '../../data/unifiedQuests'
import { getNPCsForLevel } from '../../data/npcsByLevel'
import { getCurrentLevel, getProgress, completeQuest as completeLessonQuest } from '../../data/progressManager'

/**
 * MainScene - Main game scene - OPTIMIZED
 * - Player movement (WASD/Arrows)
 * - NPC interactions (E key)
 * - Camera following player
 * - Tilemap rendering
 */
export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
    this.player = null
    this.npcSystem = null
    this.mapManager = null
    this.cameraManager = null
    this.collisionManager = null
    this.inputHandler = null
    this.soundManager = null
    this.currentLevel = 1
    this.playerMovingKeys = {
      up: false,
      down: false,
      left: false,
      right: false
    }
  }

  preload() {
    // Assets preloaded in BootScene
  }

  create() {
    Logger.debug('🎮 MainScene: Creating game world...')
    
    // IMPORTANT: Load game state from localStorage instead of resetting
    // This preserves quest completions from both game and lesson modes
    gameState.loadFromStorage()
    
    Logger.debug(`📊 Loaded game state from storage:`, {
      completedQuests: gameState.getCompletedQuests().map(q => q.id)
    })
    
    // Check player's progress and set appropriate level
    // In game mode, we default to level 1
    // (getCurrentLevel is used in lesson mode with quest segments)
    const progress = getProgress()
    this.currentLevel = progress.currentLevel || 1
    Logger.debug(`📊 Player progress: Currently on Level ${this.currentLevel}`)
    
    // Log all progress data from lesson mode
    Logger.debug('📈 Full Progress Data:', {
      completedQuests: progress.completedQuests,
      questResults: progress.questResults,
      questScores: progress.questScores
    })
    
    // Sync completed quests from progressManager into gameState
    if (progress.completedQuests && Object.keys(progress.completedQuests).length > 0) {
      const quizNameToQuestId = getLessonToGameMapping()
      
      Logger.debug('🔄 Starting progress sync:', {
        completedQuestKeys: Object.keys(progress.completedQuests),
        mappingKeys: Object.keys(quizNameToQuestId)
      })
      
      let syncCount = 0
      // Mark all completed quizzes in gameState
      // Only sync quizzes, not topics (topics don't have game mode equivalents)
      for (const questName in progress.completedQuests) {
        // Skip topics - only sync quizzes
        if (questName.includes('-quiz') || questName.includes('quiz-')) {
          const gameQuestId = quizNameToQuestId[questName]
          if (gameQuestId) {
            gameState.markQuestCompleted(gameQuestId)
            syncCount++
            Logger.debug(`✅ Synced quiz: ${questName} → ${gameQuestId}`)
          } else {
            Logger.warn(`⚠️ Quiz found but NO MAPPING: ${questName}`)
          }
        } else {
          // This is a topic (intro-*, functions-intro, etc.)
          Logger.debug(`📚 Topic (skipped in game mode): ${questName}`)
        }
      }
      
      Logger.debug('📊 Game state after sync:', {
        syncedQuestCount: syncCount,
        completedQuestsCount: gameState.getCompletedQuests().length,
        completedQuestIds: gameState.getCompletedQuests().map(q => q.id)
      })
    } else {
      Logger.debug('ℹ️ No completed quests in lesson mode yet')
    }
    
    // Initialize systems in order
    this.mapManager = new MapManager(this)
    this.npcSystem = new NPCSystem(this)
    this.cameraManager = new CameraManager(this)
    this.collisionManager = new CollisionManager(this)
    this.inputHandler = new InputHandler(this)
    this.soundManager = new SoundManager(this)

    // Load tilemap (but don't set up collisions yet)
    this.createTilemap()

    // Create player FIRST
    this.createPlayer()

    // Create sample NPCs BEFORE setting up collisions
    this.createSampleNPCs()

    // Set up collision AFTER both player and NPCs exist
    this.setupCollisions()

    // Setup camera
    this.setupCamera()

    // Setup input
    this.setupInput()

    // Setup React event listeners
    this.setupReactEventListeners()
    
    // Start background music
    this.soundManager.playBGMusic()
    
    // Expose scene to window for React components to access
    window.gameScene = this
    
    // Expose diagnostic tools to window
    this.setupDiagnostics()

    // Initialize backend progress manager
    this.initializeProgressManager()

    // Emit event that game is ready
    gameEvents.emit('gameReady', { 
      level: this.currentLevel,
      playerPosition: this.player ? this.player.getPosition() : { x: 100, y: 100 }
    })

    Logger.debug('✅ MainScene: Game ready!')
  }

  createTilemap() {
    try {
      // Get map key based on current level
      const mapKey = this.getMapKeyForLevel(this.currentLevel)
      const mapConfig = this.getMapConfigForLevel(this.currentLevel)
      
      // Load the map for current level
      const map = this.make.tilemap({ key: mapKey })
      
      if (!map.tilesets || map.tilesets.length === 0) throw new Error('No tilesets in map')
      
      Logger.debug(`📍 Level ${this.currentLevel} map has ${map.tilesets.length} tileset(s)`)
      
      // ADD ALL UNIQUE TILESETS FROM THE MAP (handles both single and multiple tilesets)
      const addedTilesetNames = new Set()
      const tilesets = []
      
      map.tilesets.forEach((ts, index) => {
        // Determine the actual tileset name
        let tilesetName = ts.name || 'unknown'
        
        // If name is empty but source exists, extract name from source path
        if (!tilesetName || tilesetName === 'unknown') {
          if (ts.source) {
            const match = ts.source.match(/\/([^\/]+)\.(tsx|json)$/)
            if (match) {
              tilesetName = match[1]
            }
          }
        }
        
        // Skip if we've already added this tileset name
        if (addedTilesetNames.has(tilesetName)) {
          return
        }
        
        const assetKey = this.getTilesetAssetKeyForName(tilesetName, this.currentLevel)
        
        try {
          const tileset = map.addTilesetImage(tilesetName, assetKey)
          if (tileset) {
            addedTilesetNames.add(tilesetName)
            tilesets.push(tileset)
            Logger.debug(`✅ Tileset added: ${tilesetName}`)
          } else {
            Logger.warn(`⚠️ Could not add tileset: ${tilesetName}`)
          }
        } catch (e) {
          Logger.warn(`⚠️ Error adding tileset ${tilesetName}: ${e.message}`)
        }
      })
      
      if (tilesets.length === 0) throw new Error('No tilesets could be added to map')
      
      this.currentTilemap = map
      
      // Create layers with incremental depth ordering
      let layersCreated = 0
      let currentDepth = 0
      this.obstacleLayers = []
      
      // Handle different layer configurations based on level
      if (mapConfig.allLayers) {
        mapConfig.allLayers.forEach(layerName => {
          try {
            const layer = map.createLayer(layerName)
            if (layer) {
              layer.setDepth(currentDepth++)
              layersCreated++
            }
          } catch (e) {
            Logger.warn(`⚠️ Could not create layer ${layerName}: ${e.message}`)
          }
        })
      } else {
        const primaryTileset = tilesets[0]
        
        mapConfig.walkable.forEach(layerName => {
          try {
            const layer = map.createLayer(layerName, primaryTileset)
            if (layer) {
              layer.setCollisionByProperty({ collides: false })
              layer.setDepth(currentDepth++)
              layersCreated++
            }
          } catch (e) {
            Logger.warn(`⚠️ ${layerName}: ${e.message}`)
          }
        })
        
        const playerDepth = currentDepth
        currentDepth++
        
        const reversedObstacles = mapConfig.obstacles.slice().reverse()
        reversedObstacles.forEach(layerName => {
          try {
            const layer = map.createLayer(layerName, primaryTileset)
            if (layer) {
              layer.setDepth(currentDepth++)
              layersCreated++
            }
          } catch (e) {
            Logger.warn(`⚠️ Skipping ${layerName}`)
          }
        })
      }
      
      // Set player depth ABOVE all static tiles
      this.playerDepth = currentDepth
      this.npcDepth = currentDepth + 1
      
      // Set physics and camera bounds
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      this.tilemapLoaded = true
      
      Logger.debug(`✅ Level ${this.currentLevel} Tilemap loaded: ${map.widthInPixels}x${map.heightInPixels}px`)
      
      if (this.fallbackGraphics) {
        this.fallbackGraphics.destroy()
        this.fallbackGraphics = null
      }
    } catch (error) {
      Logger.error('❌ Map error:', error.message)
      this.createSimpleBackground()
      this.tilemapLoaded = false
    }
  }

  /**
   * Get tilemap key based on level
   */
  getMapKeyForLevel(level) {
    const mapKeys = {
      1: 'map-jungle',
      2: 'map-town',
      3: 'map-city'
    }
    return mapKeys[level] || mapKeys[1]
  }

  /**
   * Get tileset key based on level
   */
  getTilesetKeyForLevel(level) {
    const tilesetKeys = {
      1: 'tf-jungle-tileset',
      2: 'village-tileset',
      3: 'village-tileset'
    }
    return tilesetKeys[level] || tilesetKeys[1]
  }

  /**
   * Map tileset names from map file to loaded asset keys - OPTIMIZED with object lookup
   */
  getTilesetAssetKeyForName(tilesetName, level) {
    const tilesetMaps = {
      1: {
        'tf_jungle_tileset': 'tf-jungle-tileset'
      },
      2: {
        'tf_jungle_tileset': 'tf-jungle-tileset',
        'Serene_Village_16x16': 'village-tileset',
        'SereneVillage16x16': 'village-tileset',
        'serene_village_16x16': 'village-tileset'
      },
      3: {
        'Serene_Village_16x16': 'village-tileset',
        'SereneVillage16x16': 'village-tileset',
        'serene_village_16x16': 'village-tileset'
      }
    }
    
    const levelMap = tilesetMaps[level] || tilesetMaps[1]
    
    // Try direct match first
    if (levelMap[tilesetName]) {
      return levelMap[tilesetName]
    }
    
    // Try case-insensitive match
    const lowerName = tilesetName.toLowerCase()
    for (const [key, value] of Object.entries(levelMap)) {
      if (key.toLowerCase() === lowerName) {
        return value
      }
    }
    
    Logger.warn(`⚠️ Unknown tileset name "${tilesetName}" for level ${level}, attempting fallback`)
    return this.getTilesetKeyForLevel(level)
  }

  /**
   * Get map configuration (layers) based on level
   */
  getMapConfigForLevel(level) {
    const configs = {
      1: {
        walkable: ['bush', 'tile_platform'],
        obstacles: ['trees5', 'trees4+bush', 'trees3+rock+flower', 'trees2', 'trees1', 'trees0', 'road_rocks', 'elevated_ground']
      },
      2: {
        allLayers: [
          'tile_plaftform', 'pathway', 'entrance_from_forest1', 'entrance_from_forest2',
          'entrance_from_forest3', 'entrance_from_forest4', 'entrance_from_forest5',
          'entrance_from_forest6', 'entrance_from_forest7', 'floating island',
          'village', 'houses', 'roads', 'roads2'
        ]
      },
      3: {
        walkable: ['ground', 'streets'],
        obstacles: ['buildings', 'walls', 'obstacles', 'decorations']
      }
    }
    
    return configs[level] || configs[1]
  }

  createSimpleBackground() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0x1a5f1a, 1)
    graphics.fillRect(0, 0, 1600, 1200)
    graphics.setDepth(-1)
    
    graphics.lineStyle(1, 0x0d3d0d, 0.3)
    for (let x = 0; x < 1600; x += 32) {
      graphics.lineBetween(x, 0, x, 1200)
    }
    for (let y = 0; y < 1200; y += 32) {
      graphics.lineBetween(0, y, 1600, y)
    }
    
    this.fallbackGraphics = graphics
  }

  createPlayer() {
    let spawnPoint = { x: 400, y: 300 }
    
    try {
      const objectLayer = this.currentTilemap.getObjectLayer('player_spawn_point')
      if (objectLayer?.objects?.length > 0) {
        spawnPoint = { x: objectLayer.objects[0].x, y: objectLayer.objects[0].y }
      }
    } catch (e) {
      Logger.warn('⚠️ Could not find player spawn point')
    }
    
    this.player = new PlayerController(this, spawnPoint.x, spawnPoint.y)
    this.player.sprite.setDepth(this.playerDepth)
    this.player.sprite.setCollideWorldBounds(true)
    
    gameState.set('playerPosition', spawnPoint)
  }

  setupCollisions() {
    if (!this.player?.sprite || !this.currentTilemap) return
    
    const objectLayer = this.currentTilemap.getObjectLayer('collision_object_group')
    if (!objectLayer?.objects) return
    
    this.collisionBodies = []
    
    objectLayer.objects.forEach((obj) => {
      try {
        const collisionBody = this.createCollisionBody(obj)
        this.collisionBodies.push(collisionBody)
        this.physics.add.collider(this.player.sprite, collisionBody)
        
        if (this.npcSystem) {
          const npcs = this.npcSystem.getAllNPCs()
          npcs.forEach(npc => {
            if (npc.sprite) {
              this.physics.add.collider(npc.sprite, collisionBody)
            }
          })
        }
      } catch (e) {
        // Collision setup error - continue
      }
    })
    
    if (this.npcSystem && this.player?.sprite) {
      const npcs = this.npcSystem.getAllNPCs()
      npcs.forEach(npc => {
        if (npc.sprite) {
          this.physics.add.collider(
            this.player.sprite,
            npc.sprite,
            () => {
              if (npc.stopMovement) {
                npc.stopMovement()
              }
              // Play NPC sound effect on collision
              if (this.soundManager && npc.key) {
                this.soundManager.playNPCSound(npc.key)
              }
              Logger.debug('💥 NPC collision - contact')
            }
          )
        }
      })
    }

    this.setupLevelEndpoint()
  }

  setupLevelEndpoint() {
    if (!this.player?.sprite || !this.currentTilemap) return

    try {
      const endpointLayer = this.currentTilemap.getObjectLayer('player_end_point')
      if (!endpointLayer?.objects?.length) {
        Logger.warn('⚠️ No player_end_point found in map')
        return
      }

      const endpointObj = endpointLayer.objects[0]
      
      const endpointZone = this.add.zone(
        endpointObj.x + endpointObj.width / 2,
        endpointObj.y + endpointObj.height / 2,
        endpointObj.width,
        endpointObj.height
      )
      
      this.physics.world.enable(endpointZone)
      this.endpointZone = endpointZone
      let isInEndpoint = false

      this.physics.add.overlap(
        this.player.sprite,
        endpointZone,
        () => {
          if (!isInEndpoint) {
            isInEndpoint = true
            Logger.debug('🎯 Player reached level endpoint!')
            
            gameEvents.emit('levelTransitionReady', {
              currentLevel: this.currentLevel,
              playerPosition: {
                x: this.player.sprite.x,
                y: this.player.sprite.y
              }
            })
          }
        },
        null,
        this
      )

      this.events.on('update', () => {
        if (isInEndpoint) {
          const distance = Phaser.Math.Distance.Between(
            this.player.sprite.x,
            this.player.sprite.y,
            endpointZone.x,
            endpointZone.y
          )
          
          if (distance > Math.max(endpointObj.width, endpointObj.height)) {
            isInEndpoint = false
            Logger.debug('👈 Player left level endpoint')
            gameEvents.emit('levelTransitionCanceled', {
              currentLevel: this.currentLevel
            })
          }
        }
      })

      Logger.debug(`✅ Level endpoint trigger setup at (${endpointObj.x}, ${endpointObj.y})`)
    } catch (e) {
      Logger.error('❌ Error setting up level endpoint:', e.message)
    }
  }
  
  createCollisionBody(obj) {
    let body
    if (obj.circle) {
      const radius = obj.width / 2
      body = this.add.circle(obj.x + radius, obj.y + radius, radius)
    } else {
      body = this.add.rectangle(obj.x + obj.width/2, obj.y + obj.height/2, obj.width, obj.height)
    }
    this.physics.world.enable(body)
    body.body.setImmovable(true)
    return body
  }

  createSampleNPCs() {
    const npcDataList = getNPCsForLevel(this.currentLevel)
    
    Logger.debug(`📍 Creating ${npcDataList.length} NPCs (all will be managed by visibility)`)
    
    // CREATE ALL NPCs at their spawn points (visible status will be managed separately)
    npcDataList.forEach((npcConfigData, index) => {
      const spawnPointName = `npc_spawn_point_${index + 1}`
      let position = { x: 300 + index * 100, y: 300 }
      let patrolArea = null
      
      try {
        const objectLayer = this.currentTilemap.getObjectLayer(spawnPointName)
        if (objectLayer?.objects?.length > 0) {
          const spawnObj = objectLayer.objects[0]
          position = { x: spawnObj.x, y: spawnObj.y }
          
          // Use spawn point's width/height as patrol area if defined
          if (spawnObj.width && spawnObj.height) {
            patrolArea = {
              x: spawnObj.x,
              y: spawnObj.y,
              width: spawnObj.width,
              height: spawnObj.height
            }
          }
        }
      } catch (e) {
        console.warn(`⚠️ Could not find ${spawnPointName}`)
      }
      
      // Get quest data from unified quests using the questId from NPC config
      // questId format: 'quest-variables', 'quest-functions', etc.
      const questData = getQuestForGameMode(npcConfigData.questId)
      if (questData) {
        Logger.debug(`🎯 Loaded quest: ${npcConfigData.questId}`, {
          title: questData.title,
          hasLesson: !!questData.lesson,
          hasQuiz: !!questData.quiz,
          quizQuestions: questData.quiz?.questions?.length || 0
        })
      } else {
        Logger.warn(`❌ MISSING QUEST DATA for: ${npcConfigData.questId}`, {
          npcName: npcConfigData.name,
          questId: npcConfigData.questId
        })
      }
      
      // Build complete NPC data with quest information
      const npcData = {
        ...npcConfigData,
        questData,
        // Add patrol area if found
        ...(patrolArea && { patrolArea })
      }
      
      // Create the NPC with its sprite key
      this.npcSystem.createNPC(position.x, position.y, npcConfigData.spriteKey, npcData)
    })
    
    // Now update visibility based on prerequisites
    this.updateAllNPCVisibility()
  }

  /**
   * Update visibility of all NPCs based on their prerequisites
   * Called during initial NPC creation and after quest completion
   */
  updateAllNPCVisibility() {
    const completedQuests = gameState.getCompletedQuests()
    Logger.debug(`🔍 Checking NPC visibility (${completedQuests.length} completed quests)`, {
      completedQuestIds: completedQuests.map(q => q.id)
    })
    
    this.npcSystem.updateNPCVisibility((npc) => {
      // If no prerequisites, always show
      if (!npc.prerequisites || npc.prerequisites.length === 0) {
        return true
      }
      
      // Check if all prerequisites are completed or in progress
      return npc.prerequisites.every(
        questId => gameState.isQuestCompleted(questId) || gameState.isQuestInProgress(questId)
      )
    })
  }

  setupCamera() {
    if (this.player && this.player.sprite && this.tilemapLoaded) {
      const map = this.make.tilemap({ key: 'map-jungle' })
      
      // Start following player
      this.cameraManager.startFollowing(this.player.sprite, true)
      
      // Set zoom FIRST, then bounds (important order!)
      this.cameraManager.setZoom(3)
      
      // Then set bounds - with zoom 3x, we need to set bounds to map size
      // The camera will automatically clamp to these bounds
      this.cameraManager.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      
      console.log(`🎥 Camera setup complete:`)
      console.log(`   - Following player: YES`)
      console.log(`   - Zoom: 2x`)
      console.log(`   - Map bounds: 0, 0, ${map.widthInPixels}, ${map.heightInPixels}`)
      console.log(`   - Canvas size: ${this.game.canvas.width}x${this.game.canvas.height}px`)
      console.log(`   - Visible area (with 2x zoom): ${Math.round(this.game.canvas.width/2)}x${Math.round(this.game.canvas.height/2)}px`)
    }
  }

  setupInput() {
    // Unlock audio on first user interaction (required for autoplay policies)
    const unlockAudio = () => {
      if (this.sound.locked) {
        this.sound.unlock()
        // Try to play music if it wasn't playing
        if (this.soundManager && !this.soundManager.bgMusic?.isPlaying) {
          this.soundManager.playBGMusic()
        }
      }
    }

    this.input.on('pointerdown', unlockAudio)
    this.input.on('keydown', unlockAudio)

    // Register movement callbacks
    this.inputHandler.onKeyDown('W', () => this.player?.move('up'))
    this.inputHandler.onKeyDown('A', () => this.player?.move('left'))
    this.inputHandler.onKeyDown('S', () => this.player?.move('down'))
    this.inputHandler.onKeyDown('D', () => this.player?.move('right'))
    
    this.inputHandler.onKeyDown('UP', () => this.player?.move('up'))
    this.inputHandler.onKeyDown('LEFT', () => this.player?.move('left'))
    this.inputHandler.onKeyDown('DOWN', () => this.player?.move('down'))
    this.inputHandler.onKeyDown('RIGHT', () => this.player?.move('right'))

    // Interaction key (using new onInteract method)
    this.inputHandler.onInteract(() => this.interactWithNPC())
  }

  setupReactEventListeners() {
    // Track if any UI is currently open
    let uiOpenCount = 0

    // Listen for UI opened (pause game input)
    gameEvents.on('showDialog', (data) => {
      uiOpenCount++
      this.inputHandler.disable()
    })

    gameEvents.on('showQuest', (data) => {
      uiOpenCount++
      this.inputHandler.disable()
    })

    // Listen for dialog closed event from React (resume input)
    gameEvents.on('dialogClosed', (data) => {
      uiOpenCount = Math.max(0, uiOpenCount - 1)
      if (uiOpenCount === 0) {
        this.inputHandler.enable()
      }
    })

    // Listen for quest closed event from React (resume input)
    gameEvents.on('questClosed', (data) => {
      uiOpenCount = Math.max(0, uiOpenCount - 1)
      if (uiOpenCount === 0) {
        this.inputHandler.enable()
      }
    })

    // Listen for quest completed event from React
    gameEvents.on('questCompleted', (data) => {
      const { questId, score, results } = data
      
      const mapping = getLessonToGameMapping()
      let gameQuestId = questId
      let lessonQuestId = null
      
      // Handle both cases:
      // 1. From game mode: questId is like 'quest-variables' (already game ID)
      // 2. From focus mode: questId is like 'vars-quiz' (lesson segment name)
      if (!questId.startsWith('quest-')) {
        // This is from focus mode - convert to game quest ID
        gameQuestId = mapping[questId]
        lessonQuestId = questId
        if (gameQuestId) {
          Logger.debug(`🔄 Converted focus mode questId: ${questId} → ${gameQuestId}`)
        } else {
          Logger.warn(`⚠️ Could not map focus mode questId: ${questId}`)
          gameQuestId = questId
        }
      } else {
        // This is from game mode - convert to lesson/focus mode IDs
        // Find ALL lesson IDs that map to this game quest (there can be multiple!)
        // e.g., quest-functions maps to both functions-intro AND functions-quiz
        const lessonQuestIds = [];
        for (const [lessonId, gameId] of Object.entries(mapping)) {
          if (gameId === gameQuestId) {
            lessonQuestIds.push(lessonId);
            Logger.debug(`  [SYNC] Found mapping: ${lessonId} → ${gameId}`);
          }
        }
        
        // Sync ALL matching lesson quests
        lessonQuestIds.forEach(lessonQuestId => {
          try {
            completeLessonQuest(lessonQuestId, score)
          } catch (e) {
            Logger.warn(`  ⚠️ [SYNC-ERROR] Could not sync ${lessonQuestId}:`, e)
          }
        });
      }
      
      // Mark quest complete in game mode too
      gameState.completeQuest(gameQuestId)
      gameState.set('lastQuestScore', score)
      
      // Award achievements based on score
      if (score >= 80) {
        gameState.set('lastAchievement', 'high_score')
      } else if (score >= 60) {
        gameState.set('lastAchievement', 'quest_completed')
      }

      // Update NPC visibility - show newly available NPCs
      // Works for both game mode and focus mode quest completions
      this.updateAllNPCVisibility()
      Logger.debug(`� NPCs refreshed after quest completion`)

      // Quest completed but still in UI, don't resume yet
      // Input will resume when questClosed is called
    })

    // Listen for level changed event
    gameEvents.on('levelChanged', (levelId) => {
      this.currentLevel = levelId
      gameState.set('currentLevel', levelId)
    })

    // Listen for level transition request from React
    gameEvents.on('transitionToLevel', (data) => {
      const { targetLevel } = data
      this.transitionToLevel(targetLevel)
    })

    // Listen for transition trigger active event
    gameEvents.on('transitionTriggerActive', (data) => {
      // Transition trigger activated
    })

    // Listen for transition trigger canceled event
    gameEvents.on('transitionTriggerCanceled', (data) => {
      // Transition trigger canceled
    })

    // Listen for player stayed event from React
    gameEvents.on('playerStayed', (data) => {
      this.playerStayedInLevel()
    })

    // Listen for player move event
    gameEvents.on('playerMove', (data) => {
      if (this.player) {
        this.player.setPosition(data.x, data.y)
      }
    })

    // Listen for level transition ready event (player reached endpoint)
    gameEvents.on('levelTransitionReady', (data) => {
      console.log(`🚀 Level transition ready! Current level: ${data.currentLevel}`)
      console.log(`📍 Player position: (${data.playerPosition.x}, ${data.playerPosition.y})`)
      
      // Emit transitionTriggerActive to notify React that transition is possible
      gameEvents.emit('transitionTriggerActive', {
        level: data.currentLevel,
        nextLevel: this.getNextLevel(data.currentLevel),
        previousLevel: this.getPreviousLevel(data.currentLevel)
      })
    })

    // Listen for level transition canceled event (player left endpoint)
    gameEvents.on('levelTransitionCanceled', (data) => {
      console.log(`❌ Level transition canceled - player left endpoint`)
      
      // Emit transitionTriggerInactive to notify React
      gameEvents.emit('transitionTriggerInactive', {
        level: data.currentLevel
      })
    })

    // Listen for pause event
    gameEvents.on('gamePaused', () => {
      console.log('⏸ Game paused by user')
      this.physics.pause()
      this.inputHandler.disable()
    })

    // Listen for resume event
    gameEvents.on('gameResumed', () => {
      console.log('▶ Game resumed by user')
      this.physics.resume()
      this.inputHandler.enable()
      
      // Refresh NPCs in case progress changed in Focus Mode
      // Sync updated progress from lesson mode
      const progress = getProgress()
      const quizNameToQuestId = getLessonToGameMapping()
      
      // Mark any newly completed quizzes in gameState
      for (const questName in progress.completedQuests) {
        if (questName.includes('-quiz') || questName.includes('quiz-')) {
          const gameQuestId = quizNameToQuestId[questName]
          if (gameQuestId && !gameState.isQuestCompleted(gameQuestId)) {
            gameState.markQuestCompleted(gameQuestId)
            Logger.debug(`🔄 Synced from Focus Mode: ${questName} → ${gameQuestId}`)
          }
        }
      }
      
      // Recreate NPCs to show any newly unlocked ones
      this.npcSystem.clearNPCs()
      this.createSampleNPCs()
      Logger.debug(`🔄 NPCs refreshed after returning from Focus Mode`)
    })

    // Listen for game exit event
    gameEvents.on('gameExited', () => {
      console.log('🚪 Game exited - returning to main menu')
      this.scene.stop()
    })

    // Listen for input disable event (from lesson mode or other sources)
    gameEvents.on('inputDisabled', (data) => {
      console.log('🔒 Input disabled:', data.reason)
      this.inputHandler.disable()
    })

    // Listen for input enable event
    gameEvents.on('inputEnabled', (data) => {
      console.log('🎮 Input enabled:', data.reason)
      this.inputHandler.enable()
    })

    console.log('✅ React event listeners setup complete')
  }

  /**
   * Get next level ID
   */
  getNextLevel(currentLevel) {
    const levelMap = {
      1: 2,
      2: 3,
      3: 1  // Wrap around to first level
    }
    return levelMap[currentLevel] || 1
  }

  /**
   * Get previous level ID
   */
  getPreviousLevel(currentLevel) {
    const levelMap = {
      1: 3,  // Wrap around to last level
      2: 1,
      3: 2
    }
    return levelMap[currentLevel] || 1
  }

  interactWithNPC() {
    if (!this.player) return

    const playerPos = this.player.getPosition()
    const nearestNPC = this.npcSystem.findNearestNPC(playerPos.x, playerPos.y, 100)

    if (nearestNPC) {
      const interactionData = nearestNPC.interact()
      
      // Check prerequisites before allowing quest
      let canStartQuest = true
      let prerequisiteMessage = ''
      const unmetPrerequisites = []
      
      if (nearestNPC.prerequisites && nearestNPC.prerequisites.length > 0) {
        const incompletePrereqs = nearestNPC.prerequisites.filter(
          questId => !gameState.isQuestCompleted(questId) && !gameState.isQuestInProgress(questId)
        )
        
        if (incompletePrereqs.length > 0) {
          canStartQuest = false
          unmetPrerequisites.push(...incompletePrereqs)
          prerequisiteMessage = `You must complete: ${incompletePrereqs.join(', ')}`
          Logger.warn(`⛔ NPC ${nearestNPC.name} prerequisites not met:`, incompletePrereqs)
        } else {
          Logger.debug(`✅ NPC ${nearestNPC.name} - All prerequisites met`)
        }
      } else {
        Logger.debug(`✅ NPC ${nearestNPC.name} - No prerequisites required (first quest)`)
      }
      
      Logger.debug(`💬 NPC Interaction:`, {
        npcName: nearestNPC.name,
        questId: interactionData.questId,
        prerequisites: nearestNPC.prerequisites || [],
        unmet: unmetPrerequisites,
        canStart: canStartQuest,
        hasQuestData: !!interactionData.questData
      })
      
      // questData from SAMPLE_QUESTS already has { lesson, quiz } structure
      // No transformation needed!
      const questData = canStartQuest ? interactionData.questData : null
      
      Logger.debug('📝 Quest data for dialog:', {
        questId: questData?.id,
        hasLesson: !!questData?.lesson,
        hasQuiz: !!questData?.quiz,
        quizQuestions: questData?.quiz?.questions?.length || 0
      })
      
      // Build complete dialog data with quest info
      const dialogData = {
        id: nearestNPC.name,
        name: interactionData.npcName,
        dialogText: interactionData.dialogText,
        questId: interactionData.questId,
        questData: questData,
        hasQuest: canStartQuest && !!questData,
        prerequisiteMessage: prerequisiteMessage,
        isQuestLocked: !canStartQuest
      }
      
      // Add quest to active quests only if prerequisites met
      if (canStartQuest && questData) {
        gameState.startQuest(questData)
      }
      
      // Log final dialog data before emitting
      Logger.debug('📢 Final Dialog Data:', {
        npcName: dialogData.name,
        hasQuestData: !!dialogData.questData,
        hasLesson: !!dialogData.questData?.lesson,
        hasQuiz: !!dialogData.questData?.quiz,
        isQuestLocked: dialogData.isQuestLocked,
        canStartQuest: canStartQuest
      })
      
      // Emit dialog event to React
      gameEvents.emit('showDialog', dialogData)
      Logger.debug(`💬 Dialog emitted for ${nearestNPC.name}`)
    } else {
      console.log('❌ No NPC in range')
    }
  }

  showDebugInfo() {
    console.log('=== DEBUG INFO ===')
    console.log('Player Position:', this.player?.getPosition())
    console.log('Camera Zoom:', this.cameraManager.getZoom())
    console.log('Active Quests:', gameState.getActiveQuests())
    console.log('Inventory:', gameState.getInventory())
    console.log('Pressed Keys:', this.inputHandler.getPressedKeys())
  }

  update(time, delta) {
    if (!this.player || !this.inputHandler.enabled) return

    // Clamp deltaTime to prevent frame rate stuttering (cap at 16.67ms = 60fps)
    const maxDelta = 16.67
    const clampedDelta = Math.min(delta, maxDelta)
    this.deltaTime = clampedDelta / 1000  // Convert to seconds for consistent physics

    // Handle continuous movement based on key presses
    const movingDirections = this.inputHandler.getMovementDirection()
    
    if (movingDirections.length > 0) {
      // Get the last (most recent) direction
      const direction = movingDirections[movingDirections.length - 1]
      this.player.move(direction)
    } else {
      this.player.stop()
    }

    // Update systems
    this.player.update()
    
    // Pass player position to NPC system for player detection/facing
    const playerPos = this.player.getPosition()
    this.npcSystem.update(clampedDelta, playerPos.x, playerPos.y)

    // Update depth sorting based on Y position (recommended isometric style)
    // Characters lower on screen (higher Y) appear on top
    // Optimize: Only update when position actually changes significantly
    if (this.player?.sprite) {
      this.player.sprite.setDepth(this.player.sprite.y)
    }
    
    const npcs = this.npcSystem.getAllNPCs()
    npcs.forEach(npc => {
      if (npc.sprite) {
        npc.sprite.setDepth(npc.sprite.y)
      }
    })

    // Update HUD text (less frequently for performance)
    if (this.playerPosText && this.player) {
      const pos = this.player.getPosition()
      const activeQuests = gameState.getActiveQuests().length
      const completedQuests = gameState.getCompletedQuests().length
      this.playerPosText.setText(
        `Pos: ${Math.round(pos.x)}, ${Math.round(pos.y)} | ` +
        `Level: ${this.currentLevel} | ` +
        `Quests: ${activeQuests}/${completedQuests}`
      )
    }
  }

  /**
   * Transition to a new level
   * Clears old level and loads new level map and NPCs
   */
  transitionToLevel(targetLevel) {
    // Level 2 is under development in game mode - prevent transition
    if (targetLevel === 2) {
      console.warn(`⚠️ Level 2 is under development in Game Mode`)
      console.log(`📖 Please try Focus Mode (Lessons & Quizzes) to access Level 2`)
      return
    }

    if (targetLevel === this.currentLevel) {
      console.warn(`⚠️ Already on Level ${targetLevel}`)
      return
    }

    const fromLevel = this.currentLevel
    console.log(`🎬 Transitioning from Level ${fromLevel} to Level ${targetLevel}...`)

    try {
      // 1. Update current level FIRST
      this.currentLevel = targetLevel
      gameState.set('currentLevel', targetLevel)

      // 2. Disable input during transition
      this.inputHandler.disable()

      // 3. Clear old NPCs
      if (this.npcSystem) {
        const oldNPCs = this.npcSystem.getAllNPCs()
        oldNPCs.forEach(npc => npc.destroy())
      }

      // 4. Reset tilemap if exists
      if (this.currentTilemap) {
        this.currentTilemap.destroy()
        this.currentTilemap = null
      }

      // 5. Clear all game objects except essential ones
      this.children.list
        .filter(child => !child.isCamera && !child.name?.startsWith('camera_ui'))
        .forEach(child => {
          if (child.destroy && child !== this.player?.sprite) {
            try {
              child.destroy()
            } catch (e) {
              // Ignore errors during cleanup
            }
          }
        })

      // 6. Load new map for target level
      this.createTilemap()

      // 7. Get spawn point position for new level
      let spawnPosition = { x: 300, y: 300 }
      try {
        const spawnLayer = this.currentTilemap.getObjectLayer('player_spawn_point')
        if (spawnLayer?.objects?.length > 0) {
          const spawnObj = spawnLayer.objects[0]
          spawnPosition = { x: spawnObj.x, y: spawnObj.y }
        }
      } catch (e) {
        console.warn(`⚠️ Could not find spawn point: ${e.message}`)
      }

      // 8. Move player to new spawn position
      if (this.player?.sprite) {
        this.player.sprite.setPosition(spawnPosition.x, spawnPosition.y)
        this.player.sprite.setVelocity(0, 0)
      }

      // 9. Reset camera
      this.cameraManager.setBounds(0, 0, this.currentTilemap.widthInPixels, this.currentTilemap.heightInPixels)
      this.cameraManager.setZoom(3)
      if (this.player?.sprite) {
        this.cameraManager.startFollowing(this.player.sprite, true)
      }

      // 10. Re-setup collisions
      this.setupCollisions()

      // 11. Create new NPCs for target level
      this.createSampleNPCs()

      // 13. Re-setup level endpoint trigger
      this.setupLevelEndpoint()

      // 14. Re-enable input
      this.inputHandler.enable()

      // 15. Emit transition complete event
      gameEvents.emit('levelTransitioned', {
        fromLevel: fromLevel,
        toLevel: targetLevel,
        playerPosition: spawnPosition
      })

      console.log(`✅ Level transition complete! Now on Level ${targetLevel}`)
    } catch (error) {
      console.error(`❌ Level transition failed: ${error.message}`, error.stack)
      this.inputHandler.enable() // Re-enable input even on error
    }
  }

  /**
   * Handle player choosing to stay in current level
   */
  playerStayedInLevel() {
    // Player has chosen to stay, just close the transition UI
    console.log(`😊 Player stayed in Level ${this.currentLevel}`)
    
    // Store that player stayed (for future decisions)
    gameState.set('playerStayedInLevel', true)
  }

  setupDiagnostics() {
    // Setup audio diagnostics
    setupAudioDiagnostics(this)
    
    // Expose game mode sync and quest status checker
    window.gameModeSyncStatus = () => {
      const progress = getProgress();
      const { getLessonToGameQuestMapping } = require('../../data/progressManager');
      const mapping = getLessonToGameQuestMapping();
      const allQuests = getNormalizedQuests();
      
      console.group('🎮 GAME MODE SYNC STATUS');
      console.log('');
      console.log('📚 Lesson Mode Progress:');
      console.log('  Completed:', Object.keys(progress.completedQuests).sort());
      console.log('  In Progress:', Object.keys(progress.questResults).sort());
      
      console.log('');
      console.log('🔄 Quest Mapping (Lesson → Game):');
      Object.entries(mapping).forEach(([lessonQuest, gameQuest]) => {
        const isCompleted = !!progress.completedQuests[lessonQuest];
        const status = isCompleted ? '✅' : '❌';
        console.log(`  ${status} ${lessonQuest} → ${gameQuest}`);
      });
      
      console.log('');
      console.log('🎯 Current Game State:');
      const activeQuests = gameState.getActiveQuests();
      const npcPrereqs = this.npcSystem?.getNPCList?.().map(npc => ({
        name: npc.name,
        questId: npc.questId,
        prerequisites: npc.prerequisites
      })) || [];
      
      console.log('  Active Quests:', activeQuests);
      console.log('  NPC Prerequisites:', npcPrereqs);
      
      console.log('');
      console.log('✅ All Lessons & Quizzes:');
      allQuests.forEach((q, idx) => {
        const type = q.type === 'topic' ? '📖' : '❓';
        const completed = !!progress.completedQuests[q.seg_name];
        const inProgress = !!progress.questResults[q.seg_name];
        const status = completed ? '✅' : inProgress ? '🔄' : '🆕';
        console.log(`  ${status} [${idx + 1}] ${type} ${q.seg_name} - ${q.title}`);
      });
      
      console.groupEnd();
    };

    // Quick quest status by name
    window.checkQuestStatus = (questName) => {
      const progress = getProgress();
      const isCompleted = !!progress.completedQuests[questName];
      const isInProgress = !!progress.questResults[questName];
      
      console.log(`📌 Quest Status: ${questName}`, {
        completed: isCompleted,
        inProgress: isInProgress,
        score: progress.questScores[questName] || 'N/A',
        results: progress.questResults[questName] || {}
      });
    };
  }

  /**
   * Initialize backend progress manager for syncing player data
   */
  initializeProgressManager() {
    try {
      // Get player ID from storage
      const playerId = localStorage.getItem('playerId')
      if (!playerId) {
        Logger.warn('⚠️ No player ID found - progress sync disabled')
        return
      }

      // Get or create progress manager from window
      if (!window.playerProgressManager) {
        const { PlayerProgressManager } = require('../utils/PlayerProgressManager')
        window.playerProgressManager = new PlayerProgressManager(playerId)
      }

      const manager = window.playerProgressManager
      this.progressManager = manager

      // Start auto-sync every 30 seconds
      const gameState = {
        currentLevel: this.currentLevel,
        experience: 0,
        completedQuests: [],
        completedLevels: [],
        totalScore: 0,
        playTime: 0
      }

      manager.startAutoSync(gameState, 30000)
      Logger.debug('✅ Progress manager initialized - auto-sync started')

      // Expose for debugging
      window.syncProgress = async (data) => {
        try {
          const result = await manager.saveProgress(data)
          console.log('✅ Progress saved:', result)
        } catch (error) {
          console.error('❌ Failed to save progress:', error)
        }
      }
    } catch (error) {
      Logger.warn('⚠️ Failed to initialize progress manager:', error)
    }
  }

  /**
   * Mark progress as dirty (needs syncing)
   */
  markProgressDirty() {
    if (this.progressManager) {
      this.progressManager.markDirty()
    }
  }

  /**
   * Save progress immediately
   */
  async saveProgress(progressData) {
    if (this.progressManager) {
      try {
        return await this.progressManager.saveProgress(progressData)
      } catch (error) {
        Logger.error('Failed to save progress:', error)
      }
    }
  }

  shutdown() {
    // Stop progress syncing
    if (this.progressManager) {
      this.progressManager.stopAutoSync()
    }

    // Stop other systems
    if (this.mapManager) this.mapManager.destroy()
    if (this.npcSystem) this.npcSystem.destroy()
    if (this.collisionManager) this.collisionManager.clear()
    if (this.soundManager) this.soundManager.shutdown()
  }
}

export default MainScene
