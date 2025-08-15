import { useCallback } from 'react'

export interface DigitInputResult {
  handleDigitChange: (index: number, value: string) => void
  handleDigitKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const useDigitInput = (
  currentGuess: string,
  updateGuess: (guess: string) => void,
  onSubmit: () => void
): DigitInputResult => {
  const buildDigitsArray = useCallback((guess: string): string[] => {
    const newDigits = new Array(4).fill('')
    for (let i = 0; i < Math.min(guess.length, 4); i++) {
      if (guess[i] && guess[i] !== ' ') {
        newDigits[i] = guess[i]
      }
    }
    return newDigits
  }, [])

  const formatPlayerGuess = useCallback((digits: string[]): string => {
    let updatedGuess = ''
    for (let i = 0; i < 4; i++) {
      if (digits[i]) {
        while (updatedGuess.length < i) {
          updatedGuess += ' '
        }
        updatedGuess += digits[i]
      }
    }
    return updatedGuess
  }, [])

  const handleDigitChange = useCallback((index: number, value: string): void => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = buildDigitsArray(currentGuess)
    newDigits[index] = digit
    const updatedGuess = formatPlayerGuess(newDigits)
    updateGuess(updatedGuess)

    if (digit && index < 3) {
      const nextInput = document.getElementById(`digit-${index + 1}`) as HTMLInputElement | null
      if (nextInput) nextInput.focus()
    }
  }, [currentGuess, updateGuess, buildDigitsArray, formatPlayerGuess])

  const handleDigitKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace') {
      const currentGuessPadded = currentGuess.padEnd(4, ' ')
      if (!currentGuessPadded[index] || currentGuessPadded[index] === ' ') {
        if (index > 0) {
          const prevInput = document.getElementById(`digit-${index - 1}`) as HTMLInputElement | null
          if (prevInput) {
            prevInput.focus()
            handleDigitChange(index - 1, '')
          }
        }
      } else {
        handleDigitChange(index, '')
      }
      e.preventDefault()
    } else if (e.key === 'Enter') {
      onSubmit()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`) as HTMLInputElement | null
      if (prevInput) prevInput.focus()
    } else if (e.key === 'ArrowRight' && index < 3) {
      const nextInput = document.getElementById(`digit-${index + 1}`) as HTMLInputElement | null
      if (nextInput) nextInput.focus()
    }
  }, [currentGuess, handleDigitChange, onSubmit])

  return {
    handleDigitChange,
    handleDigitKeyDown
  }
}