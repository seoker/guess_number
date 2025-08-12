import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameLogic } from './hooks/useGameLogic'
import { useGameRecords } from './hooks/useGameRecords'
import { NavigationBar } from './components/NavigationBar'
import { GameUI } from './components/GameUI'
import { GameRecords } from './components/GameRecords'
import './App.css'

function App() {
  const { t, i18n } = useTranslation()
  const { gameRecords, addGameRecord, clearAllRecords } = useGameRecords()
  const [currentView, setCurrentView] = useState('game')
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }
  
  const getSupportedLanguages = () => [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' }
  ]
  
  const {
    gameState,
    history,
    computerAI,
    feedbackCorrection,
    startNewGame,
    handlePlayerGuess,
    handleFeedbackSubmit,
    updatePlayerGuess,
    updatePlayerFeedback,
    getMessageType,
    startFeedbackCorrection,
    resetGame,
    correctHistoryFeedback,
    cancelFeedbackCorrection
  } = useGameLogic(addGameRecord)

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  return (
    <div className="app">
      <NavigationBar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        t={t}
        currentLanguage={i18n.language}
        changeLanguage={changeLanguage}
        getSupportedLanguages={getSupportedLanguages}
      />
      
      <main className="main-content">
        {currentView === 'game' ? (
          <GameUI
            gameState={gameState}
            history={history}
            computerAI={computerAI}
            feedbackCorrection={feedbackCorrection}
            startNewGame={startNewGame}
            handlePlayerGuess={handlePlayerGuess}
            handleFeedbackSubmit={handleFeedbackSubmit}
            updatePlayerGuess={updatePlayerGuess}
            updatePlayerFeedback={updatePlayerFeedback}
            getMessageType={getMessageType}
            startFeedbackCorrection={startFeedbackCorrection}
            resetGame={resetGame}
            correctHistoryFeedback={correctHistoryFeedback}
            cancelFeedbackCorrection={cancelFeedbackCorrection}
            t={t}
            currentLanguage={i18n.language}
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
