import React from 'react'

export interface StartScreenProps {
  startNewGame: () => void
  t: (key: string) => string
}

export const StartScreen: React.FC<StartScreenProps> = ({ startNewGame, t }) => {
  return (
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
  )
}