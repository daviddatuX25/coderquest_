import Phaser from 'phaser'
import { gameEvents } from '../utils/EventEmitter'
import { gameState } from '../utils/GameStateManager'
import { PlayerController } from '../objects/PlayerController'
import { NPCSystem } from '../objects/NPCSystem'
import { MapManager } from '../objects/MapManager'
import { CameraManager } from '../objects/CameraManager'
import { CollisionManager } from '../objects/CollisionManager'
import { InputHandler } from '../input/InputHandler'

/**
 * MainScene - Main game scene
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
    this.currentLevel = 1
    this.playerMovingKeys = {
      up: false,
      down: false,
      left: false,
      right: false
    }
  }

  preload() {
    console.log('🎮 MainScene: Preloading assets...')
    // Assets preloaded in BootScene
  }

  create() {
    console.log('🎮 MainScene: Creating game world...')
    
    // Initialize systems in order
    this.mapManager = new MapManager(this)
    this.npcSystem = new NPCSystem(this)
    this.cameraManager = new CameraManager(this)
    this.collisionManager = new CollisionManager(this)
    this.inputHandler = new InputHandler(this)

    // Load tilemap (but don't set up collisions yet)
    this.createTilemap()

    // Create player FIRST
    this.createPlayer()

    // Set up collision AFTER player exists
    this.setupCollisions()

    // Create sample NPCs (test squares for now)
    this.createSampleNPCs()

    // Setup camera
    this.setupCamera()

    // Setup input
    this.setupInput()

    // Setup React event listeners
    this.setupReactEventListeners()

    // Emit event that game is ready
    gameEvents.emit('gameReady', { 
      level: this.currentLevel,
      playerPosition: this.player ? this.player.getPosition() : { x: 100, y: 100 }
    })

    console.log('✅ MainScene: Game ready!')
  }

  createTilemap() {
    try {
      // Layer configuration - walkable layers at bottom, obstacles on top
      const mapConfig = {
        walkable: ['bush', 'tile_platform'],
        obstacles: ['trees5', 'trees4+bush', 'trees3+rock+flower', 'trees2', 'trees1', 'trees0', 'road_rocks', 'elevated_ground']
      }
      
      // Load the jungle map
      const map = this.make.tilemap({ key: 'map-jungle' })
      
      if (!map.tilesets || map.tilesets.length === 0) throw new Error('No tilesets in map')
      
      const tilesetName = map.tilesets[0].name
      let tileset = map.addTilesetImage(tilesetName, 'tf-jungle-tileset')
      
      if (!tileset) {
        tileset = map.addTilesetImage('tf_jungle_tileset', 'tf-jungle-tileset')
      }
      
      if (!tileset) throw new Error('Could not add tileset image')
      
      this.currentTilemap = map  // Store tilemap for reuse
      
      // Create layers with incremental depth ordering
      let layersCreated = 0
      let currentDepth = 0
      this.obstacleLayers = []  // Store obstacle layers for collision setup later
      
      // Create walkable layers (no collision, at bottom)
      mapConfig.walkable.forEach(layerName => {
        try {
          const layer = map.createLayer(layerName, tileset)
          if (layer) {
            layer.setCollisionByProperty({ collides: false })
            layer.setDepth(currentDepth++)
            layersCreated++
          }
        } catch (e) {
          console.warn(`⚠️ ${layerName}: ${e.message}`)
        }
      })
      
      // Player will render here at currentDepth
      const playerDepth = currentDepth
      currentDepth++
      
      // Create obstacle layers (on top) - NO COLLISION on tiles
      // REVERSE ORDER: elevated_ground first (lowest depth), trees5 last (highest depth)
      const reversedObstacles = mapConfig.obstacles.slice().reverse()
      reversedObstacles.forEach(layerName => {
        try {
          const layer = map.createLayer(layerName, tileset)
          if (layer) {
            layer.setDepth(currentDepth++)
            layersCreated++
          }
        } catch (e) {
          console.warn(`⚠️ Skipping ${layerName}`)
        }
      })
      
      // Set player depth ABOVE all static tiles
      this.playerDepth = currentDepth
      this.npcDepth = currentDepth + 1
      
      // Set physics and camera bounds
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      this.tilemapLoaded = true
      
      console.log(`✅ Tilemap loaded: ${map.widthInPixels}x${map.heightInPixels}px (${layersCreated} layers)`)
      
      if (this.fallbackGraphics) {
        this.fallbackGraphics.destroy()
        this.fallbackGraphics = null
      }
    } catch (error) {
      console.error('❌ Map error:', error.message, error.stack)
      this.createSimpleBackground()
      this.tilemapLoaded = false
    }
  }

  createSimpleBackground() {
    // Create simple background while we wait for tilemap assets
    const graphics = this.add.graphics()
    graphics.fillStyle(0x1a5f1a, 1)
    graphics.fillRect(0, 0, 1600, 1200)
    graphics.setDepth(-1)
    
    // Add grid pattern
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
    // Get player spawn point from map
    let spawnPoint = { x: 400, y: 300 }
    
    try {
      const objectLayer = this.currentTilemap.getObjectLayer('player_spawn_point')
      if (objectLayer?.objects?.length > 0) {
        spawnPoint = { x: objectLayer.objects[0].x, y: objectLayer.objects[0].y }
      }
    } catch (e) {
      console.warn('⚠️ Could not find player spawn point')
    }
    
    this.player = new PlayerController(this, spawnPoint.x, spawnPoint.y)
    this.player.sprite.setDepth(this.playerDepth)
    this.player.sprite.setCollideWorldBounds(true)  // Enable world bounds collision
    
    gameState.set('playerPosition', spawnPoint)
  }

  setupCollisions() {
    if (!this.player?.sprite || !this.currentTilemap) return
    
    const objectLayer = this.currentTilemap.getObjectLayer('collision_object_group')
    if (!objectLayer?.objects) return
    
    objectLayer.objects.forEach((obj, index) => {
      try {
        const collisionBody = this.createCollisionBody(obj)
        this.physics.add.collider(this.player.sprite, collisionBody)
      } catch (e) {
        console.warn(`⚠️ Collision setup failed for object #${index}`)
      }
    })
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
    const npcDataList = [
      {
        id: 'npc-mentor',
        name: 'Mentor',
        dialogText: 'Welcome to CoderQuest! Press E to start a quest.',
        questId: 'quest-intro',
        questData: { type: 'intro', difficulty: 'easy', title: 'Welcome Quest' }
      },
      {
        id: 'npc-wizard',
        name: 'Wizard',
        dialogText: 'I have a challenging puzzle for you!',
        questId: 'quest-puzzle',
        questData: { type: 'puzzle', difficulty: 'hard', title: 'Puzzle Quest' }
      },
      {
        id: 'npc-warrior',
        name: 'Warrior',
        dialogText: 'Want to test your coding skills?',
        questId: 'quest-combat',
        questData: { type: 'combat', difficulty: 'medium', title: 'Combat Quest' }
      },
      {
        id: 'npc-sage',
        name: 'Sage',
        dialogText: 'Knowledge is power in CoderQuest!',
        questId: 'quest-knowledge',
        questData: { type: 'knowledge', difficulty: 'medium', title: 'Knowledge Quest' }
      },
      {
        id: 'npc-rogue',
        name: 'Rogue',
        dialogText: 'Got a stealth challenge for you?',
        questId: 'quest-stealth',
        questData: { type: 'stealth', difficulty: 'hard', title: 'Stealth Quest' }
      },
      {
        id: 'npc-healer',
        name: 'Healer',
        dialogText: 'I can help you recover from defeats.',
        questId: 'quest-healing',
        questData: { type: 'support', difficulty: 'easy', title: 'Healing Quest' }
      }
    ]
    
    // Create NPCs at their spawn points
    npcDataList.forEach((npcData, index) => {
      const spawnPointName = `npc_spawn_point_${index + 1}`
      let position = { x: 300 + index * 100, y: 300 }
      
      try {
        const objectLayer = this.currentTilemap.getObjectLayer(spawnPointName)
        if (objectLayer?.objects?.length > 0) {
          position = { x: objectLayer.objects[0].x, y: objectLayer.objects[0].y }
        }
      } catch (e) {
        console.warn(`⚠️ Could not find ${spawnPointName}`)
      }
      
      this.npcSystem.createNPC(position.x, position.y, 'player', npcData)
    })
  }

  setupCamera() {
    if (this.player && this.player.sprite && this.tilemapLoaded) {
      const map = this.make.tilemap({ key: 'map-jungle' })
      
      // Start following player
      this.cameraManager.startFollowing(this.player.sprite, true)
      
      // Set zoom FIRST, then bounds (important order!)
      this.cameraManager.setZoom(2)
      
      // Then set bounds - with zoom 2x, we need to set bounds to map size
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
    // Register movement callbacks
    this.inputHandler.onKeyDown('W', () => this.player?.move('up'))
    this.inputHandler.onKeyDown('A', () => this.player?.move('left'))
    this.inputHandler.onKeyDown('S', () => this.player?.move('down'))
    this.inputHandler.onKeyDown('D', () => this.player?.move('right'))
    
    this.inputHandler.onKeyDown('UP', () => this.player?.move('up'))
    this.inputHandler.onKeyDown('LEFT', () => this.player?.move('left'))
    this.inputHandler.onKeyDown('DOWN', () => this.player?.move('down'))
    this.inputHandler.onKeyDown('RIGHT', () => this.player?.move('right'))

    // Interaction key
    this.inputHandler.onKeyDown('E', () => this.interactWithNPC())

    // Debug key
    this.inputHandler.onKeyDown('ESC', () => this.showDebugInfo())

    console.log('✅ Input setup complete')
  }

  setupReactEventListeners() {
    // Listen for events from React
    gameEvents.on('playerMove', (data) => {
      if (this.player) {
        this.player.setPosition(data.x, data.y)
      }
    })

    gameEvents.on('questCompleted', (questId) => {
      gameState.completeQuest(questId)
    })

    gameEvents.on('levelChanged', (levelId) => {
      this.currentLevel = levelId
      gameState.set('currentLevel', levelId)
    })
  }

  interactWithNPC() {
    if (!this.player) return

    const playerPos = this.player.getPosition()
    const nearestNPC = this.npcSystem.findNearestNPC(playerPos.x, playerPos.y, 100)

    if (nearestNPC) {
      const interactionData = nearestNPC.interact()
      
      // Add quest to active quests
      if (interactionData.questData) {
        gameState.startQuest(interactionData.questData)
      }
      
      gameEvents.emit('showDialog', interactionData)
      console.log(`💬 Interacting with ${nearestNPC.name}`)
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
    this.npcSystem.update(this.deltaTime)

    // Update HUD text
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

  shutdown() {
    if (this.mapManager) this.mapManager.destroy()
    if (this.npcSystem) this.npcSystem.destroy()
    if (this.collisionManager) this.collisionManager.clear()
  }
}

export default MainScene
