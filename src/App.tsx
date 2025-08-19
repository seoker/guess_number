import { useState, Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameLogic } from './hooks/useGameLogic'
import { useGameRecords } from './hooks/useGameRecords'
import { NavigationBar } from './components/NavigationBar'
import { GameUI } from './components/GameUI'
import { GameRecords } from './components/GameRecords'
import { Language } from './types'
import './App.css'

// Lazy load components for code splitting in production
const LazyGameUI = lazy(() => import('./components/GameUI').then(module => ({ default: module.GameUI })))
const LazyGameRecords = lazy(() => import('./components/GameRecords').then(module => ({ default: module.GameRecords })))

// Check if we're in test environment
const isTest = import.meta.env.NODE_ENV === 'test' || import.meta.env.VITEST

function App(): React.ReactElement {
  const { t, i18n } = useTranslation()
  const { gameRecords, addGameRecord, clearAllRecords } = useGameRecords()
  const [currentView, setCurrentView] = useState<string>('game')
  
  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng)
  }
  
  const getSupportedLanguages = (): Language[] => [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
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
    cancelFeedbackCorrection,
    handleHintCheck
  } = useGameLogic(addGameRecord)

  const handleViewChange = (view: string): void => {
    setCurrentView(view)
  }

  // Loading component
  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{t('loading')}</p>
    </div>
  )

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
        {isTest ? (
          // Direct rendering for tests to avoid async loading issues
          currentView === 'game' ? (
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
              handleHintCheck={handleHintCheck}
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
          )
        ) : (
          // Lazy loading with Suspense for production
          <Suspense fallback={<LoadingSpinner />}>
            {currentView === 'game' ? (
              <LazyGameUI
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
                handleHintCheck={handleHintCheck}
                t={t}
                currentLanguage={i18n.language}
                changeLanguage={changeLanguage}
                getSupportedLanguages={getSupportedLanguages}
              />
            ) : (
              <LazyGameRecords
                gameRecords={gameRecords}
                clearAllRecords={clearAllRecords}
                t={t}
              />
            )}
          </Suspense>
        )}
      </main>
    </div>
  )
}

export default App
