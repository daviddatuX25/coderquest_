/**
 * NPC - Non-player character class
 * Represents an individual NPC with sprite, movement, and quest data
 */
export class NPC {
  constructor(scene, x, y, key, data = {}) {
    this.scene = scene
    this.spawnX = x  // Original spawn location (center of patrol area)
    this.spawnY = y
    this.key = key
    this.name = data.name || 'NPC'
    this.dialogText = data.dialogText || 'Hello!'
    this.questId = data.questId || null
    this.questData = data.questData || null
    this.interactionDistance = data.interactionDistance || 100
    this.hasBeenInteracted = false
    
    // Movement properties
    this.patrolRadius = data.patrolRadius || 80  // How far to wander from spawn
    this.moveSpeed = data.moveSpeed || 60  // Pixels per second
    this.isMoving = false
    this.currentDirection = 'down'  // down, up, side
    this.targetX = x
    this.targetY = y
    this.moveTimer = 0
    this.moveInterval = 0
    
    this.createSprite()
    this.setupAnimations()
    this.scheduleRandomMovement()
  }

  createSprite() {
    const npcDepth = this.scene.npcDepth || 100
    
    // Create sprite with the proper NPC spritesheet
    this.sprite = this.scene.physics.add.sprite(this.spawnX, this.spawnY, this.key)
    this.sprite.setScale(1.5)  // Match player scale: 16x21 -> 24x31.5 (roughly)
    this.sprite.setImmovable(true)
    this.sprite.setDepth(npcDepth)
    
    // Set physics body to feet (scale adjusted from 10x5 to 7x3)
    this.sprite.body.setSize(7, 3)
    this.sprite.body.setOffset(2, 12)
    
    this.sprite.npc = this
    
    // Create name label above NPC
    this.nameText = this.scene.add.text(this.spawnX, this.spawnY - 50, this.name, {
      font: '12px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 }
    })
    this.nameText.setOrigin(0.5, 1)
    this.nameText.setDepth(npcDepth + 1)
  }

  setupAnimations() {
    const key = this.key
    
    // Idle animations (single frame, used to change direction)
    if (!this.scene.anims.exists(`${key}-idle-down`)) {
      this.scene.anims.create({
        key: `${key}-idle-down`,
        frames: [{ key, frame: 0 }],
        frameRate: 1
      })
    }
    
    if (!this.scene.anims.exists(`${key}-idle-up`)) {
      this.scene.anims.create({
        key: `${key}-idle-up`,
        frames: [{ key, frame: 1 }],
        frameRate: 1
      })
    }
    
    if (!this.scene.anims.exists(`${key}-idle-side`)) {
      this.scene.anims.create({
        key: `${key}-idle-side`,
        frames: [{ key, frame: 2 }],
        frameRate: 1
      })
    }
    
    // Walk animations (alternating idle + walk frames)
    if (!this.scene.anims.exists(`${key}-walk-down`)) {
      this.scene.anims.create({
        key: `${key}-walk-down`,
        frames: [
          { key, frame: 0 },
          { key, frame: 3 },
          { key, frame: 0 },
          { key, frame: 4 }
        ],
        frameRate: 6,
        repeat: -1
      })
    }
    
    if (!this.scene.anims.exists(`${key}-walk-up`)) {
      this.scene.anims.create({
        key: `${key}-walk-up`,
        frames: [
          { key, frame: 1 },
          { key, frame: 5 },
          { key, frame: 1 },
          { key, frame: 6 }
        ],
        frameRate: 6,
        repeat: -1
      })
    }
    
    if (!this.scene.anims.exists(`${key}-walk-side`)) {
      this.scene.anims.create({
        key: `${key}-walk-side`,
        frames: [
          { key, frame: 2 },
          { key, frame: 7 },
          { key, frame: 2 },
          { key, frame: 8 }
        ],
        frameRate: 6,
        repeat: -1
      })
    }
  }

