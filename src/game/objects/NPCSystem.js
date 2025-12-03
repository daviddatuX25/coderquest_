/**
 * NPC - Non-player character class
 * Represents an individual NPC with sprite, movement, and quest data
 * Supports both human NPCs (16x21) and animal NPCs (32x32)
 */
export class NPC {
  constructor(scene, x, y, key, data = {}) {
    this.scene = scene
    this.spawnX = x
    this.spawnY = y
    this.key = key
    this.name = data.name || 'NPC'
    this.dialogText = data.dialogText || 'Hello!'
    this.questId = data.questId || null
    this.questData = data.questData || null
    this.questOrder = data.questOrder || null  // Track quest order in progression
    this.prerequisites = data.prerequisites || []  // Quest IDs that must be completed first
    this.interactionDistance = data.interactionDistance || 150  // Increased from 100 for better interaction range
    this.detectionDistance = data.detectionDistance || 100  // Distance at which NPC notices player and faces them
    this.hasBeenInteracted = false
    this.playerNearby = false  // Track if player is in detection range
    
    // Determine NPC type and frame config
    this.isAnimal = this.key.startsWith('animal_')
    
    if (this.isAnimal) {
      // Different animals have different frame sizes
      if (this.key.includes('bull') || this.key.includes('calf')) {
        // Large: Bull, Calf (64×64)
        this.frameConfig = { width: 64, height: 64, scale: 1.05 }
      } else if (this.key.includes('chick')) {
        // Small: Chick (16×16)
        this.frameConfig = { width: 16, height: 16, scale: 2.1 }
      } else {
        // Medium: Lamb, Piglet, Rooster, Sheep, Turkey (32×32)
        this.frameConfig = { width: 32, height: 32, scale: 1.4 }
      }
    } else {
      // Human NPCs (16×21)
      this.frameConfig = { width: 16, height: 21, scale: 1.5 }
    }
    
    // Movement properties
    this.patrolArea = data.patrolArea || null
    this.patrolRadius = data.patrolRadius || 80
    this.moveSpeed = data.moveSpeed || 60
    this.isMoving = false
    this.isWalking = false  // Track if currently executing a walk movement (vs other movement types)
    this.currentDirection = 'down'
    this.lastDirection = null  // Track last direction for animation changes - null ensures first animation plays
    this.targetX = x
    this.targetY = y
    this.moveTimer = 0
    this.movementRepeatCount = 0  // Track how many times we've moved in current direction
    this.isCollidingWithPlayer = false  // Track player collision state
    
    this.createSprite()
    this.setupAnimations()
    this.scheduleRandomMovement()
  }

  createSprite() {
    const npcDepth = this.scene.npcDepth || 100
    
    this.sprite = this.scene.physics.add.sprite(this.spawnX, this.spawnY, this.key)
    this.sprite.setScale(this.frameConfig.scale)
    this.sprite.setImmovable(false)  // Allow movement
    this.sprite.setBounce(0)  // No bounce
    this.sprite.setDrag(0)  // No drag
    this.sprite.setDepth(npcDepth)
    
    // Custom separation to prevent player from pushing NPC
    // Disable automatic separation in x and y
    this.sprite.body.customSeparateX = true;
    this.sprite.body.customSeparateY = true;
    console.log('✅ NPC set to custom separation (unpushable)');
    
    // Set physics body to feet
    if (this.isAnimal) {
      if (this.key.includes('bull') || this.key.includes('calf')) {
        // Large: Bull, Calf (64×64) -> 16x12 hitbox
        this.sprite.body.setSize(16, 12)
        this.sprite.body.setOffset(24, 30)
      } else if (this.key.includes('chick')) {
        // Small: Chick (16×16) -> 5x3 hitbox
        this.sprite.body.setSize(5, 3)
        this.sprite.body.setOffset(5, 6)
      } else {
        // Medium: others (32×32) -> 10x8 hitbox
        this.sprite.body.setSize(10, 8)
        this.sprite.body.setOffset(11, 12)
      }
    } else {
      // Humans: 16x21 frames -> 7x3 hitbox at feet
      this.sprite.body.setSize(7, 3)
      this.sprite.body.setOffset(2, 6)
    }
    
    this.sprite.npc = this
    
    // Create name label
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
    if (this.isAnimal) {
      this.setupAnimalAnimations()
    } else {
      this.setupHumanAnimations()
    }
  }

