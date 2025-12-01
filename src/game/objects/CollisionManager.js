/**
 * CollisionManager - Handles all physics collisions and interactions
 */
export class CollisionManager {
  constructor(scene) {
    this.scene = scene
    this.colliders = []
    this.overlaps = []
    this.enabled = true
  }

  /**
   * Setup collision between two physics objects
   */
  addCollider(objectA, objectB, callback = null, enabled = true) {
    const collider = this.scene.physics.add.collider(objectA, objectB, callback, null, this.scene)
    collider.active = enabled
    this.colliders.push(collider)
    return collider
  }

  /**
   * Setup overlap (trigger) between two physics objects
   */
  addOverlap(objectA, objectB, callback, enabled = true) {
    const overlap = this.scene.physics.add.overlap(objectA, objectB, callback, null, this.scene)
    overlap.active = enabled
    this.overlaps.push(overlap)
    return overlap
  }

  /**
   * Remove a collider
   */
  removeCollider(collider) {
    if (collider) {
      collider.destroy()
      this.colliders = this.colliders.filter(c => c !== collider)
    }
  }

  /**
   * Remove an overlap
   */
  removeOverlap(overlap) {
    if (overlap) {
      overlap.destroy()
      this.overlaps = this.overlaps.filter(o => o !== overlap)
    }
  }

  /**
   * Enable/disable all colliders
   */
  setEnabled(enabled) {
    this.enabled = enabled
    this.colliders.forEach(c => c.active = enabled)
    this.overlaps.forEach(o => o.active = enabled)
    console.log(`🔌 Collisions ${enabled ? 'enabled' : 'disabled'}`)
  }

  /**
   * Enable/disable specific collider
   */
  setColliderEnabled(collider, enabled) {
    if (collider) {
      collider.active = enabled
    }
  }

  /**
   * Check distance between two objects
   */
  getDistance(objectA, objectB) {
    if (!objectA || !objectB) return Infinity
    const dx = objectA.x - objectB.x
    const dy = objectA.y - objectB.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Check if two objects are touching
   */
  isTouching(objectA, objectB) {
    if (!objectA || !objectB) return false
    return this.scene.physics.overlap(objectA, objectB)
  }

  /**
   * Get all colliders
   */
  getAllColliders() {
    return this.colliders
  }

  /**
   * Get all overlaps
   */
  getAllOverlaps() {
    return this.overlaps
  }

  /**
   * Clear all collisions
   */
  clear() {
    this.colliders.forEach(c => c.destroy())
    this.overlaps.forEach(o => o.destroy())
    this.colliders = []
    this.overlaps = []
    console.log('🗑️ All collisions cleared')
  }

  /**
   * Raycast between two points
   */
  raycast(fromX, fromY, toX, toY, maxDistance = 500) {
    // Simple distance check for now
    const dx = toX - fromX
    const dy = toY - fromY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance <= maxDistance) {
      return { 
        hit: true,
        distance: distance,
        direction: { x: dx / distance, y: dy / distance }
      }
    }
    
    return { hit: false, distance: Infinity }
  }

  /**
   * Get objects in area
   */
  getObjectsInArea(x, y, radius) {
    // Placeholder - would use physics query in real implementation
    return []
  }
}

export default CollisionManager