  scheduleRandomMovement() {
    // Every 2-4 seconds, pick a random direction and move for 1-2 seconds
    this.moveTimer = this.scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000),
      loop: true,
      callback: () => {
        // 70% chance to move, 30% chance to idle and look around
        if (Math.random() < 0.7) {
          this.randomWalk()
        } else {
          this.randomIdle()
        }
      }
    })
  }

  randomWalk() {
    // Pick random direction
    const directions = ['up', 'down', 'left', 'right']
    const moveDirection = Phaser.Utils.Array.GetRandom(directions)
    
    // Calculate target position within patrol radius
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * this.patrolRadius
    const targetX = this.spawnX + Math.cos(angle) * distance
    const targetY = this.spawnY + Math.sin(angle) * distance
    
    this.moveTo(targetX, targetY, moveDirection)
  }

  randomIdle() {
    // Stop moving and look in a random direction
    this.stopMovement()
    const directions = ['down', 'up', 'side']
    const direction = Phaser.Utils.Array.GetRandom(directions)
    this.lookDirection(direction)
  }

  moveTo(targetX, targetY, direction = null) {
    this.targetX = targetX
    this.targetY = targetY
    this.isMoving = true
    
    // Determine direction based on movement
    if (!direction) {
      const dx = targetX - this.sprite.x
      const dy = targetY - this.sprite.y
      
      if (Math.abs(dy) > Math.abs(dx)) {
        this.currentDirection = dy < 0 ? 'up' : 'down'
      } else {
        this.currentDirection = 'side'
      }
    } else {
      this.currentDirection = direction
    }
    
    // Play walk animation
    this.playWalkAnimation()
  }

  stopMovement() {
    this.isMoving = false
    this.sprite.setVelocity(0, 0)
    this.playIdleAnimation()
  }

  lookDirection(direction) {
    this.currentDirection = direction
    this.playIdleAnimation()
    
    // Flip for left/right
    if (direction === 'side') {
      this.sprite.setFlipX(Math.random() > 0.5)
    }
  }

  playWalkAnimation() {
    const animKey = `${this.key}-walk-${this.currentDirection}`
    if (this.scene.anims.exists(animKey)) {
      this.sprite.play(animKey)
    }
  }

  playIdleAnimation() {
    const animKey = `${this.key}-idle-${this.currentDirection}`
    if (this.scene.anims.exists(animKey)) {
      this.sprite.play(animKey)
    }
  }

  getDistance(x, y) {
    const dx = this.sprite.x - x
    const dy = this.sprite.y - y
    return Math.sqrt(dx * dx + dy * dy)
  }

  isInRange(x, y) {
    return this.getDistance(x, y) <= this.interactionDistance
  }

  interact() {
    this.hasBeenInteracted = true
    this.stopMovement()
    return {
      npcName: this.name,
      dialogText: this.dialogText,
      questId: this.questId,
      questData: this.questData
    }
  }

  update(deltaTime) {
    if (!this.isMoving) return
    
    const dx = this.targetX - this.sprite.x
    const dy = this.targetY - this.sprite.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Stop if reached target
    if (distance < 10) {
      this.stopMovement()
      return
    }
    
    // Move towards target
    const vx = (dx / distance) * this.moveSpeed
    const vy = (dy / distance) * this.moveSpeed
    this.sprite.setVelocity(vx, vy)
    
    // Update name label position
    if (this.nameText) {
      this.nameText.setPosition(this.sprite.x, this.sprite.y - 50)
    }
  }

  destroy() {
    if (this.moveTimer) this.moveTimer.remove()
    if (this.sprite) this.sprite.destroy()
    if (this.nameText) this.nameText.destroy()
  }
}

/**
 * NPCSystem - Manages all NPCs in the scene
 * Handles creation, interaction detection, and updates
 */
export class NPCSystem {
  constructor(scene) {
    this.scene = scene
    this.npcs = new Map()
    this.npcSprites = this.scene.physics.add.group()
  }

  createNPC(x, y, key, data = {}) {
    const id = data.id || `npc-${this.npcs.size}`
    // Use npc_girl for all NPCs for now (can be expanded to use different sprites)
    const spriteKey = key === 'player' ? 'npc_girl' : key
    const npc = new NPC(this.scene, x, y, spriteKey, data)
    this.npcs.set(id, npc)
    this.npcSprites.add(npc.sprite)
    return npc
  }

  getNPC(id) {
    return this.npcs.get(id)
  }

  getAllNPCs() {
    return Array.from(this.npcs.values())
  }

  findNearestNPC(x, y, maxDistance = 100) {
    let nearest = null
    let minDistance = maxDistance

    this.npcs.forEach(npc => {
      const distance = npc.getDistance(x, y)
      if (distance < minDistance) {
        nearest = npc
        minDistance = distance
      }
    })

    return nearest
  }

  findNPCsInRange(x, y, range = 100) {
    return this.getAllNPCs().filter(npc => npc.isInRange(x, y))
  }

  update(deltaTime) {
    this.npcs.forEach(npc => npc.update(deltaTime))
  }

  destroy() {
    this.npcs.forEach(npc => npc.destroy())
    this.npcs.clear()
  }
}

export default NPCSystem
