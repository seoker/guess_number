import { GuessResult, GameGuess, GuessRecord, GameGuessComputed } from '../types'

export const GAME_CONFIG = {
  DIGIT_COUNT: 4,
  MAX_DIGIT: 10,
  COMPUTER_THINKING_TIME: 100
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

export const calculateAB = (guess: string, target: string): GuessResult => {
  let A = 0
  let B = 0
  const guessDigits = guess.split('')
  const targetDigits = target.split('')

  // Calculate A: exact position matches
  for (let i = 0; i < GAME_CONFIG.DIGIT_COUNT; i++) {
    if (guessDigits[i] === targetDigits[i]) {
      A++
    }
  }

  // Calculate B: digits in target but wrong position
  // Use counting approach to handle duplicates correctly
  const guessCounts: Record<string, number> = {}
  const targetCounts: Record<string, number> = {}
  
  // Count digits in both strings, excluding exact matches
  for (let i = 0; i < GAME_CONFIG.DIGIT_COUNT; i++) {
    if (guessDigits[i] !== targetDigits[i]) {
      guessCounts[guessDigits[i]] = (guessCounts[guessDigits[i]] || 0) + 1
      targetCounts[targetDigits[i]] = (targetCounts[targetDigits[i]] || 0) + 1
    }
  }
  
  // B is the sum of minimum counts for each digit
  for (const digit in guessCounts) {
    if (targetCounts[digit]) {
      B += Math.min(guessCounts[digit], targetCounts[digit])
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
  feedback: GuessResult, 
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

// Function that works with structured history formats
export const calculatePossibleTargets = (playerHistory: GuessRecord[] | GameGuess[]): string[] => {
  let possibleNumbers = generateAllPossibleNumbers()
  
  for (const record of playerHistory) {
    possibleNumbers = possibleNumbers.filter(num => {
      const { A, B } = calculateAB(record.guess, num)
      return A === record.result.A && B === record.result.B
    })
  }
  
  return possibleNumbers
}

export const isGuessConsistentWithHistory = (
  guess: string, 
  playerHistory: GuessRecord[] | GameGuess[]
): boolean => {
  if (playerHistory.length === 0) {
    return true
  }
  
  const possibleTargets = calculatePossibleTargets(playerHistory)
  return possibleTargets.includes(guess)
}

// Find which specific previous guess causes inconsistency with current guess
export const findInconsistentGuess = (
  currentGuess: string,
  playerHistory: GuessRecord[] | GameGuess[]
): { guess: string; result: { A: number; B: number }; expectedResult: { A: number; B: number } } | null => {
  for (const record of playerHistory) {
    const actualResult = calculateAB(record.guess, currentGuess)
    if (actualResult.A !== record.result.A || actualResult.B !== record.result.B) {
      return {
        guess: record.guess,
        result: record.result, // What actually happened
        expectedResult: actualResult // What would happen if currentGuess were target
      }
    }
  }
  return null
}

// === NEW STRUCTURE UTILITY FUNCTIONS ===

// Create a GameGuess from individual components
export const createGameGuess = (
  guess: string,
  result: GuessResult,
  attemptNumber: number,
  timestamp = Date.now()
): GameGuess => ({
  guess,
  result,
  attemptNumber,
  timestamp
})

// Create GameGuess from guess and target (calculate A/B automatically)
export const createGameGuessFromTarget = (
  guess: string,
  target: string,
  attemptNumber: number,
  timestamp = Date.now()
): GameGuess => {
  const result = calculateAB(guess, target)
  return createGameGuess(guess, result, attemptNumber, timestamp)
}

// Convenience function to create GameGuess with A/B values directly
export const createGameGuessFromAB = (
  guess: string,
  A: number,
  B: number,
  attemptNumber: number,
  timestamp = Date.now()
): GameGuess => createGameGuess(guess, { A, B }, attemptNumber, timestamp)

// Add computed properties to GameGuess
export const withComputedProperties = (gameGuess: GameGuess): GameGuessComputed => ({
  ...gameGuess,
  get isCorrect(): boolean {
    return this.result.A === GAME_CONFIG.DIGIT_COUNT
  },
  get resultString(): string {
    return `${this.result.A}A${this.result.B}B`
  }
})

// Convert GuessRecord to GameGuess (both now use GuessResult)
export const gameRecordToGameGuess = (
  record: GuessRecord, 
  attemptNumber: number,
  timestamp = Date.now()
): GameGuess => {
  return createGameGuess(
    record.guess,
    record.result,  // Direct assignment since both use GuessResult
    attemptNumber,
    timestamp
  )
}

// Convert GameGuess to GuessRecord (both now use GuessResult)
export const gameGuessToGameRecord = (gameGuess: GameGuess): GuessRecord => ({
  guess: gameGuess.guess,
  result: gameGuess.result,  // Direct assignment since both use GuessResult
  isCorrect: gameGuess.result.A === GAME_CONFIG.DIGIT_COUNT
})

// Helper function to convert legacy string results to GuessResult (for migration)
export const parseResultString = (result: string): GuessResult => {
  const match = result.match(/(\d+)A(\d+)B/)
  if (!match) {
    throw new Error(`Invalid result format: ${result}`)
  }
  
  const [, A, B] = match
  return { A: parseInt(A, 10), B: parseInt(B, 10) }
}

// Helper function to convert GuessResult to string (for display)
export const formatResultString = (result: GuessResult): string => {
  return `${result.A}A${result.B}B`
}

// Note: calculatePossibleTargetsV2 and isGuessConsistentWithHistoryV2 are no longer needed
// since both GuessRecord and GameGuess now use the same GuessResult structure.
// The main functions calculatePossibleTargets and isGuessConsistentWithHistory 
// now work with both formats seamlessly.
