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
      spacing: 1,  // 1px gap between frames (common in RPG spritesheets)
      margin: 1    // 1px border around outer edge
    })
    
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
