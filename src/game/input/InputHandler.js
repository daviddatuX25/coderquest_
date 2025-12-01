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
    
    this.setupKeyboard()
  }

  /**
   * Setup keyboard input
   */
  setupKeyboard() {
    // Movement keys
    const movementKeys = ['W', 'A', 'S', 'D', 'UP', 'DOWN', 'LEFT', 'RIGHT']
    const actionKeys = ['E', 'SPACE', 'ENTER', 'ESC']
    
    const allKeys = [...movementKeys, ...actionKeys]
    
    allKeys.forEach(key => {
      this.keys[key] = this.scene.input.keyboard.addKey(key)
    })

    // Listen for key down events
    this.scene.input.keyboard.on('keydown', (event) => {
      if (!this.enabled) return
      
      const key = event.key.toUpperCase()
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
}

export default InputHandler
