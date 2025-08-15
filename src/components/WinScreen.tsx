import React from 'react'

export interface WinScreenProps {
  startNewGame: () => void
  t: (key: string) => string
}

export const WinScreen: React.FC<WinScreenProps> = ({ startNewGame, t }) => {
  return (
    <div className="win-section">
      <p className="win-message">{t('gameOver')}</p>
      <button className="restart-button" onClick={startNewGame}>
        {t('playAgain')}
      </button>
    </div>
  )
}