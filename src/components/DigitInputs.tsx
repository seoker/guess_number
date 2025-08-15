import React, { useRef } from 'react'
import { useDigitInput } from '../hooks/useDigitInput'

export interface DigitInputsProps {
  playerGuess: string
  updatePlayerGuess: (guess: string) => void
  handlePlayerGuess: () => void
  disabled: boolean
}

export const DigitInputs: React.FC<DigitInputsProps> = ({
  playerGuess,
  updatePlayerGuess,
  handlePlayerGuess,
  disabled
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { handleDigitChange, handleDigitKeyDown } = useDigitInput(
    playerGuess,
    updatePlayerGuess,
    handlePlayerGuess
  )

  return (
    <div className="digit-inputs">
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
        />
      ))}
    </div>
  )
}