import { useState } from 'react'
import { useGameLogic } from './hooks/useGameLogic'
import { useI18n } from './hooks/useI18n'
import { useGameRecords } from './hooks/useGameRecords'
import { NavigationBar } from './components/NavigationBar'
import { GameUI } from './components/GameUI'
import { GameRecords } from './components/GameRecords'
import './App.css'

function App() {
  const { currentLanguage, changeLanguage, t, getSupportedLanguages } = useI18n()
  const { gameRecords, addGameRecord, clearAllRecords } = useGameRecords()
  const [currentView, setCurrentView] = useState('game')
  
  const {
    gameState,
    history,
    computerAI,
    startNewGame,
    handlePlayerGuess,
    handleFeedbackSubmit,
    updatePlayerGuess,
    updatePlayerFeedback,
    getMessageType
  } = useGameLogic(t, addGameRecord)

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  return (
    <div className="app">
      <NavigationBar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        t={t}
        currentLanguage={currentLanguage}
        changeLanguage={changeLanguage}
        getSupportedLanguages={getSupportedLanguages}
      />
      
      <main className="main-content">
        {currentView === 'game' ? (
          <GameUI
            gameState={gameState}
            history={history}
            computerAI={computerAI}
            startNewGame={startNewGame}
            handlePlayerGuess={handlePlayerGuess}
            handleFeedbackSubmit={handleFeedbackSubmit}
            updatePlayerGuess={updatePlayerGuess}
            updatePlayerFeedback={updatePlayerFeedback}
            getMessageType={getMessageType}
            t={t}
            currentLanguage={currentLanguage}
            changeLanguage={changeLanguage}
            getSupportedLanguages={getSupportedLanguages}
          />
        ) : (
          <GameRecords
            gameRecords={gameRecords}
            clearAllRecords={clearAllRecords}
            t={t}
          />
        )}
      </main>
    </div>
  )
}

export default App
