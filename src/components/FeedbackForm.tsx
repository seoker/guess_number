import React from 'react'

export interface FeedbackFormProps {
  computerGuess: string
  playerFeedback: { A: string; B: string }
  onFeedbackClick: (type: 'A' | 'B', value: number) => void
  onSubmit: () => void
  t: (key: string) => string
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  computerGuess,
  playerFeedback,
  onFeedbackClick,
  onSubmit,
  t
}) => {
  return (
    <div className="feedback-section">
      <h3>{t('computerGuess')}{computerGuess}</h3>
      <p className="feedback-hint">{t('feedbackHint')}</p>
      <div className="feedback-form">
        <div className="feedback-inputs">
          <div className="feedback-display">
            <button 
              className="feedback-element clickable"
              onClick={() => {
                const currentA = parseInt(playerFeedback.A || '0');
                const nextA = (currentA + 1) % 5;
                onFeedbackClick('A', nextA);
              }}
            >
              {playerFeedback.A || '0'}
            </button>
            <span className="feedback-element static">A</span>
            <button 
              className="feedback-element clickable"
              onClick={() => {
                const currentB = parseInt(playerFeedback.B || '0');
                const nextB = (currentB + 1) % 5;
                onFeedbackClick('B', nextB);
              }}
            >
              {playerFeedback.B || '0'}
            </button>
            <span className="feedback-element static">B</span>
          </div>
        </div>
        <button 
          onClick={onSubmit}
          className="feedback-button"
          disabled={false}
        >
          {t('submitFeedback')}
        </button>
      </div>
    </div>
  )
}