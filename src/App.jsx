import React, { useState, useEffect } from 'react'
import Phaser from 'phaser'
import { gameConfig } from './game/config/GameConfig'
import GameUI from './GameUI'
import { PlayerProgressManager } from './utils/PlayerProgressManager'

import './styles/index.scss'

/**
 * App - Main React component
 * Manages:
 * - Phaser game initialization
 * - GameUI overlay for dialogs and quests
 * - Backend player progress synchronization
 */
function App() {
  const [game, setGame] = useState(null)
  const [playerReady, setPlayerReady] = useState(false)

  // Initialize player and load progress from backend
  useEffect(() => {
    async function initializePlayer() {
      try {
        const existingPlayerId = localStorage.getItem('playerId')
        
        let playerId = existingPlayerId
        if (!playerId) {
          // Generate a unique player name
          const playerName = `Player_${Math.floor(Math.random() * 100000)}`
          playerId = await PlayerProgressManager.initializePlayer(playerName)
          localStorage.setItem('playerId', playerId)
          console.log('✨ New player created:', playerName, playerId)
        }
        
        // Load saved progress from backend
        const manager = new PlayerProgressManager(playerId)
        const progress = await manager.loadProgress()
        
        // Store progress manager globally for MainScene access
        window.playerProgressManager = manager
        window.playerProgress = progress
        
        console.log('📊 Progress loaded from backend:', progress)
        setPlayerReady(true)
      } catch (error) {
        console.error('Failed to initialize player:', error)
        // Continue anyway - game can work offline
        setPlayerReady(true)
      }
    }

    initializePlayer()
  }, [])

  // Initialize Phaser game once player is ready
  useEffect(() => {
    if (!playerReady) return

    const phaserGame = new Phaser.Game(gameConfig)
    setGame(phaserGame)

    return () => {
      phaserGame.destroy(true)
    }
  }, [playerReady])

  if (!playerReady) {
    return (
      <div className="app loading">
        <div className="loading-screen">
          <h1>Loading Game...</h1>
          <p>Initializing player data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div id="phaser-game"></div>
      <GameUI />
    </div>
  )
}

export default App
