import React, { useState, useEffect } from 'react'
import Phaser from 'phaser'
import { gameConfig } from './game/config/GameConfig'
import { gameEvents } from './game/utils/EventEmitter'

// React components
import DialogBox from './components/DialogBox'
import QuestPopup from './components/QuestPopup'
import QuizResults from './components/QuizResults'

import './styles/index.scss'

/**
 * App - Main React component
 * Manages:
 * - Phaser game initialization
 * - Modal state (dialog, quest, quiz, results)
 * - Event listeners between Phaser and React
 */
function App() {
  const [game, setGame] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogData, setDialogData] = useState(null)
  const [questOpen, setQuestOpen] = useState(false)
  const [questData, setQuestData] = useState(null)
  const [resultsOpen, setResultsOpen] = useState(false)
  const [resultsData, setResultsData] = useState(null)

  // Initialize Phaser game
  useEffect(() => {
    const phaserGame = new Phaser.Game(gameConfig)
    setGame(phaserGame)

    return () => {
      phaserGame.destroy(true)
    }
  }, [])

  // Listen for game events
  useEffect(() => {
    // Dialog event
    const unsubDialog = gameEvents.on('showDialog', (data) => {
      setDialogData(data)
      setDialogOpen(true)
    })

    // Quest event
    const unsubQuest = gameEvents.on('showQuest', (data) => {
      setQuestData(data)
      setQuestOpen(true)
    })

    // Results event
    const unsubResults = gameEvents.on('showResults', (data) => {
      setResultsData(data)
      setResultsOpen(true)
    })

    return () => {
      unsubDialog()
      unsubQuest()
      unsubResults()
    }
  }, [])

  return (
    <div className="app">
      <div id="phaser-game"></div>

      {/* Dialog Modal */}
      {dialogOpen && (
        <DialogBox
          data={dialogData}
          onClose={() => setDialogOpen(false)}
        />
      )}

      {/* Quest Modal */}
      {questOpen && (
        <QuestPopup
          data={questData}
          onClose={() => setQuestOpen(false)}
        />
      )}

      {/* Results Modal */}
      {resultsOpen && (
        <QuizResults
          data={resultsData}
          onClose={() => setResultsOpen(false)}
        />
      )}
    </div>
  )
}

export default App
