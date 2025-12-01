/**
 * PlayerController - Handles player sprite, movement, and animations
 * Manages player physics, velocity, and state
 * 
 * Uses separate spritesheets:
 * - Idle.png: 4 columns × 3 rows (48×48 px frames)
 *   Row 0: Down (frames 0-3)
 *   Row 1: Up (frames 4-7)
 *   Row 2: Side (frames 8-11)
 * 
 * - Walk.png: 6 columns × 3 rows (48×48 px frames)
 *   Row 0: Down (frames 0-5)
 *   Row 1: Up (frames 6-11)
 *   Row 2: Side (frames 12-17)
 */
export class PlayerController {
  constructor(scene, x, y) {
    this.scene = scene
    this.x = x
    this.y = y
    this.speed = 150
    this.isMoving = false
    this.currentDirection = 'down'
    this.lastPlayedAnim = 'idle-down'
    
    this.createSprite()
    this.setupAnimations()
  }

  createSprite() {
    // Create player sprite with physics - start with idle texture
    this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'player_idle')
    this.sprite.setBounce(0, 0)
    this.sprite.setScale(1.5)
    this.sprite.setOrigin(0.5, 0.5)
    
    // Resize physics body to feet only (frame: 32x32px)
    this.sprite.body.setSize(14, 10)
    this.sprite.body.setOffset(9, 22)
    
    this.sprite.controller = this
  }

  setupAnimations() {
    // --- IDLE ANIMATIONS (using 'player_idle' texture) ---
    if (!this.scene.anims.exists('idle-down')) {
      this.scene.anims.create({
        key: 'idle-down',
        frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      })
    }

    if (!this.scene.anims.exists('idle-up')) {
      this.scene.anims.create({
        key: 'idle-up',
        frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
      })
    }

    if (!this.scene.anims.exists('idle-side')) {
      this.scene.anims.create({
        key: 'idle-side',
        frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1
      })
    }

    // --- WALK ANIMATIONS (using 'player_walk' texture) ---
    if (!this.scene.anims.exists('walk-down')) {
      this.scene.anims.create({
        key: 'walk-down',
        frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
      })
    }

    if (!this.scene.anims.exists('walk-up')) {
      this.scene.anims.create({
        key: 'walk-up',
        frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1
      })
    }

    if (!this.scene.anims.exists('walk-side')) {
      this.scene.anims.create({
        key: 'walk-side',
        frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 12, end: 17 }),
        frameRate: 10,
        repeat: -1
      })
    }
  }

  move(direction) {
    const speed = this.speed
    let vx = 0
    let vy = 0

    switch (direction) {
      case 'up':
        vy = -speed
        this.currentDirection = 'up'
        this.playWalkAnimation('walk-up', false)
        console.log(`🔼 Moving UP - velocity: (${vx}, ${vy})`)
        break
      case 'down':
        vy = speed
        this.currentDirection = 'down'
        this.playWalkAnimation('walk-down', false)
        console.log(`🔽 Moving DOWN - velocity: (${vx}, ${vy})`)
        break
      case 'left':
        vx = -speed
        this.currentDirection = 'left'
        this.playWalkAnimation('walk-side', true)  // Flip for left
        console.log(`◀️ Moving LEFT - velocity: (${vx}, ${vy})`)
        break
      case 'right':
        vx = speed
        this.currentDirection = 'right'
        this.playWalkAnimation('walk-side', false)  // No flip for right
        console.log(`▶️ Moving RIGHT - velocity: (${vx}, ${vy})`)
        break
    }

    this.sprite.setVelocity(vx, vy)
    this.isMoving = true
    console.log(`📍 Player pos: (${this.sprite.x.toFixed(0)}, ${this.sprite.y.toFixed(0)})`)
  }

  /**
   * Handle walk animation with texture switching
   */
  playWalkAnimation(animKey, flipX) {
    // Switch texture to walk if not already walking
    if (this.sprite.texture.key !== 'player_walk') {
      this.sprite.setTexture('player_walk')
    }
    
    this.sprite.setFlipX(flipX)
    this.sprite.play(animKey, true)
    this.lastPlayedAnim = animKey
  }

  stop() {
    this.sprite.setVelocity(0, 0)
    this.isMoving = false
    console.log(`⏸️ Movement stopped - pos: (${this.sprite.x.toFixed(0)}, ${this.sprite.y.toFixed(0)})`)
    this.playIdleAnimation()
  }

  /**
   * Handle idle animation with texture switching
   * Based on last direction played
   */
  playIdleAnimation() {
    // Determine which idle to play based on last walk animation
    let idleKey = 'idle-down'
    let flipX = false

    if (this.lastPlayedAnim.includes('walk-side')) {
      idleKey = 'idle-side'
      flipX = this.sprite.flipX  // Keep the same flip state
    } else if (this.lastPlayedAnim.includes('walk-up')) {
      idleKey = 'idle-up'
    } else if (this.lastPlayedAnim.includes('walk-down')) {
      idleKey = 'idle-down'
    }

    // Switch texture to idle
    if (this.sprite.texture.key !== 'player_idle') {
      this.sprite.setTexture('player_idle')
    }

    this.sprite.setFlipX(flipX)
    this.sprite.play(idleKey, true)
    this.lastPlayedAnim = idleKey
  }

  getPosition() {
    return {
      x: this.sprite.x,
      y: this.sprite.y
    }
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y)
  }

  update() {
    // Update called each frame - can add continuous logic here
    // e.g., friction, animations, etc
  }
}

export default PlayerController
