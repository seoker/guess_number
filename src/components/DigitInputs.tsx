import React, { useRef, useEffect } from 'react'
import { useDigitInput } from '../hooks/useDigitInput'

export interface DigitInputsProps {
  playerGuess: string
  updatePlayerGuess: (guess: string) => void
  handlePlayerGuess: () => void
  disabled: boolean
  isPlayerTurn: boolean
  t: (key: string, options?: any) => string
}

export const DigitInputs: React.FC<DigitInputsProps> = ({
  playerGuess,
  updatePlayerGuess,
  handlePlayerGuess,
  disabled,
  isPlayerTurn,
  t
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { handleDigitChange, handleDigitKeyDown } = useDigitInput(
    playerGuess,
    updatePlayerGuess,
    handlePlayerGuess
  )

  useEffect(() => {
    if (isPlayerTurn && !disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isPlayerTurn, disabled])

  const filledDigits = playerGuess.replace(/\s/g, '').length
  const isComplete = filledDigits === 4

  return (
    <div 
      className="digit-inputs" 
      role="group" 
      aria-label={t('digitInputsLabel')}
      aria-describedby="digit-inputs-help"
    >
      <div id="digit-inputs-help" className="sr-only">
        {t('digitInputsHelp')}
      </div>
      {[0, 1, 2, 3].map(index => (
        <input
          key={index}
          id={`digit-${index}`}
          ref={index === 0 ? inputRef : null}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          value={playerGuess[index] && playerGuess[index] !== ' ' ? playerGuess[index] : ''}
          onChange={(e) => handleDigitChange(index, e.target.value)}
          onKeyDown={(e) => handleDigitKeyDown(index, e)}
          className="digit-input"
          disabled={disabled}
          maxLength={1}
          placeholder="?"
          aria-label={t('digitPosition', { position: index + 1 })}
          aria-describedby={`digit-${index}-status`}
          aria-required="true"
          aria-invalid={!isComplete && isPlayerTurn ? "false" : undefined}
          autoComplete="off"
        />
      ))}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isComplete ? t('allDigitsEntered') : t('digitsRemaining', { remaining: 4 - filledDigits })}
      </div>
    </div>
  )
}