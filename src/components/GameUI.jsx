import { useRef, useEffect } from 'react'
import './GameUI.css'

export const GameUI = ({ 
  gameState, 
  history, 
  computerAI, 
  startNewGame, 
  handlePlayerGuess, 
  handleFeedbackSubmit, 
  updatePlayerGuess, 
  updatePlayerFeedback, 
  getMessageType,
  t
}) => {
  const inputRef = useRef(null)
  const playerHistoryRef = useRef(null)
  const computerHistoryRef = useRef(null)

  // 自動聚焦輸入框
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameWon && inputRef.current && gameState.currentTurn === 'player') {
      inputRef.current.focus()
    }
  }, [gameState.gameStarted, gameState.gameWon, gameState.currentTurn])

  // 自動滾動到最新記錄
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
              <div className={`message ${getMessageType(gameState.message)}`}>
                {gameState.message}
              </div>
            )}

            <div className="history-container">
              {/* 玩家歷史記錄 */}
              <div className="history-section">
                <h3 className="history-title">{t('playerHistory')}</h3>
                <div className="history-list" ref={playerHistoryRef}>
                  {history.player.map((record, index) => (
                    <div key={index} className={`history-item ${record.isCorrect ? 'correct' : ''}`}>
                      <span className="history-guess">{record.guess}</span>
                      <span className="history-result">{record.result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 電腦歷史記錄 */}
              <div className="history-section">
                <h3 className="history-title">{t('computerHistory')}</h3>
                <div className="history-list" ref={computerHistoryRef}>
                  {history.computer.map((record, index) => (
                    <div key={index} className={`history-item ${record.isCorrect ? 'correct' : ''}`}>
                      <span className="history-guess">{record.guess}</span>
                      <span className="history-result">{record.result}</span>
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
