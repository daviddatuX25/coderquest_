/**
 * MapManager - Handles tilemap loading, rendering, and transitions
 * Manages different map levels and collision layers
 */
export class MapManager {
  constructor(scene) {
    this.scene = scene
    this.currentMap = null
    this.tilesets = new Map()
    this.layers = new Map()
    this.collisionLayer = null
  }

  /**
   * Load a tilemap from Tiled JSON
   */
  loadMap(mapKey, tilesetKey) {
    try {
      // Create tilemap from preloaded JSON
      const map = this.scene.make.tilemap({ key: mapKey })
      
      // Add tileset
      const tileset = map.addTilesetImage(tilesetKey, tilesetKey)
      
      if (!tileset) {
        console.warn(`⚠️ Tileset '${tilesetKey}' not found`)
        return null
      }

      this.currentMap = map
      this.tilesets.set(mapKey, tileset)

      // Create layers
      const layers = map.layers
      layers.forEach(layerData => {
        if (layerData.name.toLowerCase().includes('ground') || 
            layerData.name.toLowerCase().includes('base')) {
          const layer = map.createLayer(layerData.name, tileset, 0, 0)
          this.layers.set(layerData.name, layer)
        } else if (layerData.name.toLowerCase().includes('collision') || 
                   layerData.name.toLowerCase().includes('obstacle')) {
          const layer = map.createLayer(layerData.name, tileset, 0, 0)
          layer.setCollisionByProperty({ collides: true })
          layer.setVisible(false)
          this.collisionLayer = layer
          this.layers.set(layerData.name, layer)
        }
      })

      // Set world bounds
      const bounds = map.getBounds()
      this.scene.physics.world.setBounds(0, 0, bounds.width, bounds.height)

      console.log(`✅ Map loaded: ${mapKey}`)
      return map
    } catch (error) {
      console.error(`❌ Error loading map: ${mapKey}`, error)
      return null
    }
  }

  /**
   * Get the collision layer for physics
   */
  getCollisionLayer() {
    return this.collisionLayer
  }

  /**
   * Get a specific layer
   */
  getLayer(layerName) {
    return this.layers.get(layerName)
  }

  /**
   * Get all layers
   */
  getAllLayers() {
    return Array.from(this.layers.values())
  }

  /**
   * Set collision between player and collision layer
   */
  setupCollisions(sprite) {
    if (this.collisionLayer) {
      this.scene.physics.add.collider(sprite, this.collisionLayer)
      console.log('✅ Collisions setup')
    }
  }

  /**
   * Find spawn point in map
   */
  getSpawnPoint(spawnName = 'spawn') {
    if (!this.currentMap) return { x: 100, y: 100 }

    const spawnObject = this.currentMap.findObject('Spawn', 
      obj => obj.name === spawnName || obj.name === 'Spawn'
    )

    if (spawnObject) {
      return { x: spawnObject.x, y: spawnObject.y }
    }

    return { x: 100, y: 100 }
  }

  /**
   * Get all objects from a specific layer
   */
  getObjectsFromLayer(layerName) {
    if (!this.currentMap) return []
    
    const objectLayer = this.currentMap.getObjectLayer(layerName)
    if (!objectLayer) return []
    
    return objectLayer.objects || []
  }

  /**
   * Clean up map
   */
  destroy() {
    if (this.currentMap) {
      this.currentMap.destroy()
    }
    this.layers.clear()
    this.tilesets.clear()
    this.collisionLayer = null
    this.currentMap = null
  }
}

export default MapManager
