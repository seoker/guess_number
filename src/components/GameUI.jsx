import { useRef, useEffect, useState } from 'react'
import './GameUI.css'

export const GameUI = ({ 
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
  const inputRef = useRef(null)
  const playerHistoryRef = useRef(null)
  const computerHistoryRef = useRef(null)

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState.currentTurn === 'player') {
      handlePlayerGuess()
    }
  }

  const handlePlayerGuessChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    updatePlayerGuess(value)
  }

  const handleFeedbackClick = (type, value) => {
    updatePlayerFeedback(type, value.toString())
  }

  return (
    <div className="container">
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
                    <div className="feedback-input-group">
                      <label>{t('aLabel')}</label>
                      <div className="number-buttons">
                        {[0, 1, 2, 3, 4].map(num => (
                          <button
                            key={num}
                            className={`number-button ${computerAI.playerFeedback.A === num.toString() ? 'selected' : ''}`}
                            onClick={() => handleFeedbackClick('A', num)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="feedback-input-group">
                      <label>{t('bLabel')}</label>
                      <div className="number-buttons">
                        {[0, 1, 2, 3, 4].map(num => (
                          <button
                            key={num}
                            className={`number-button ${computerAI.playerFeedback.B === num.toString() ? 'selected' : ''}`}
                            onClick={() => handleFeedbackClick('B', num)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleFeedbackSubmit}
                    className="feedback-button"
                    disabled={computerAI.playerFeedback.A === '' || computerAI.playerFeedback.B === ''}
                  >
                    {t('submitFeedback')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="guess-section">
                <div className="input-section">
                  <input
                    ref={inputRef}
                    type="text"
                    value={gameState.playerGuess}
                    onChange={handlePlayerGuessChange}
                    onKeyPress={handleKeyPress}
                    placeholder={t('guessPlaceholder')}
                    className="guess-input"
                    disabled={gameState.gameWon || gameState.currentTurn !== 'player'}
                    maxLength={4}
                  />
                  <button 
                    onClick={handlePlayerGuess} 
                    className="guess-button"
                    disabled={gameState.gameWon || gameState.currentTurn !== 'player' || gameState.playerGuess.length !== 4}
                  >
                    {t('guess')}
                  </button>
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
                      onClick={resetGame}
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
const FeedbackCorrectionPanel = ({ history, correctHistoryFeedback, cancelFeedbackCorrection, t }) => {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [editingFeedback, setEditingFeedback] = useState({ A: '', B: '' })

  const handleRecordClick = (index) => {
    setSelectedIndex(index)
    const record = history[index]
    const [A, B] = record.result.match(/(\d+)A(\d+)B/).slice(1, 3)
    setEditingFeedback({ A, B })
  }

  const handleFeedbackChange = (type, value) => {
    setEditingFeedback(prev => ({ ...prev, [type]: value.toString() }))
  }

  const handleConfirmCorrection = () => {
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
            <div className="correction-input-group">
              <label>A:</label>
              <div className="number-buttons">
                {[0, 1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    className={`number-button ${editingFeedback.A === num.toString() ? 'selected' : ''}`}
                    onClick={() => handleFeedbackChange('A', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div className="correction-input-group">
              <label>B:</label>
              <div className="number-buttons">
                {[0, 1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    className={`number-button ${editingFeedback.B === num.toString() ? 'selected' : ''}`}
                    onClick={() => handleFeedbackChange('B', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="correction-actions">
            <button 
              className="confirm-correction-button"
              onClick={handleConfirmCorrection}
              disabled={editingFeedback.A === '' || editingFeedback.B === ''}
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
