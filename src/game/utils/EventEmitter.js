/**
 * Global event emitter for communication between Phaser and React
 * Phaser game emits events when NPCs are interacted with
 * React components listen and respond accordingly
 */

class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
    
    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(l => l !== listener)
    }
  }

  once(event, listener) {
    const unsubscribe = this.on(event, (...args) => {
      listener(...args)
      unsubscribe()
    })
    return unsubscribe
  }

  emit(event, data) {
    if (!this.events[event]) return
    this.events[event].forEach(listener => listener(data))
  }

  off(event, listener) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(l => l !== listener)
  }

  clear(event) {
    if (event) {
      delete this.events[event]
    } else {
      this.events = {}
    }
  }
}

// Global instance
const gameEvents = new EventEmitter()

// Also attach to window for React integration
if (typeof window !== 'undefined') {
  window.gameEvents = gameEvents
}

export { gameEvents }
export default EventEmitter
