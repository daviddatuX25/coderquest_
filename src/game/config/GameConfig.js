import Phaser from 'phaser'
import { BootScene } from '../scenes/BootScene'
import { MainScene } from '../scenes/MainScene'

/**
 * Game config - Phaser configuration
 */
export const gameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false  // DEBUG ENABLED - shows collision bodies
    }
  },
  scene: [BootScene, MainScene],
  render: {
    pixelArt: true,
    antialias: false
  },
  parent: 'phaser-game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

export default gameConfig
