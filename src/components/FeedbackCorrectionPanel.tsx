import React, { useState } from 'react'
import { GameRecord } from '../types'

export interface FeedbackCorrectionPanelProps {
  history: GameRecord[]
  correctHistoryFeedback: (index: number, A: number, B: number) => void
  cancelFeedbackCorrection: () => void
  t: (key: string, options?: any) => string
}

export const FeedbackCorrectionPanel: React.FC<FeedbackCorrectionPanelProps> = ({ 
  history, 
  correctHistoryFeedback, 
  cancelFeedbackCorrection, 
  t 
}) => {
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