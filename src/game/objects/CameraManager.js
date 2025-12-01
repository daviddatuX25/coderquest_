/**
 * CameraManager - Handles camera behavior, following, and viewport management
 */
export class CameraManager {
  constructor(scene) {
    this.scene = scene
    this.camera = scene.cameras.main
    this.followTarget = null
    this.isFollowing = false
    this.settings = {
      zoomLevel: 1,
      smoothness: 0.1,
      bounds: null
    }
  }

  /**
   * Start following a sprite
   */
  startFollowing(target, smooth = true) {
    this.followTarget = target
    this.isFollowing = true

    if (smooth) {
      this.camera.startFollow(target, true, 0.5, 0.5)
    } else {
      this.camera.startFollow(target, false)
    }

    console.log('✅ Camera following target')
  }

  /**
   * Stop following
   */
  stopFollowing() {
    this.camera.stopFollow()
    this.isFollowing = false
    console.log('❌ Camera stopped following')
  }

  /**
   * Pan camera to position
   */
  panTo(x, y, duration = 1000) {
    this.camera.pan(x, y, duration)
    console.log(`📷 Panning to ${x}, ${y}`)
  }

  /**
   * Set camera zoom
   */
  setZoom(level, duration = 0) {
    this.settings.zoomLevel = level
    if (duration > 0) {
      this.scene.tweens.add({
        targets: this.camera,
        zoom: level,
        duration: duration,
        ease: 'Quad.easeInOut'
      })
    } else {
      this.camera.setZoom(level)
    }
    console.log(`🔍 Camera zoom: ${level}x`)
  }

  /**
   * Get zoom level
   */
  getZoom() {
    return this.camera.zoom
  }

  /**
   * Shake camera effect
   */
  shake(intensity = 5, duration = 100) {
    this.camera.shake(duration, intensity / 100)
    console.log(`⚡ Camera shaking (${intensity}%)`)
  }

  /**
   * Fade effect
   */
  fade(color = 0x000000, duration = 1000) {
    this.camera.fadeOut(duration, 0, 0, 0)
    console.log(`🌑 Camera fading`)
  }

  /**
   * Set camera bounds
   */
  setBounds(x, y, width, height) {
    this.camera.setBounds(x, y, width, height)
    this.settings.bounds = { x, y, width, height }
    console.log(`📍 Camera bounds set to ${width}x${height}`)
  }

  /**
   * Get current camera position
   */
  getPosition() {
    return {
      x: this.camera.scrollX,
      y: this.camera.scrollY
    }
  }

  /**
   * Get camera viewport
   */
  getViewport() {
    return {
      x: this.camera.scrollX,
      y: this.camera.scrollY,
      width: this.camera.width,
      height: this.camera.height
    }
  }

  /**
   * Check if object is in viewport
   */
  isObjectInViewport(x, y) {
    const viewport = this.getViewport()
    return (
      x >= viewport.x &&
      x <= viewport.x + viewport.width &&
      y >= viewport.y &&
      y <= viewport.y + viewport.height
    )
  }

  /**
   * Focus on position
   */
  focusOn(x, y) {
    this.camera.centerOn(x, y)
    console.log(`👁️ Camera focused on ${x}, ${y}`)
  }

  /**
   * Reset camera to default
   */
  reset() {
    this.camera.setZoom(1)
    this.camera.setScroll(0, 0)
    console.log('🔄 Camera reset to default')
  }
}

export default CameraManager
