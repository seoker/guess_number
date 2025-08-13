import React from 'react'
import './GameRecords.css'

const GameRecords = ({ gameRecords, clearAllRecords, t }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const formatMobileDate = (timestamp) => {
    const date = new Date(timestamp)
    const dateStr = date.toLocaleDateString()
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return { date: dateStr, time: timeStr }
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
      <div className="main-container">
        <div className="records-header flex-between">
          <h2>{t('gameRecords')}</h2>
        </div>
        <div className="no-records text-center">
          <p>{t('noRecordsYet')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="main-container">
      <div className="records-header flex-between">
        <h2>{t('gameRecords')}</h2>
        <button 
          className="clear-records-btn btn-danger"
          onClick={clearAllRecords}
          title={t('clearAllRecords')}
        >
          {t('clearAllRecords')}
        </button>
      </div>
      
      <div className="records-list">
        {gameRecords.map((record) => (
          <div key={record.id} className={`record-item rounded-md shadow-sm hover-lift ${getWinnerClass(record)}-bg`}>
            <div className="record-header flex-between">
              <span className={`winner-badge ${getWinnerClass(record)} rounded-pill`}>
                {getWinnerText(record)}
              </span>
              <div className="record-date text-muted">
                <div className="date-desktop">
                  {formatDate(record.timestamp)}
                </div>
                <div className="date-mobile">
                  <div>{formatMobileDate(record.timestamp).date}</div>
                  <div>{formatMobileDate(record.timestamp).time}</div>
                </div>
              </div>
            </div>
            
            <div className="record-details">
              <div className="record-stat">
                <span className="stat-label text-muted">{t('totalRounds')}:</span>
                <span className="stat-value">{record.totalRounds}</span>
              </div>
              
              <div className="record-stat">
                <span className="stat-label text-muted">{t('playerAttempts')}:</span>
                <span className="stat-value">{record.playerAttempts}</span>
              </div>
              
              <div className="record-stat">
                <span className="stat-label text-muted">{t('computerAttempts')}:</span>
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