  setupHumanAnimations() {
    const key = this.key
    
    // Idle animations (single frame)
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

  setupAnimalAnimations() {
    const key = this.key
    
    // Animals: 6 columns × 8 rows layout
    // Row 1: Walk Down (frames 0-5, 6 frames)
    // Row 2: Walk Up (frames 6-11, 6 frames)
    // Row 3: Walk Left (frames 12-17, 6 frames)
    // Row 4: Walk Right (frames 18-23, 6 frames)
    // Row 5: Idle Down (frames 24-27, 4 frames)
    // Row 6: Idle Up (frames 30-33, 4 frames - skip 28-29 which are blank)
    // Row 7: Idle Left (frames 36-39, 4 frames)
    // Row 8: Idle Right (frames 42-45, 4 frames)
    
    // Test if spritesheet is loaded
    const textures = this.scene.textures.get(key)
    if (!textures) return
    
    // Walk animations (6 frames - continuous motion)
    if (!this.scene.anims.exists(`${key}-walk-down`)) {
      try {
        this.scene.anims.create({
          key: `${key}-walk-down`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 5 }),
          frameRate: 8,
          repeat: -1
        })
      } catch (e) {
        // Handle error silently
      }
    }
    
    if (!this.scene.anims.exists(`${key}-walk-up`)) {
      try {
        this.scene.anims.create({
          key: `${key}-walk-up`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 6, end: 11 }),
          frameRate: 8,
          repeat: -1
        })
      } catch (e) {
        // Handle error silently
      }
    }
    
    if (!this.scene.anims.exists(`${key}-walk-left`)) {
      try {
        this.scene.anims.create({
          key: `${key}-walk-left`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 12, end: 17 }),
          frameRate: 8,
          repeat: -1
        })
      } catch (e) {
        // Handle error silently
      }
    }
    
    if (!this.scene.anims.exists(`${key}-walk-right`)) {
      try {
        this.scene.anims.create({
          key: `${key}-walk-right`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 18, end: 23 }),
          frameRate: 8,
          repeat: -1
        })
      } catch (e) {
        // Handle error silently
      }
    }
    
    // Idle animations (4 frames - looping idle)
    if (!this.scene.anims.exists(`${key}-idle-down`)) {
      try {
        this.scene.anims.create({
          key: `${key}-idle-down`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 24, end: 27 }),
          frameRate: 4,
          repeat: -1
        })
      } catch (e) {
        // Handle error silently
      }
    }
    
    if (!this.scene.anims.exists(`${key}-idle-up`)) {
      try {
        this.scene.anims.create({
          key: `${key}-idle-up`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 30, end: 33 }),
          frameRate: 4,
          repeat: -1
        })
      } catch (e) {
        // Handle error silently
      }
    }
    
    if (!this.scene.anims.exists(`${key}-idle-left`)) {
      try {
        this.scene.anims.create({
          key: `${key}-idle-left`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 36, end: 39 }),
          frameRate: 4,
          repeat: -1
        })
      } catch (e) {
        // Handle error silently
      }
    }
    
    if (!this.scene.anims.exists(`${key}-idle-right`)) {
      try {
        this.scene.anims.create({
          key: `${key}-idle-right`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 42, end: 45 }),
          frameRate: 4,
          repeat: -1
        })
      } catch (e) {
        // Handle error silently
      }
    }
  }

  scheduleRandomMovement() {
    // Every 2-4 seconds, pick a random direction and move twice before randomizing again
    this.moveTimer = this.scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000),
      loop: true,
      callback: () => {
        this.movementRepeatCount++
        
        // Move twice in same direction before randomizing
        if (this.movementRepeatCount <= 2) {
          // 70% chance to move, 30% chance to idle and look around
          if (Math.random() < 0.7) {
            this.randomWalk()
          } else {
            this.randomIdle()
          }
        } else {
          // Reset counter after 2 movements
          this.movementRepeatCount = 0
        }
      }
    })
  }

  randomWalk() {
    // Pick random direction
    const directions = ['up', 'down', 'left', 'right']
    const moveDirection = Phaser.Utils.Array.GetRandom(directions)
    
    let targetX, targetY
    
    if (this.patrolArea) {
      // Use patrol area bounds (rectangle from map spawn point)
      const area = this.patrolArea
      const padding = 20  // Stay inset from edges
      targetX = Phaser.Math.Between(
        area.x + padding,
        area.x + area.width - padding
      )
      targetY = Phaser.Math.Between(
        area.y + padding,
        area.y + area.height - padding
      )
    } else {
      // Use circular patrol radius (legacy fallback)
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * this.patrolRadius
      targetX = this.spawnX + Math.cos(angle) * distance
      targetY = this.spawnY + Math.sin(angle) * distance
    }
    
    this.moveTo(targetX, targetY, moveDirection, true)  // Pass true to indicate walk movement
  }

  randomIdle() {
    // Stop moving and look in a random direction
    this.stopMovement()
    const directions = ['down', 'up', 'left', 'right']
    const direction = Phaser.Utils.Array.GetRandom(directions)
    this.lookDirection(direction)
  }

  moveTo(targetX, targetY, direction = null, isWalking = false) {
    if (!this.sprite) return
    
    this.targetX = targetX
    this.targetY = targetY
    this.isMoving = true
    this.isWalking = isWalking  // Track if this is a walk movement
    
    // Determine direction based on movement
    if (!direction) {
      const dx = targetX - this.sprite.x
      const dy = targetY - this.sprite.y
      
      if (Math.abs(dy) > Math.abs(dx)) {
        this.currentDirection = dy < 0 ? 'up' : 'down'
      } else {
        this.currentDirection = dx < 0 ? 'left' : 'right'
      }
    } else {
      this.currentDirection = direction
    }
    
    // Play walk animation
    this.playWalkAnimation()
  }

  stopMovement() {
    if (!this.sprite) return
    
    this.isMoving = false
    this.isWalking = false  // Clear walking flag when stopping
    // Only set velocity if physics body exists
    if (this.sprite.body) {
      this.sprite.setVelocity(0, 0)
    }
    this.playIdleAnimation()
  }

  lookDirection(direction) {
    this.currentDirection = direction
    this.playIdleAnimation()
    // No sprite flipping - rely on directional idle animations (left, right, up, down frames)
  }

  playWalkAnimation() {
    const animKey = `${this.key}-walk-${this.currentDirection}`
    try {
      // Only skip if exact same animation is already playing
      if (this.sprite.anims.currentAnim?.key === animKey) return
      
      const exists = this.scene.anims.exists(animKey)
      if (exists && this.sprite) {
        this.sprite.play(animKey, true)
      }
    } catch (e) {
      // Handle error silently
    }
  }

  playIdleAnimation() {
    const animKey = `${this.key}-idle-${this.currentDirection}`
    try {
      // Only skip if exact same animation is already playing
      if (this.sprite.anims.currentAnim?.key === animKey) return
      
      const exists = this.scene.anims.exists(animKey)
      if (exists && this.sprite) {
        this.sprite.play(animKey, true)
      }
    } catch (e) {
      // Handle error silently
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

  /**
   * Face towards a target (player)
   * Determines direction based on relative position
   * If NPC is to the right of player (npcX > playerX), face left
   * If NPC is to the left of player (npcX < playerX), face right
   * If NPC is below player (npcY > playerY), face up
   * If NPC is above player (npcY < playerY), face down
   */
  faceTowards(targetX, targetY) {
    const dx = this.sprite.x - targetX
    const dy = this.sprite.y - targetY
    
    // Determine primary direction based on which axis has larger difference
    if (Math.abs(dy) > Math.abs(dx)) {
      // Y axis is more significant
      if (dy > 0) {
        this.lookDirection('up')  // NPC is below target, look up
      } else {
        this.lookDirection('down')  // NPC is above target, look down
      }
    } else {
      // X axis is more significant
      if (dx > 0) {
        this.lookDirection('left')  // NPC is to the right of target, look left
      } else {
        this.lookDirection('right')  // NPC is to the left of target, look right
      }
    }
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

  update(deltaTime, playerX = null, playerY = null) {
    if (!this.sprite) return
    
    // Check if player is in detection range and face them
    // BUT: Only face the player if NOT actively walking (randomWalk with walk animation)
    if (playerX !== null && playerY !== null) {
      const playerDistance = this.getDistance(playerX, playerY)
      
      if (playerDistance <= this.detectionDistance) {
        // Player is nearby
        this.playerNearby = true
        // Only face towards player if NOT in an active walk movement
        if (!this.isWalking) {
          this.faceTowards(playerX, playerY)
        }
      } else {
        this.playerNearby = false
      }
    }
    
    // Only update movement if actually moving
    if (!this.isMoving) return
    
    const dx = this.targetX - this.sprite.x
    const dy = this.targetY - this.sprite.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Stop if reached target
    if (distance < 10) {
      this.stopMovement()
      return
    }
    
    // Move in only one direction at a time (no diagonal/slanting)
    let vx = 0
    let vy = 0
    
    if (Math.abs(dy) > Math.abs(dx)) {
      // Move vertically (up/down)
      vy = (dy > 0 ? 1 : -1) * this.moveSpeed
    } else {
      // Move horizontally (left/right)
      vx = (dx > 0 ? 1 : -1) * this.moveSpeed
    }
    
    // Only set velocity if physics body exists
    if (this.sprite.body) {
      this.sprite.setVelocity(vx, vy)
    }
    
    // Update name label position
    if (this.nameText) {
      this.nameText.setPosition(this.sprite.x, this.sprite.y - 50)
    }
  }

  /**
   * Set visibility of NPC
   * @param {boolean} visible - Whether NPC should be visible
   */
  setVisible(visible) {
    if (this.sprite) {
      this.sprite.setVisible(visible)
      this.sprite.active = visible // Also control physics
    }
    if (this.nameText) {
      this.nameText.setVisible(visible)
    }
  }

  /**
   * Check if NPC is visible
   * @returns {boolean} Whether NPC is currently visible
   */
  isVisible() {
    return this.sprite ? this.sprite.visible : false
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
    
    // Animal sprite pool for round-robin assignment
    this.animalSprites = [
      'animal_bull',
      'animal_calf',
      'animal_chick',
      'animal_lamb',
      'animal_piglet',
      'animal_rooster',
      'animal_sheep',
      'animal_turkey'
    ]
    this.nextAnimalIndex = 0
  }

  createNPC(x, y, key, data = {}) {
    const id = data.id || `npc-${this.npcs.size}`
    
    // Determine sprite to use
    let spriteKey
    if (key === 'player') {
      // Round-robin assign animals
      spriteKey = this.animalSprites[this.nextAnimalIndex % this.animalSprites.length]
      this.nextAnimalIndex++
    } else {
      spriteKey = key
    }
    
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

  update(deltaTime, playerX = null, playerY = null) {
    this.npcs.forEach(npc => {
      npc.update(deltaTime, playerX, playerY)
      // Reset collision state each frame
      npc.isCollidingWithPlayer = false
    })
  }

  /**\n   * Update visibility of all NPCs based on their prerequisites
   * Shows NPCs only if their prerequisites are met
   * Called when quest completion changes available NPCs
   * @param {Function} checkPrerequisites - Function that checks if NPC prerequisites are met
   */
  updateNPCVisibility(checkPrerequisites) {
    console.log(`🔍 Updating NPC visibility (${this.npcs.size} total NPCs)`)
    
    this.npcs.forEach((npc, npcId) => {
      const meetsRequirements = checkPrerequisites(npc)
      const wasVisible = npc.isVisible()
      
      console.log(`  📊 ${npc.name}: prerequisites=[${npc.prerequisites?.join(', ') || 'none'}], meetsReqs=${meetsRequirements}, wasVisible=${wasVisible}`)
      
      if (meetsRequirements && !wasVisible) {
        // NPC just became available - show it with a nice fade-in
        npc.setVisible(true)
        console.log(`    ✨ NEW NPC AVAILABLE: ${npc.name}`)
      } else if (!meetsRequirements && wasVisible) {
        // Prerequisites not met - hide NPC
        npc.setVisible(false)
        console.log(`    🚫 NPC HIDDEN: ${npc.name}`)
      } else if (meetsRequirements && wasVisible) {
        console.log(`    ✅ Already visible and requirements met`)
      } else {
        console.log(`    ⏸️ Already hidden and requirements not met`)
      }
    })
  }

  /**
   * Clear all NPCs (destroy sprites/text, clear from map)
   * Used when refreshing NPC list after progress changes
   */
  clearNPCs() {
    this.npcs.forEach(npc => npc.destroy())
    this.npcs.clear()
  }

  destroy() {
    this.npcs.forEach(npc => npc.destroy())
    this.npcs.clear()
  }
}

export default NPCSystem
