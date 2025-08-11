import React from 'react'
import './GameRecords.css'

const GameRecords = ({ gameRecords, clearAllRecords, t }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getWinnerText = (record) => {
    if (record.winner === 'player') {
      return t('playerWonShort')
    } else if (record.winner === 'computer') {
      return t('computerWonShort')
    }
    return t('gameIncomplete')
  }

  const getWinnerClass = (record) => {
    if (record.winner === 'player') {
      return 'winner-player'
    } else if (record.winner === 'computer') {
      return 'winner-computer'
    }
    return 'winner-none'
  }

  if (gameRecords.length === 0) {
    return (
      <div className="game-records">
        <div className="records-header">
          <h2>{t('gameRecords')}</h2>
        </div>
        <div className="no-records">
          <p>{t('noRecordsYet')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="game-records">
      <div className="records-header">
        <h2>{t('gameRecords')}</h2>
        <button 
          className="clear-records-btn"
          onClick={clearAllRecords}
          title={t('clearAllRecords')}
        >
          {t('clearAllRecords')}
        </button>
      </div>
      
      <div className="records-list">
        {gameRecords.map((record) => (
          <div key={record.id} className="record-item">
            <div className="record-header">
              <span className={`winner-badge ${getWinnerClass(record)}`}>
                {getWinnerText(record)}
              </span>
              <span className="record-date">
                {formatDate(record.timestamp)}
              </span>
            </div>
            
            <div className="record-details">
              <div className="record-stat">
                <span className="stat-label">{t('totalRounds')}:</span>
                <span className="stat-value">{record.totalRounds}</span>
              </div>
              
              <div className="record-stat">
                <span className="stat-label">{t('playerAttempts')}:</span>
                <span className="stat-value">{record.playerAttempts}</span>
              </div>
              
              <div className="record-stat">
                <span className="stat-label">{t('computerAttempts')}:</span>
                <span className="stat-value">{record.computerAttempts}</span>
              </div>
            </div>
            
            {record.winner && (
              <div className="record-result">
                <span className="result-text">
                  {record.winner === 'player' 
                    ? t('playerWonInRounds', { rounds: record.playerAttempts })
                    : t('computerWonInRounds', { rounds: record.computerAttempts })
                  }
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { GameRecords }
