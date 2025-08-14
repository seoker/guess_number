import { GameResult } from '../types'

export const GAME_CONFIG = {
  DIGIT_COUNT: 4,
  MAX_DIGIT: 10,
  COMPUTER_THINKING_TIME: 1000
} as const

export const generateTargetNumber = (): string => {
  const digits: number[] = []
  while (digits.length < GAME_CONFIG.DIGIT_COUNT) {
    const digit = Math.floor(Math.random() * GAME_CONFIG.MAX_DIGIT)
    if (!digits.includes(digit)) {
      digits.push(digit)
    }
  }
  return digits.join('')
}

export const generateAllPossibleNumbers = (): string[] => {
  const numbers: string[] = []
  for (let i = 0; i < 10000; i++) {
    const num = i.toString().padStart(GAME_CONFIG.DIGIT_COUNT, '0')
    const digits = num.split('')
    if (new Set(digits).size === GAME_CONFIG.DIGIT_COUNT) {
      numbers.push(num)
    }
  }
  return numbers
}

export const calculateAB = (guess: string, target: string): GameResult => {
  let A = 0
  let B = 0
  const guessDigits = guess.split('')
  const targetDigits = target.split('')

  for (let i = 0; i < GAME_CONFIG.DIGIT_COUNT; i++) {
    if (guessDigits[i] === targetDigits[i]) {
      A++
    }
  }

  for (let i = 0; i < GAME_CONFIG.DIGIT_COUNT; i++) {
    if (targetDigits.includes(guessDigits[i]) && guessDigits[i] !== targetDigits[i]) {
      B++
    }
  }

  return { A, B }
}

export const validateNumber = (number: string): { valid: boolean; message?: string } => {
  if (number.length !== GAME_CONFIG.DIGIT_COUNT) {
    return { valid: false, message: 'fourDigitsRequired' }
  }

  if (!/^\d{4}$/.test(number)) {
    return { valid: false, message: 'fourDigitsRequired' }
  }

  const digits = number.split('')
  const uniqueDigits = new Set(digits)
  if (uniqueDigits.size !== GAME_CONFIG.DIGIT_COUNT) {
    return { valid: false, message: 'digitsMustBeUnique' }
  }

  return { valid: true }
}

export const validateFeedback = (A: number, B: number): { valid: boolean; message?: string } => {
  if (A < 0 || A > GAME_CONFIG.DIGIT_COUNT || B < 0 || B > GAME_CONFIG.DIGIT_COUNT || A + B > GAME_CONFIG.DIGIT_COUNT) {
    return { valid: false, message: 'invalidFeedback' }
  }
  return { valid: true }
}

export const checkFeedbackConsistency = (
  guess: string, 
  feedback: GameResult, 
  possibleNumbers: string[]
): boolean => {
  const { A, B } = feedback
  const result = `${A}A${B}B`
  
  const remainingNumbers = possibleNumbers.filter((num: string) => {
    const calculatedAB = calculateAB(guess, num)
    return `${calculatedAB.A}A${calculatedAB.B}B` === result
  })
  
  return remainingNumbers.length > 0
}

export const updatePossibleNumbers = (
  guess: string, 
  result: string, 
  possibleNumbers: string[]
): string[] => {
  return possibleNumbers.filter((num: string) => {
    const { A, B } = calculateAB(guess, num)
    return `${A}A${B}B` === result
  })
}

export const makeComputerGuess = (possibleNumbers: string[]): string => {
  if (possibleNumbers.length === 0) {
    return generateTargetNumber()
  }
  
  const randomIndex = Math.floor(Math.random() * possibleNumbers.length)
  return possibleNumbers[randomIndex]
}