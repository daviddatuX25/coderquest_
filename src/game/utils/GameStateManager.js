import { Logger } from '../../utils/Logger';

/**
 * GameStateManager - Handles game state persistence and management - OPTIMIZED
 * Stores player progress, completed quests, inventory, etc.
 * Uses Map for O(1) lookups instead of array.find()
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

    // Caches for faster lookups (O(1) instead of O(n))
    this.completedQuestMap = new Map();
    this.activeQuestMap = new Map();
    this.inventoryMap = new Map();
    this.achievementSet = new Set();
    
    this.loadFromStorage()
  }

  /**
   * Get current game state
   */
  getState() {
    return this.state
  }

  /**
   * Update game state (batch updates)
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
   * Set specific property (throttled saves for better performance)
   */
  set(key, value) {
    this.state[key] = value
    this.saveToStorage()
  }

  /**
   * Add quest to active quests - Optimized with Map
   */
  startQuest(questData) {
    if (!this.activeQuestMap.has(questData.id)) {
      const quest = {
        ...questData,
        startedAt: Date.now(),
        progress: 0
      };
      this.state.activeQuests.push(quest);
      this.activeQuestMap.set(questData.id, quest);
      this.saveToStorage()
      Logger.debug(`📜 Quest started: ${questData.id}`)
    }
  }

  /**
   * Complete a quest - Optimized with Map
   */
  completeQuest(questId) {
    const quest = this.activeQuestMap.get(questId);
    if (quest) {
      this.state.activeQuests = this.state.activeQuests.filter(q => q.id !== questId);
      this.activeQuestMap.delete(questId);
      
      const completedQuest = {
        ...quest,
        completedAt: Date.now()
      };
      this.state.completedQuests.push(completedQuest);
      this.completedQuestMap.set(questId, completedQuest);
      
      this.saveToStorage()
      Logger.debug(`✅ Quest completed: ${questId}`)
    }
  }

  /**
   * Mark quest as completed directly (for syncing from lesson mode)
   * Even if quest was never started in this mode
   */
  markQuestCompleted(questId) {
    // Only add if not already completed
    if (!this.completedQuestMap.has(questId)) {
      const completedQuest = {
        id: questId,
        completedAt: Date.now()
      };
      this.state.completedQuests.push(completedQuest);
      this.completedQuestMap.set(questId, completedQuest);
      
      this.saveToStorage()
      Logger.debug(`✅ Quest marked as completed (synced): ${questId}`)
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
   * Check if a quest is completed - O(1) lookup instead of O(n)
   */
  isQuestCompleted(questId) {
    return this.completedQuestMap.has(questId);
  }

  /**
   * Check if a quest is in progress (started but not completed)
   */
  isQuestInProgress(questId) {
    return this.activeQuestMap.has(questId);
  }

  /**
   * Add item to inventory - Optimized
   */
  addItem(item) {
    const inventoryItem = {
      id: item.id || Date.now(),
      name: item.name,
      quantity: item.quantity || 1,
      addedAt: Date.now()
    };
    this.state.inventory.push(inventoryItem);
    this.inventoryMap.set(inventoryItem.id, inventoryItem);
    this.saveToStorage()
    Logger.debug(`📦 Item added: ${item.name}`)
  }

  /**
   * Remove item from inventory - Optimized
   */
  removeItem(itemId) {
    if (this.inventoryMap.has(itemId)) {
      this.state.inventory = this.state.inventory.filter(i => i.id !== itemId);
      this.inventoryMap.delete(itemId);
      this.saveToStorage()
      Logger.debug(`🗑️ Item removed: ${itemId}`)
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
    Logger.debug('📊 Player stats updated')
  }

  /**
   * Award achievement - Optimized with Set
   */
  unlockAchievement(achievementId) {
    if (!this.achievementSet.has(achievementId)) {
      this.state.unlockedAchievements.push(achievementId);
      this.achievementSet.add(achievementId);
      this.saveToStorage()
      Logger.debug(`🏆 Achievement unlocked: ${achievementId}`)
    }
  }

  /**
   * Save game to localStorage (debounced in production)
   */
  saveToStorage() {
    try {
      this.state.lastSave = Date.now()
      localStorage.setItem('coderquest_save', JSON.stringify(this.state))
      Logger.debug('💾 Game saved to storage')
    } catch (error) {
      Logger.error('❌ Error saving to storage:', error)
    }
  }

  /**
   * Load game from localStorage and populate caches
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('coderquest_save')
      if (saved) {
        const loadedState = JSON.parse(saved)
        this.state = { ...this.state, ...loadedState }
        
        // Rebuild caches from loaded state
        this.state.completedQuests.forEach(q => this.completedQuestMap.set(q.id, q));
        this.state.activeQuests.forEach(q => this.activeQuestMap.set(q.id, q));
        this.state.inventory.forEach(i => this.inventoryMap.set(i.id, i));
        this.state.unlockedAchievements.forEach(a => this.achievementSet.add(a));
        
        Logger.debug('📂 Game loaded from storage')
      }
    } catch (error) {
      Logger.error('❌ Error loading from storage:', error)
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
    
    // Clear caches
    this.completedQuestMap.clear();
    this.activeQuestMap.clear();
    this.inventoryMap.clear();
    this.achievementSet.clear();
    
    Logger.debug('🔄 Game state reset')
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
