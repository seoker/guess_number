import React, { useCallback } from 'react'
import './GameUI.css'
import { GameUIProps } from '../types'
import { useConfirmationDialogs } from '../hooks/useConfirmationDialogs'
import { StartScreen } from './StartScreen'
import { FeedbackForm } from './FeedbackForm'
import { DigitInputs } from './DigitInputs'
import { GameHistory } from './GameHistory'
import { WinScreen } from './WinScreen'
import { FeedbackCorrectionPanel } from './FeedbackCorrectionPanel'

export const GameUI: React.FC<GameUIProps> = ({ 
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
  handleHintCheck,
  t
}) => {
  const { showResetConfirmation, showRestartConfirmation } = useConfirmationDialogs(
    resetGame,
    startNewGame,
    t
  )

  const handleFeedbackClick = useCallback((type: 'A' | 'B', value: number): void => {
    updatePlayerFeedback(type, value.toString())
  }, [updatePlayerFeedback])

  return (
    <div className="main-container">
      <h1 className="title">{t('title')}</h1>
      
      {!gameState.gameStarted ? (
        <StartScreen startNewGame={startNewGame} t={t} />
      ) : (
        <div className="game-screen">
          <div className="game-info">
            <p className="attempts">{t('playerAttempts')}: {gameState.playerAttempts} | {t('computerAttempts')}: {gameState.computerAttempts}</p>
            <p className="hint">{t('currentTurn')}: {gameState.currentTurn === 'player' ? t('player') : t('computer')}</p>
            <button 
              className="restart-link"
              onClick={showRestartConfirmation}
              title={t('restartGame')}
            >
              {t('restartGame')}
            </button>
          </div>

          {computerAI.showFeedbackForm ? (
            <FeedbackForm
              computerGuess={computerAI.currentGuess}
              playerFeedback={computerAI.playerFeedback}
              onFeedbackClick={handleFeedbackClick}
              onSubmit={handleFeedbackSubmit}
              t={t}
            />
          ) : (
            <div className="guess-section">
              <div className="input-section">
                <div className="digit-inputs-and-main-buttons">
                  <DigitInputs
                    playerGuess={gameState.playerGuess}
                    updatePlayerGuess={updatePlayerGuess}
                    handlePlayerGuess={handlePlayerGuess}
                    disabled={gameState.gameWon || gameState.currentTurn !== 'player'}
                    isPlayerTurn={gameState.currentTurn === 'player' && !gameState.gameWon}
                    t={t}
                  />
                  <div className="main-button-group">
                    <button 
                      onClick={handlePlayerGuess} 
                      className="game-button guess-button"
                      disabled={gameState.gameWon || gameState.currentTurn !== 'player' || gameState.playerGuess.replace(/\s/g, '').length !== 4}
                      aria-describedby="guess-button-help"
                    >
                      {t('guess')}
                    </button>
                    <div id="guess-button-help" className="sr-only">
                      {gameState.playerGuess.replace(/\s/g, '').length !== 4 ? t('guessButtonDisabledHelp') : t('guessButtonEnabledHelp')}
                    </div>
                    <button 
                      onClick={handleHintCheck}
                      className="game-button hint-button"
                      disabled={gameState.gameWon || gameState.currentTurn !== 'player' || gameState.playerGuess.replace(/\s/g, '').length !== 4 || gameState.hintsRemaining <= 0 || history.player.length === 0}
                      aria-describedby="hint-button-help"
                      title={t('hintButtonTooltip', { remaining: gameState.hintsRemaining })}
                    >
                      {t('checkHint')} ({gameState.hintsRemaining})
                    </button>
                    <div id="hint-button-help" className="sr-only">
                      {t('hintButtonTooltip', { remaining: gameState.hintsRemaining })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(gameState.message || gameState.messageInfo) && (
            <div className={`message ${getMessageType()}`}>
              {gameState.messageInfo ? 
                t(gameState.messageInfo.key, gameState.messageInfo.params) : 
                gameState.message
              }
              {feedbackCorrection.isActive && getMessageType() === 'complaint' && (
                <div className="correction-buttons">
                  <button 
                    className="fix-button"
                    onClick={startFeedbackCorrection}
                  >
                    {t('fixFeedback')}
                  </button>
                  <button 
                    className="reset-button"
                    onClick={showResetConfirmation}
                  >
                    {t('resetGame')}
                  </button>
                </div>
              )}
            </div>
          )}

          {feedbackCorrection.showHistory && (
            <FeedbackCorrectionPanel 
              history={history.computer}
              correctHistoryFeedback={correctHistoryFeedback}
              cancelFeedbackCorrection={cancelFeedbackCorrection}
              t={t}
            />
          )}

          <GameHistory
            playerHistory={history.player}
            computerHistory={history.computer}
            t={t}
          />

          {gameState.gameWon && (
            <WinScreen startNewGame={startNewGame} t={t} />
          )}
        </div>
      )}
    </div>
  )
}
