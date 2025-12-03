/**
 * InputHandler - Centralized input management for keyboard, mouse, and touch
 */
export class InputHandler {
  constructor(scene) {
    this.scene = scene
    this.keys = {}
    this.pressedKeys = new Set()
    this.callbacks = {}
    this.enabled = true
    this.trackedKeys = [] // Store tracked keys
    
    this.setupKeyboard()
  }

  /**
   * Setup keyboard input
   */
  setupKeyboard() {
    // Movement keys
    const movementKeys = ['W', 'A', 'S', 'D', 'UP', 'DOWN', 'LEFT', 'RIGHT']
    const actionKeys = ['E', 'SPACE', 'ENTER', 'ESC']
    
    this.trackedKeys = [...movementKeys, ...actionKeys]
    
    this.trackedKeys.forEach(key => {
      this.keys[key] = this.scene.input.keyboard.addKey(key, false)  // Don't capture
    })

    // Listen for key down events - BEFORE Phaser processes them
    this.scene.input.keyboard.on('keydown', (event) => {
      // If disabled, allow event to propagate to browser/React
      if (!this.enabled) {
        // Don't prevent default - let browser handle it
        return
      }
      
      // Only prevent default and process if enabled
      const key = event.key.toUpperCase()
      
      // Check if this is one of our tracked keys
      if (this.trackedKeys.includes(key)) {
        event.preventDefault()
      }
      
      this.pressedKeys.add(key)
      
      if (this.callbacks[`keydown-${key}`]) {
        this.callbacks[`keydown-${key}`].forEach(cb => cb(event))
      }
    })

    // Listen for key up events
    this.scene.input.keyboard.on('keyup', (event) => {
      const key = event.key.toUpperCase()
      this.pressedKeys.delete(key)
      
      if (this.callbacks[`keyup-${key}`]) {
        this.callbacks[`keyup-${key}`].forEach(cb => cb(event))
      }
    })
  }

  /**
   * Register key press callback
   */
  onKeyDown(key, callback) {
    const eventKey = `keydown-${key.toUpperCase()}`
    if (!this.callbacks[eventKey]) {
      this.callbacks[eventKey] = []
    }
    this.callbacks[eventKey].push(callback)
  }

  /**
   * Register key release callback
   */
  onKeyUp(key, callback) {
    const eventKey = `keyup-${key.toUpperCase()}`
    if (!this.callbacks[eventKey]) {
      this.callbacks[eventKey] = []
    }
    this.callbacks[eventKey].push(callback)
  }

  /**
   * Check if key is currently pressed
   */
  isKeyDown(key) {
    return this.pressedKeys.has(key.toUpperCase())
  }

  /**
   * Get all pressed keys
   */
  getPressedKeys() {
    return Array.from(this.pressedKeys)
  }

  /**
   * Check if any movement keys are pressed
   */
  isMoving() {
    return this.isKeyDown('W') || this.isKeyDown('A') || 
           this.isKeyDown('S') || this.isKeyDown('D') ||
           this.isKeyDown('UP') || this.isKeyDown('DOWN') ||
           this.isKeyDown('LEFT') || this.isKeyDown('RIGHT')
  }

  /**
   * Get movement direction based on pressed keys
   */
  getMovementDirection() {
    const directions = []
    
    if (this.isKeyDown('W') || this.isKeyDown('UP')) directions.push('up')
    if (this.isKeyDown('S') || this.isKeyDown('DOWN')) directions.push('down')
    if (this.isKeyDown('A') || this.isKeyDown('LEFT')) directions.push('left')
    if (this.isKeyDown('D') || this.isKeyDown('RIGHT')) directions.push('right')
    
    return directions
  }

  /**
   * Enable/disable input
   */
  setEnabled(enabled) {
    this.enabled = enabled
    console.log(`🎮 Input ${enabled ? 'enabled' : 'disabled'}`)
  }

  /**
   * Clear all callbacks for a key
   */
  clearCallbacks(key) {
    const eventKeyDown = `keydown-${key.toUpperCase()}`
    const eventKeyUp = `keyup-${key.toUpperCase()}`
    delete this.callbacks[eventKeyDown]
    delete this.callbacks[eventKeyUp]
  }

  /**
   * Clear all input callbacks
   */
  clearAllCallbacks() {
    this.callbacks = {}
  }

  /**
   * Get pointer position
   */
  getPointerPosition() {
    const pointer = this.scene.input.activePointer
    return {
      x: pointer.x,
      y: pointer.y
    }
  }

  /**
   * Check if mouse/touch down
   */
  isPointerDown() {
    return this.scene.input.activePointer.isDown
  }

  /**
   * Add pointer down callback
   */
  onPointerDown(callback) {
    this.scene.input.on('pointerdown', callback)
  }

  /**
   * Add pointer up callback
   */
  onPointerUp(callback) {
    this.scene.input.on('pointerup', callback)
  }

  /**
   * Add pointer move callback
   */
  onPointerMove(callback) {
    this.scene.input.on('pointermove', callback)
  }

  /**
   * Register interaction callback (E key)
   */
  onInteract(callback) {
    this.onKeyDown('E', callback)
  }

  /**
   * Disable all input (for UI modals/popups)
   * Keeps keyboard listening but doesn't process events
   * Allows browser/React to receive keyboard events
   */
  disable() {
    this.enabled = false
    this.pressedKeys.clear() // Clear any stuck keys when disabling
    console.log('🔒 Input disabled - game paused for UI')
  }

  /**
   * Enable all input (resume game)
   */
  enable() {
    this.enabled = true
    this.pressedKeys.clear() // Clear any stuck keys
    console.log('🎮 Input enabled - game resumed')
  }
}
