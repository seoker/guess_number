import React, { useRef, useEffect } from 'react'
import { GameRecord } from '../types'

export interface GameHistoryProps {
  playerHistory: GameRecord[]
  computerHistory: GameRecord[]
  t: (key: string) => string
}

export const GameHistory: React.FC<GameHistoryProps> = ({
  playerHistory,
  computerHistory,
  t
}) => {
  const playerHistoryRef = useRef<HTMLDivElement>(null)
  const computerHistoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (playerHistoryRef.current && playerHistory.length > 0) {
      playerHistoryRef.current.scrollTop = playerHistoryRef.current.scrollHeight
    }
  }, [playerHistory])

  useEffect(() => {
    if (computerHistoryRef.current && computerHistory.length > 0) {
      computerHistoryRef.current.scrollTop = computerHistoryRef.current.scrollHeight
    }
  }, [computerHistory])

  return (
    <div className="history-container">
      <div className="history-section">
        <h3 className="history-title">{t('playerHistory')}</h3>
        <div className="history-list" ref={playerHistoryRef}>
          {playerHistory.map((record, index) => (
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

      <div className="history-section">
        <h3 className="history-title">{t('computerHistory')}</h3>
        <div className="history-list" ref={computerHistoryRef}>
          {computerHistory.map((record, index) => (
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
  )
}