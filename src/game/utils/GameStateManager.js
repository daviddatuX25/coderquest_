/**
 * GameStateManager - Handles game state persistence and management
 * Stores player progress, completed quests, inventory, etc.
 */
export class GameStateManager {
  constructor() {
    this.state = {
      currentLevel: 1,
      playerPosition: { x: 0, y: 0 },
      playerStats: {
        health: 100,
        xp: 0,
        level: 1
      },
      completedQuests: [],
      activeQuests: [],
      inventory: [],
      unlockedAchievements: [],
      settings: {
        volume: 1,
        difficulty: 'normal',
        language: 'en'
      },
      lastSave: null
    }

    this.loadFromStorage()
  }

  /**
   * Get current game state
   */
  getState() {
    return this.state
  }

  /**
   * Update game state
   */
  setState(key, value) {
    if (typeof key === 'object') {
      Object.assign(this.state, key)
    } else {
      this.state[key] = value
    }
    this.saveToStorage()
  }

  /**
   * Get specific property
   */
  get(key) {
    return this.state[key]
  }

  /**
   * Set specific property
   */
  set(key, value) {
    this.state[key] = value
    this.saveToStorage()
  }

  /**
   * Add quest to active quests
   */
  startQuest(questData) {
    if (!this.state.activeQuests.find(q => q.id === questData.id)) {
      this.state.activeQuests.push({
        ...questData,
        startedAt: Date.now(),
        progress: 0
      })
      this.saveToStorage()
      console.log(`📜 Quest started: ${questData.id}`)
    }
  }

  /**
   * Complete a quest
   */
  completeQuest(questId) {
    const quest = this.state.activeQuests.find(q => q.id === questId)
    if (quest) {
      this.state.activeQuests = this.state.activeQuests.filter(q => q.id !== questId)
      this.state.completedQuests.push({
        ...quest,
        completedAt: Date.now()
      })
      this.saveToStorage()
      console.log(`✅ Quest completed: ${questId}`)
    }
  }

  /**
   * Get active quests
   */
  getActiveQuests() {
    return this.state.activeQuests
  }

  /**
   * Get completed quests
   */
  getCompletedQuests() {
    return this.state.completedQuests
  }

  /**
   * Add item to inventory
   */
  addItem(item) {
    this.state.inventory.push({
      id: item.id || Date.now(),
      name: item.name,
      quantity: item.quantity || 1,
      addedAt: Date.now()
    })
    this.saveToStorage()
    console.log(`📦 Item added: ${item.name}`)
  }

  /**
   * Remove item from inventory
   */
  removeItem(itemId) {
    const index = this.state.inventory.findIndex(i => i.id === itemId)
    if (index !== -1) {
      this.state.inventory.splice(index, 1)
      this.saveToStorage()
      console.log(`🗑️ Item removed: ${itemId}`)
    }
  }

  /**
   * Get inventory
   */
  getInventory() {
    return this.state.inventory
  }

  /**
   * Update player stats
   */
  updateStats(stats) {
    Object.assign(this.state.playerStats, stats)
    this.saveToStorage()
    console.log('📊 Player stats updated')
  }

  /**
   * Award achievement
   */
  unlockAchievement(achievementId) {
    if (!this.state.unlockedAchievements.includes(achievementId)) {
      this.state.unlockedAchievements.push(achievementId)
      this.saveToStorage()
      console.log(`🏆 Achievement unlocked: ${achievementId}`)
    }
  }

  /**
   * Save game to localStorage
   */
  saveToStorage() {
    try {
      this.state.lastSave = Date.now()
      localStorage.setItem('coderquest_save', JSON.stringify(this.state))
      console.log('💾 Game saved to storage')
    } catch (error) {
      console.error('❌ Error saving to storage:', error)
    }
  }

  /**
   * Load game from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('coderquest_save')
      if (saved) {
        const loadedState = JSON.parse(saved)
        this.state = { ...this.state, ...loadedState }
        console.log('📂 Game loaded from storage')
      }
    } catch (error) {
      console.error('❌ Error loading from storage:', error)
    }
  }

  /**
   * Reset to defaults
   */
  reset() {
    localStorage.removeItem('coderquest_save')
    this.state = {
      currentLevel: 1,
      playerPosition: { x: 0, y: 0 },
      playerStats: {
        health: 100,
        xp: 0,
        level: 1
      },
      completedQuests: [],
      activeQuests: [],
      inventory: [],
      unlockedAchievements: [],
      settings: {
        volume: 1,
        difficulty: 'normal',
        language: 'en'
      },
      lastSave: null
    }
    console.log('🔄 Game state reset')
  }

  /**
   * Get last save time
   */
  getLastSaveTime() {
    if (!this.state.lastSave) return null
    return new Date(this.state.lastSave)
  }
}

// Global instance
export const gameState = new GameStateManager()

export default GameStateManager
