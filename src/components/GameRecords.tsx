import React from 'react'
import Swal from 'sweetalert2'
import './GameRecords.css'
import { GameRecordsProps, SavedGameRecord } from '../types'

const GameRecords: React.FC<GameRecordsProps> = ({ gameRecords, clearAllRecords, t }) => {
  const handleClearRecords = async (): Promise<void> => {
    const result = await Swal.fire({
      title: t('confirmClearRecords'),
      text: t('clearRecordsWarning'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#747d8c',
      confirmButtonText: t('confirmClear'),
      cancelButtonText: t('cancel'),
      reverseButtons: true
    })

    if (result.isConfirmed) {
      clearAllRecords()
      Swal.fire({
        title: t('recordsCleared'),
        text: t('allRecordsDeleted'),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const formatMobileDate = (timestamp: number): { date: string; time: string } => {
    const date = new Date(timestamp)
    const dateStr = date.toLocaleDateString()
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return { date: dateStr, time: timeStr }
  }

  const getWinnerText = (record: SavedGameRecord): string => {
    if (record.winner === 'player') {
      return t('playerWonShort')
    } else if (record.winner === 'computer') {
      return t('computerWonShort')
    } else if (record.winner === 'draw') {
      return t('drawShort')
    }
    return t('gameIncomplete')
  }

  const getWinnerClass = (record: SavedGameRecord): string => {
    if (record.winner === 'player') {
      return 'winner-player'
    } else if (record.winner === 'computer') {
      return 'winner-computer'
    } else if (record.winner === 'draw') {
      return 'winner-draw'
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
          className="clear-records-link"
          onClick={handleClearRecords}
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
                    : record.winner === 'computer'
                    ? t('computerWonInRounds', { rounds: record.computerAttempts })
                    : record.winner === 'draw'
                    ? t('drawInRounds', { rounds: record.playerAttempts })
                    : ''
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
