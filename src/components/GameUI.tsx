import { useRef, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import './GameUI.css'
import { GameUIProps, FeedbackCorrectionPanelProps } from '../types'

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
  t
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const playerHistoryRef = useRef<HTMLDivElement>(null)
  const computerHistoryRef = useRef<HTMLDivElement>(null)

  // Auto focus input field
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameWon && inputRef.current && gameState.currentTurn === 'player') {
      inputRef.current.focus()
    }
  }, [gameState.gameStarted, gameState.gameWon, gameState.currentTurn])

  // Auto scroll to latest record
  useEffect(() => {
    if (playerHistoryRef.current && history.player.length > 0) {
      playerHistoryRef.current.scrollTop = playerHistoryRef.current.scrollHeight
    }
  }, [history.player])

  useEffect(() => {
    if (computerHistoryRef.current && history.computer.length > 0) {
      computerHistoryRef.current.scrollTop = computerHistoryRef.current.scrollHeight
    }
  }, [history.computer])


  const handleDigitChange = (index: number, value: string): void => {
    // Only allow single digits 0-9
    const digit = value.replace(/\D/g, '').slice(-1)
    
    // Build a 4-position array representing the current state
    const currentGuess = gameState.playerGuess || ''
    const newDigits = new Array(4).fill('')
    
    // Parse current guess into digit positions, handling spaces correctly
    for (let i = 0; i < Math.min(currentGuess.length, 4); i++) {
      if (currentGuess[i] && currentGuess[i] !== ' ') {
        newDigits[i] = currentGuess[i]
      }
    }
    
    // Update the specific position with the new digit
    newDigits[index] = digit
    
    // Build the updated guess string with proper spacing
    let updatedGuess = ''
    for (let i = 0; i < 4; i++) {
      if (newDigits[i]) {
        // Ensure we pad with spaces to maintain correct positions
        while (updatedGuess.length < i) {
          updatedGuess += ' '
        }
        updatedGuess += newDigits[i]
      }
    }
    
    updatePlayerGuess(updatedGuess)
    
    // Auto-focus next input if digit was entered
    if (digit && index < 3) {
      const nextInput = document.getElementById(`digit-${index + 1}`) as HTMLInputElement | null
      if (nextInput) nextInput.focus()
    }
  }

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace') {
      const currentGuess = gameState.playerGuess.padEnd(4, ' ')
      if (!currentGuess[index] || currentGuess[index] === ' ') {
        if (index > 0) {
          const prevInput = document.getElementById(`digit-${index - 1}`) as HTMLInputElement | null
          if (prevInput) {
            prevInput.focus()
            // Clear the previous digit
            handleDigitChange(index - 1, '')
          }
        }
      } else {
        // Clear current digit
        handleDigitChange(index, '')
      }
      e.preventDefault()
    }
    // Handle Enter to submit
    else if (e.key === 'Enter' && gameState.currentTurn === 'player') {
      handlePlayerGuess()
    }
    // Handle arrow keys for navigation
    else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`) as HTMLInputElement | null
      if (prevInput) prevInput.focus()
    }
    else if (e.key === 'ArrowRight' && index < 3) {
      const nextInput = document.getElementById(`digit-${index + 1}`) as HTMLInputElement | null
      if (nextInput) nextInput.focus()
    }
  }

  const handleFeedbackClick = (type: 'A' | 'B', value: number): void => {
    updatePlayerFeedback(type, value.toString())
  }

  const handleResetGame = async (): Promise<void> => {
    const result = await Swal.fire({
      title: t('confirmResetGame'),
      text: t('resetGameWarning'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#747d8c',
      confirmButtonText: t('confirmReset'),
      cancelButtonText: t('cancel'),
      reverseButtons: true
    })

    if (result.isConfirmed) {
      resetGame()
      Swal.fire({
        title: t('gameReset'),
        text: t('newGameStarted'),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  const handleRestartGame = async (): Promise<void> => {
    const result = await Swal.fire({
      title: t('confirmRestartGame'),
      text: t('restartGameWarning'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#747d8c',
      confirmButtonText: t('confirmRestart'),
      cancelButtonText: t('cancel'),
      reverseButtons: true
    })

    if (result.isConfirmed) {
      startNewGame()
      Swal.fire({
        title: t('gameRestarted'),
        text: t('freshGameStarted'),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  return (
    <div className="main-container">
        <h1 className="title">{t('title')}</h1>
        
        {!gameState.gameStarted ? (
          <div className="start-screen">
            <p className="description">
              {t('description')}<br/>
              <strong>{t('rules')}</strong>{t('rulesDetail')}<br/>
              <strong>{t('aExplanation')}</strong><br/>
              <strong>{t('bExplanation')}</strong>
            </p>
            <button className="start-button" onClick={startNewGame}>
              {t('startGame')}
            </button>
          </div>
        ) : (
          <div className="game-screen">
            <div className="game-info">
              <p className="attempts">{t('playerAttempts')}: {gameState.playerAttempts} | {t('computerAttempts')}: {gameState.computerAttempts}</p>
              <p className="hint">{t('currentTurn')}: {gameState.currentTurn === 'player' ? t('player') : t('computer')}</p>
            </div>


            {computerAI.showFeedbackForm ? (
              <div className="feedback-section">
                <h3>{t('computerGuess')}{computerAI.currentGuess}</h3>
                <p className="feedback-hint">{t('feedbackHint')}</p>
                <div className="feedback-form">
                  <div className="feedback-inputs">
                    <div className="feedback-display">
                      <button 
                        className="feedback-element clickable"
                        onClick={() => {
                          const currentA = parseInt(computerAI.playerFeedback.A || '0');
                          const nextA = (currentA + 1) % 5;
                          handleFeedbackClick('A', nextA);
                        }}
                      >
                        {computerAI.playerFeedback.A || '0'}
                      </button>
                      <span className="feedback-element static">A</span>
                      <button 
                        className="feedback-element clickable"
                        onClick={() => {
                          const currentB = parseInt(computerAI.playerFeedback.B || '0');
                          const nextB = (currentB + 1) % 5;
                          handleFeedbackClick('B', nextB);
                        }}
                      >
                        {computerAI.playerFeedback.B || '0'}
                      </button>
                      <span className="feedback-element static">B</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleFeedbackSubmit}
                    className="feedback-button"
                    disabled={false}
                  >
                    {t('submitFeedback')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="guess-section">
                <div className="input-section">
                  <div className="digit-inputs">
                    {[0, 1, 2, 3].map(index => (
                      <input
                        key={index}
                        id={`digit-${index}`}
                        ref={index === 0 ? inputRef : null}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]"
                        value={gameState.playerGuess[index] && gameState.playerGuess[index] !== ' ' ? gameState.playerGuess[index] : ''}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(index, e)}
                        className="digit-input"
                        disabled={gameState.gameWon || gameState.currentTurn !== 'player'}
                        maxLength={1}
                        placeholder="?"
                      />
                    ))}
                  </div>
                  <div className="button-group">
                    <button 
                      onClick={handlePlayerGuess} 
                      className="game-button guess-button"
                      disabled={gameState.gameWon || gameState.currentTurn !== 'player' || gameState.playerGuess.length !== 4}
                    >
                      {t('guess')}
                    </button>
                    <button 
                      className="restart-link"
                      onClick={handleRestartGame}
                      title={t('restartGame')}
                    >
                      {t('restartGame')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {gameState.message && (
              <div className={`message ${getMessageType()}`}>
                {gameState.message}
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
                      onClick={handleResetGame}
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

            <div className="history-container">
              {/* Player history records */}
              <div className="history-section">
                <h3 className="history-title">{t('playerHistory')}</h3>
                <div className="history-list" ref={playerHistoryRef}>
                  {history.player.map((record, index) => (
                    <div key={index} className={`item-base history-item ${record.isCorrect ? 'correct' : ''}`}>
                      <span className="ordinal-base history-ordinal">{index + 1}</span>
                      <div className="content-base history-content">
                        <span className="history-guess">{record.guess}</span>
                        <span className="history-result">{record.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Computer history records */}
              <div className="history-section">
                <h3 className="history-title">{t('computerHistory')}</h3>
                <div className="history-list" ref={computerHistoryRef}>
                  {history.computer.map((record, index) => (
                    <div key={index} className={`item-base history-item ${record.isCorrect ? 'correct' : ''}`}>
                      <span className="ordinal-base history-ordinal">{index + 1}</span>
                      <div className="content-base history-content">
                        <span className="history-guess">{record.guess}</span>
                        <span className="history-result">{record.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {gameState.gameWon && (
              <div className="win-section">
                <p className="win-message">{t('gameOver')}</p>
                <button className="restart-button" onClick={startNewGame}>
                  {t('playAgain')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
  )
}

// Feedback correction panel component
const FeedbackCorrectionPanel: React.FC<FeedbackCorrectionPanelProps> = ({ history, correctHistoryFeedback, cancelFeedbackCorrection, t }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [editingFeedback, setEditingFeedback] = useState<{ A: string; B: string }>({ A: '', B: '' })

  const handleRecordClick = (index: number): void => {
    setSelectedIndex(index)
    const record = history[index]
    const match = record.result.match(/(\d+)A(\d+)B/)
    if (match) {
      const [, A, B] = match
      setEditingFeedback({ A, B })
    }
  }

  const handleFeedbackChange = (type: 'A' | 'B', value: number): void => {
    setEditingFeedback(prev => ({ ...prev, [type]: value.toString() }))
  }

  const handleConfirmCorrection = (): void => {
    if (selectedIndex !== null) {
      correctHistoryFeedback(selectedIndex, parseInt(editingFeedback.A), parseInt(editingFeedback.B))
    }
  }

  return (
    <div className="correction-panel">
      <h3 className="correction-title">{t('correctFeedback')}</h3>
      <p className="correction-hint">{t('selectCorrection')}</p>
      
      <div className="correction-history">
        {history.map((record, index) => (
          <div 
            key={index} 
            className={`item-base correction-item ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleRecordClick(index)}
          >
            <span className="ordinal-base correction-ordinal">{index + 1}</span>
            <div className="content-base correction-content">
              <span className="correction-guess">{record.guess}</span>
              <span className="correction-result">{record.result}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="correction-editor">
          <h4>{t('correctFeedbackFor', { guess: history[selectedIndex].guess })}:</h4>
          <div className="correction-inputs">
            <div className="feedback-display">
              <button 
                className="feedback-element clickable"
                onClick={() => {
                  const currentA = parseInt(editingFeedback.A || '0');
                  const nextA = (currentA + 1) % 5;
                  handleFeedbackChange('A', nextA);
                }}
              >
                {editingFeedback.A || '0'}
              </button>
              <span className="feedback-element static">A</span>
              <button 
                className="feedback-element clickable"
                onClick={() => {
                  const currentB = parseInt(editingFeedback.B || '0');
                  const nextB = (currentB + 1) % 5;
                  handleFeedbackChange('B', nextB);
                }}
              >
                {editingFeedback.B || '0'}
              </button>
              <span className="feedback-element static">B</span>
            </div>
          </div>
          <div className="correction-actions">
            <button 
              className="confirm-correction-button"
              onClick={handleConfirmCorrection}
              disabled={false}
            >
              {t('confirmCorrection')}
            </button>
            <button 
              className="cancel-correction-button"
              onClick={cancelFeedbackCorrection}
            >
              {t('cancelCorrection')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
