import Phaser from 'phaser'
import { gameEvents } from '../utils/EventEmitter'

/**
 * BootScene - Initialize game, load assets
 * Runs once at game startup before MainScene
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    console.log('🎮 BootScene: Loading assets...')
    
    // Show loading progress
    this.load.on('progress', (value) => {
      console.log(`📦 Loading: ${Math.round(value * 100)}%`)
    })

    // Show file complete
    this.load.on('filecomplete', (key, type, data) => {
      if (type === 'spritesheet' && key.startsWith('animal_')) {
        console.log(`📄 Loaded spritesheet: ${key} - ${data.frameConfig ? data.frameConfig.frameTotal : '?'} frames`)
      }
    })

    // Load player spritesheets - IDLE and WALK separate
    // Idle: 4 columns × 3 rows = 32x32 pixels per frame
    this.load.spritesheet('player_idle', 'assets/characters/Idle.png', { 
      frameWidth: 32, 
      frameHeight: 32 
    })
    
    // Walk: 6 columns × 3 rows = 32x32 pixels per frame
    this.load.spritesheet('player_walk', 'assets/characters/Walk.png', { 
      frameWidth: 32, 
      frameHeight: 32 
    })
    
    // Load NPC spritesheets
    // npc1: 9 frames in 1 row (16x21 pixels per frame)
    // Frames: [Down, Up, Side, DownWalk1, DownWalk2, UpWalk1, UpWalk2, SideWalk1, SideWalk2]
    this.load.spritesheet('npc_girl', 'assets/characters/npc1.png', { 
      frameWidth: 16, 
      frameHeight: 21,
      spacing: 1,
      margin: 1
    })
    
    // Load animal NPCs (6 columns × 8 rows on different sized spritesheets)
    // Bull & Calf: 384×512 → 64×64px per frame
    // Lamb, Piglet, Rooster, Sheep, Turkey: 192×256 → 32×32px per frame
    // Chick: 96×128 → 16×16px per frame
    
    // Large animals: Bull, Calf (384×512, 64×64 frames)
    this.load.spritesheet('animal_bull', 'assets/animals/Bull_animation_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64,
      spacing: 0,
      margin: 0
    })
    this.load.spritesheet('animal_calf', 'assets/animals/Calf_animation_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64,
      spacing: 0,
      margin: 0
    })
    
    // Medium animals: Lamb, Piglet, Rooster, Sheep, Turkey (192×256, 32×32 frames)
    this.load.spritesheet('animal_lamb', 'assets/animals/Lamb_animation_with_shadow.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    })
    this.load.spritesheet('animal_piglet', 'assets/animals/Piglet_animation_with_shadow.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    })
    this.load.spritesheet('animal_rooster', 'assets/animals/Rooster_animation_with_shadow.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    })
    this.load.spritesheet('animal_sheep', 'assets/animals/Sheep_animation_with_shadow.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    })
    this.load.spritesheet('animal_turkey', 'assets/animals/Turkey_animation_with_shadow.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    })
    
    // Small animals: Chick (96×128, 16×16 frames)
    this.load.spritesheet('animal_chick', 'assets/animals/Chick_animation_with_shadow.png', {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 0,
      margin: 0
    })
    
    // Load Level 2 NPC player sprites (9 NPCs for Town map)
    // These are single-frame sprites for NPC players
    for (let i = 1; i <= 9; i++) {
      this.load.image(`npc_player_${i}`, `assets/npc_players/npc_${i}.png`)
    }
    
    // Load tilesets
    this.load.image('tf-jungle-tileset', 'assets/tf_jungle_tileset.png')
    this.load.image('village-tileset', 'assets/Serene_Village_16x16.png')
    
    // Load tilemaps
    this.load.tilemapTiledJSON('map-jungle', 'assets/map1_jungle.tmj')
    this.load.tilemapTiledJSON('map-jungle-simple', 'assets/map1_jungle_simple.tmj')
    this.load.tilemapTiledJSON('map-town', 'assets/map2_town.tmj')
    this.load.tilemapTiledJSON('map-town-simple', 'assets/map2_town_simple.tmj')
    this.load.tilemapTiledJSON('map-city', 'assets/map3_city.tmj')
    this.load.tilemapTiledJSON('map-city-simple', 'assets/map3_city_simple.tmj')
    
    // Load audio
    this.load.audio('bgmusic', 'assets/sounds/farm_bgmusic.mp3')
    this.load.audio('cow', 'assets/sounds/cow.mp3')
    this.load.audio('lamb', 'assets/sounds/lamb.mp3')
    this.load.audio('pig', 'assets/sounds/pig.mp3')
    this.load.audio('rooster', 'assets/sounds/rooster.mp3')
    this.load.audio('sheep', 'assets/sounds/sheep.mp3')
    this.load.audio('turkey', 'assets/sounds/turkey.mp3')
  }

  create() {
    console.log('🎮 BootScene: Assets loaded, starting MainScene...')
    
    // Initialize global events if not already done
    if (!window.gameEvents) {
      window.gameEvents = gameEvents
    }
    
    // Start the main game scene
    this.scene.start('MainScene')
  }
}

export default BootScene
