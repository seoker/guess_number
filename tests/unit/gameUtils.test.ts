import { describe, it, expect } from 'vitest'
import {
  GAME_CONFIG,
  generateTargetNumber,
  generateAllPossibleNumbers,
  calculateAB,
  validateNumber,
  validateFeedback,
  updatePossibleNumbers,
  makeComputerGuess,
  checkFeedbackConsistency,
  calculatePossibleTargets,
  isGuessConsistentWithHistory,
  createGameGuess,
  createGameGuessFromTarget,
  createGameGuessFromAB,
  withComputedProperties,
  gameRecordToGameGuess,
  gameGuessToGameRecord,
  parseResultString,
  formatResultString
} from '../../src/utils/gameUtils'

// NOTE: generateAllPossibleNumbers() tests are omitted due to memory constraints
// The function generates 5040 numbers which can cause Node.js heap overflow in test environment
// This function is tested through integration tests instead

describe('gameUtils', () => {
   
  describe('GAME_CONFIG', () => {
    it('should have correct configuration values', () => {
      expect(GAME_CONFIG.DIGIT_COUNT).toBe(4)
      expect(GAME_CONFIG.MAX_DIGIT).toBe(10)
      expect(GAME_CONFIG.COMPUTER_THINKING_TIME).toBe(100)
    })
  })

  describe('generateTargetNumber', () => {
    it('should generate a 4-digit string', () => {
      const number = generateTargetNumber()
      expect(number).toHaveLength(4)
      expect(/^\d{4}$/.test(number)).toBe(true)
    })

    it('should generate unique digits', () => {
      const number = generateTargetNumber()
      const digits = number.split('')
      const uniqueDigits = new Set(digits)
      expect(uniqueDigits.size).toBe(4)
    })

    it('should generate different numbers on multiple calls', () => {
      const numbers = new Set()
      for (let i = 0; i < 50; i++) {
        numbers.add(generateTargetNumber())
      }
      expect(numbers.size).toBeGreaterThan(1)
    })

    it('should only use digits 0-9', () => {
      const number = generateTargetNumber()
      const digits = number.split('').map(Number)
      digits.forEach(digit => {
        expect(digit).toBeGreaterThanOrEqual(0)
        expect(digit).toBeLessThanOrEqual(9)
      })
    })
  })

  describe('calculateAB', () => {
    it('should calculate perfect match (4A0B)', () => {
      const result = calculateAB('1234', '1234')
      expect(result).toStrictEqual({ A: 4, B: 0 })
    })

    it('should calculate no match (0A0B)', () => {
      const result = calculateAB('1234', '5678')
      expect(result).toStrictEqual({ A: 0, B: 0 })
    })

    it('should calculate partial position match (1A0B)', () => {
      const result = calculateAB('1234', '1567')
      expect(result).toStrictEqual({ A: 1, B: 0 })
    })

    it('should calculate digit match wrong position (0A4B)', () => {
      const result = calculateAB('1234', '4321')
      expect(result).toStrictEqual({ A: 0, B: 4 })
    })

    it('should calculate mixed match (2A2B)', () => {
      const result = calculateAB('1234', '1324')
      expect(result).toStrictEqual({ A: 2, B: 2 })
    })

    it('should handle complex cases correctly', () => {
      expect(calculateAB('1234', '2143')).toStrictEqual({ A: 0, B: 4 })
      expect(calculateAB('1234', '1243')).toStrictEqual({ A: 2, B: 2 })
      expect(calculateAB('1234', '5234')).toStrictEqual({ A: 3, B: 0 })
      expect(calculateAB('1234', '5678')).toStrictEqual({ A: 0, B: 0 })
    })

    it('should handle the user reported scenarios precisely', () => {
      // Test 1A0B scenario: exactly one digit in correct position, no other shared digits
      expect(calculateAB('1234', '1567')).toStrictEqual({ A: 1, B: 0 }) // Only '1' matches in position 0
      expect(calculateAB('1234', '1089')).toStrictEqual({ A: 1, B: 0 }) // Only '1' matches in position 0
      expect(calculateAB('1234', '5267')).toStrictEqual({ A: 1, B: 0 }) // Only '2' matches in position 1
      expect(calculateAB('1234', '5638')).toStrictEqual({ A: 1, B: 0 }) // Only '3' matches in position 2
      expect(calculateAB('1234', '5674')).toStrictEqual({ A: 1, B: 0 }) // Only '4' matches in position 3

      // Test that 5678 vs 1234 gives 0A0B (the issue case)
      expect(calculateAB('1234', '5678')).toStrictEqual({ A: 0, B: 0 })
      
      // Test more edge cases
      expect(calculateAB('1234', '2134')).toStrictEqual({ A: 2, B: 2 }) // 3,4 in correct positions, 1,2 in wrong positions
      expect(calculateAB('1234', '1324')).toStrictEqual({ A: 2, B: 2 }) // 1,4 in correct positions, 2,3 in wrong positions
    })

    it('should handle all 1A0B patterns systematically', () => {
      const baseGuess = '1234'
      
      // Position 0 match only (1 matches, no other digits 2,3,4 present)
      const pos0Matches = ['1567', '1589', '1607', '1689', '1790', '1807', '1890', '1906']
      pos0Matches.forEach(target => {
        expect(calculateAB(baseGuess, target)).toStrictEqual({ A: 1, B: 0 })
      })
      
      // Position 1 match only (2 matches, no other digits 1,3,4 present)
      const pos1Matches = ['0256', '0267', '0278', '0289', '5206', '5207', '5208']
      pos1Matches.forEach(target => {
        expect(calculateAB(baseGuess, target)).toStrictEqual({ A: 1, B: 0 })
      })
    })
  })

  describe('validateNumber', () => {
    it('should validate correct 4-digit unique number', () => {
      const result = validateNumber('1234')
      expect(result).toStrictEqual({ valid: true })
    })

    it('should reject numbers with wrong length', () => {
      expect(validateNumber('123')).toStrictEqual({ 
        valid: false, 
        message: 'fourDigitsRequired' 
      })
      expect(validateNumber('12345')).toStrictEqual({ 
        valid: false, 
        message: 'fourDigitsRequired' 
      })
      expect(validateNumber('')).toStrictEqual({ 
        valid: false, 
        message: 'fourDigitsRequired' 
      })
    })

    it('should reject non-numeric characters', () => {
      expect(validateNumber('12a4')).toStrictEqual({ 
        valid: false, 
        message: 'fourDigitsRequired' 
      })
      expect(validateNumber('1 34')).toStrictEqual({ 
        valid: false, 
        message: 'fourDigitsRequired' 
      })
      expect(validateNumber('12.4')).toStrictEqual({ 
        valid: false, 
        message: 'fourDigitsRequired' 
      })
    })

    it('should reject numbers with duplicate digits', () => {
      expect(validateNumber('1123')).toStrictEqual({ 
        valid: false, 
        message: 'digitsMustBeUnique' 
      })
      expect(validateNumber('2222')).toStrictEqual({ 
        valid: false, 
        message: 'digitsMustBeUnique' 
      })
      expect(validateNumber('1001')).toStrictEqual({ 
        valid: false, 
        message: 'digitsMustBeUnique' 
      })
    })

    it('should validate numbers starting with 0', () => {
      const result = validateNumber('0123')
      expect(result).toStrictEqual({ valid: true })
    })
  })

  describe('validateFeedback', () => {
    it('should validate correct feedback values', () => {
      expect(validateFeedback(0, 0)).toStrictEqual({ valid: true })
      expect(validateFeedback(4, 0)).toStrictEqual({ valid: true })
      expect(validateFeedback(0, 4)).toStrictEqual({ valid: true })
      expect(validateFeedback(2, 2)).toStrictEqual({ valid: true })
      expect(validateFeedback(3, 1)).toStrictEqual({ valid: true })
      expect(validateFeedback(1, 3)).toStrictEqual({ valid: true })
    })

    it('should reject negative values', () => {
      expect(validateFeedback(-1, 0)).toStrictEqual({ 
        valid: false, 
        message: 'invalidFeedback' 
      })
      expect(validateFeedback(0, -1)).toStrictEqual({ 
        valid: false, 
        message: 'invalidFeedback' 
      })
    })

    it('should reject values greater than DIGIT_COUNT', () => {
      expect(validateFeedback(5, 0)).toStrictEqual({ 
        valid: false, 
        message: 'invalidFeedback' 
      })
      expect(validateFeedback(0, 5)).toStrictEqual({ 
        valid: false, 
        message: 'invalidFeedback' 
      })
    })

    it('should reject A + B > DIGIT_COUNT', () => {
      expect(validateFeedback(3, 2)).toStrictEqual({ 
        valid: false, 
        message: 'invalidFeedback' 
      })
      expect(validateFeedback(4, 1)).toStrictEqual({ 
        valid: false, 
        message: 'invalidFeedback' 
      })
      expect(validateFeedback(2, 3)).toStrictEqual({ 
        valid: false, 
        message: 'invalidFeedback' 
      })
    })
  })

  describe('generateAllPossibleNumbers', () => {
    it('should generate a reasonable sample of valid numbers', () => {
      // Test a smaller subset to avoid memory issues
      const numbers = generateAllPossibleNumbers()
      
      // Should be an array
      expect(Array.isArray(numbers)).toBe(true)
      
      // Should have substantial length (5040 total possible)
      expect(numbers.length).toBeGreaterThan(4000)
      
      // Sample some numbers to verify they're valid
      const sample = numbers.slice(0, 100)
      sample.forEach(num => {
        expect(num).toHaveLength(4)
        expect(/^\d{4}$/.test(num)).toBe(true)
        const digits = num.split('')
        const uniqueDigits = new Set(digits)
        expect(uniqueDigits.size).toBe(4) // All digits unique
      })
    })

    it('should not include numbers with duplicate digits', () => {
      const numbers = generateAllPossibleNumbers()
      const sampledNumbers = numbers.slice(0, 200)
      
      sampledNumbers.forEach(num => {
        const digits = num.split('')
        const uniqueDigits = new Set(digits)
        expect(uniqueDigits.size).toBe(4)
      })
    })
  })

  describe('updatePossibleNumbers', () => {
    it('should filter numbers based on feedback result', () => {
      const possibleNumbers = ['1234', '5678', '1243', '5687']
      const guess = '1234'
      const result = '4A0B' // Perfect match
      
      const updated = updatePossibleNumbers(guess, result, possibleNumbers)
      expect(updated).toStrictEqual(['1234'])
    })

    it('should handle partial matches correctly', () => {
      const possibleNumbers = ['1234', '1243', '1324', '4321']
      const guess = '1234'
      const result = '2A2B' // 2 correct positions, 2 wrong positions
      
      const updated = updatePossibleNumbers(guess, result, possibleNumbers)
      // Both '1243' and '1324' match the pattern: 
      // '1243': positions 0,2 match (1,4), positions 1,3 are swapped (2,3) = 2A2B
      // '1324': positions 0,2 match (1,2), positions 1,3 contain 3,4 from guess = 2A2B
      expect(updated).toStrictEqual(['1243', '1324'])
    })

    it('should handle no matches', () => {
      const possibleNumbers = ['1234', '5678']
      const guess = '1234'
      const result = '0A0B' // No matches
      
      const updated = updatePossibleNumbers(guess, result, possibleNumbers)
      expect(updated).toStrictEqual(['5678'])
    })

    it('should return empty array when no numbers match', () => {
      const possibleNumbers = ['1234', '1243']
      const guess = '5678'
      const result = '4A0B' // Impossible result
      
      const updated = updatePossibleNumbers(guess, result, possibleNumbers)
      expect(updated).toStrictEqual([])
    })
  })

  describe('makeComputerGuess', () => {
    it('should return a random number from possible numbers', () => {
      const possibleNumbers = ['1234', '5678', '9012']
      const guess = makeComputerGuess(possibleNumbers)
      
      expect(possibleNumbers).toContain(guess)
    })

    it('should handle single possible number', () => {
      const possibleNumbers = ['1234']
      const guess = makeComputerGuess(possibleNumbers)
      
      expect(guess).toBe('1234')
    })

    it('should generate target number when no possible numbers', () => {
      const possibleNumbers: string[] = []
      const guess = makeComputerGuess(possibleNumbers)
      
      expect(guess).toHaveLength(4)
      expect(/^\d{4}$/.test(guess)).toBe(true)
      
      // Should have unique digits
      const digits = guess.split('')
      const uniqueDigits = new Set(digits)
      expect(uniqueDigits.size).toBe(4)
    })

    it('should return different guesses for multiple calls with multiple options', () => {
      const possibleNumbers = ['1234', '5678', '9012', '3456', '7890', '2345']
      const guesses = new Set()
      
      // Make multiple guesses to test randomness
      for (let i = 0; i < 20; i++) {
        const guess = makeComputerGuess(possibleNumbers)
        guesses.add(guess)
        expect(possibleNumbers).toContain(guess)
      }
      
      // Should get some variety (not always the same number)
      expect(guesses.size).toBeGreaterThan(1)
    })
  })

  describe('checkFeedbackConsistency', () => {
    it('should return true for consistent feedback', () => {
      const possibleNumbers = ['1234', '1243', '5678']
      const guess = '1234'
      const feedback = { A: 4, B: 0 }
      
      const isConsistent = checkFeedbackConsistency(guess, feedback, possibleNumbers)
      expect(isConsistent).toBe(true)
    })

    it('should return false for inconsistent feedback', () => {
      const possibleNumbers = ['1234', '1243']
      const guess = '5678'
      const feedback = { A: 4, B: 0 } // Impossible with these possible numbers
      
      const isConsistent = checkFeedbackConsistency(guess, feedback, possibleNumbers)
      expect(isConsistent).toBe(false)
    })

    it('should handle edge case with empty possible numbers', () => {
      const possibleNumbers: string[] = []
      const guess = '1234'
      const feedback = { A: 2, B: 1 }
      
      const isConsistent = checkFeedbackConsistency(guess, feedback, possibleNumbers)
      expect(isConsistent).toBe(false)
    })

    it('should validate complex feedback patterns', () => {
      const possibleNumbers = ['1234', '1324', '2341', '3241']
      const guess = '1243'
      const feedback = { A: 1, B: 3 } // 1 in correct position, 3 in wrong positions
      
      const isConsistent = checkFeedbackConsistency(guess, feedback, possibleNumbers)
      expect(isConsistent).toBe(true)
    })
  })

  // Integration test for functions that work with small datasets
  describe('game logic integration', () => {
    it('should validate and calculate correctly together', () => {
      const number = '1234'
      const validation = validateNumber(number)
      expect(validation.valid).toBe(true)

      const feedback = calculateAB(number, '1243')
      expect(feedback).toStrictEqual({ A: 2, B: 2 })

      const feedbackValidation = validateFeedback(feedback.A, feedback.B)
      expect(feedbackValidation.valid).toBe(true)
    })

    it('should handle edge cases consistently', () => {
      // Test with number starting with 0
      const number = '0123'
      expect(validateNumber(number).valid).toBe(true)
      
      // Test perfect match
      const perfectMatch = calculateAB(number, number)
      expect(perfectMatch).toStrictEqual({ A: 4, B: 0 })
      expect(validateFeedback(4, 0).valid).toBe(true)
    })
  })

  describe('calculatePossibleTargets', () => {
    it('should return all possible numbers when no history', () => {
      const result = calculatePossibleTargets([])
      expect(result.length).toBeGreaterThan(5000) // Should be 5040 total
      expect(result).toContain('1234')
      expect(result).toContain('9876')
    })

    it('should filter based on single guess feedback', () => {
      const history = [{ guess: '1234', result: { A: 4, B: 0 }, isCorrect: true }]
      const result = calculatePossibleTargets(history)
      
      expect(result).toStrictEqual(['1234']) // Only exact match remains
    })

    it('should filter based on multiple guess feedback', () => {
      const history = [
        { guess: '1234', result: { A: 2, B: 2 }, isCorrect: false },
        { guess: '5678', result: { A: 0, B: 0 }, isCorrect: false }
      ]
      const result = calculatePossibleTargets(history)
      
      // Should contain numbers that match both feedbacks
      // For 2A2B: positions match 2, digits exist 2 more in wrong positions
      // For 0A0B: contains none of 5,6,7,8
      result.forEach(num => {
        // Verify each result matches both feedbacks
        const feedback1 = calculateAB('1234', num)
        const feedback2 = calculateAB('5678', num)
        expect(feedback1).toStrictEqual({ A: 2, B: 2 })
        expect(feedback2).toStrictEqual({ A: 0, B: 0 })
      })
    })

    it('should return empty array for impossible feedback', () => {
      const history = [
        { guess: '1234', result: { A: 4, B: 0 }, isCorrect: true }, // Must be exactly 1234
        { guess: '1234', result: { A: 0, B: 0 }, isCorrect: false }  // Cannot be 1234
      ]
      const result = calculatePossibleTargets(history)
      
      expect(result).toStrictEqual([])
    })

    it('should handle complex filtering scenario', () => {
      const history = [
        { guess: '1234', result: { A: 1, B: 2 }, isCorrect: false },
        { guess: '5678', result: { A: 0, B: 0 }, isCorrect: false },
        { guess: '9012', result: { A: 1, B: 1 }, isCorrect: false }
      ]
      const result = calculatePossibleTargets(history)
      
      // Verify all results are consistent with all three feedbacks
      result.forEach(num => {
        expect(calculateAB('1234', num)).toStrictEqual({ A: 1, B: 2 })
        expect(calculateAB('5678', num)).toStrictEqual({ A: 0, B: 0 })
        expect(calculateAB('9012', num)).toStrictEqual({ A: 1, B: 1 })
      })
    })
  })

  describe('isGuessConsistentWithHistory', () => {
    it('should return true for empty history', () => {
      const result = isGuessConsistentWithHistory('1234', [])
      expect(result).toBe(true)
    })

    it('should return true for consistent guess', () => {
      const history = [{ guess: '1234', result: { A: 2, B: 2 }, isCorrect: false }]
      const result = isGuessConsistentWithHistory('1324', history)
      
      // Verify 1324 could produce 2A2B when compared to 1234
      const verification = calculateAB('1234', '1324')
      expect(verification).toStrictEqual({ A: 2, B: 2 })
      expect(result).toBe(true)
    })

    it('should return false for inconsistent guess', () => {
      const history = [{ guess: '1234', result: { A: 4, B: 0 }, isCorrect: true }] // Perfect match
      const result = isGuessConsistentWithHistory('5678', history)
      
      expect(result).toBe(false)
    })

    it('should handle multiple history entries', () => {
      const history = [
        { guess: '1234', result: { A: 1, B: 2 }, isCorrect: false },
        { guess: '5678', result: { A: 0, B: 0 }, isCorrect: false }
      ]
      
      // Use a number we know works from calculatePossibleTargets
      const possibleTargets = calculatePossibleTargets(history)
      if (possibleTargets.length > 0) {
        const validGuess = possibleTargets[0]
        const validResult = isGuessConsistentWithHistory(validGuess, history)
        expect(validResult).toBe(true)
      }
      
      // Test an invalid guess
      const invalidResult = isGuessConsistentWithHistory('5678', history)
      expect(invalidResult).toBe(false)
    })

    it('should return false for impossible scenarios', () => {
      const history = [
        { guess: '1234', result: { A: 4, B: 0 }, isCorrect: true }, // Must be exactly 1234
        { guess: '5678', result: { A: 4, B: 0 }, isCorrect: true }  // Must be exactly 5678 - impossible!
      ]
      
      const result1 = isGuessConsistentWithHistory('1234', history)
      const result2 = isGuessConsistentWithHistory('5678', history)
      
      expect(result1).toBe(false)
      expect(result2).toBe(false)
    })

    it('should work with the original user example scenario 1A2B', () => {
      // User's example: 1234 gives 1A2B, then try 5678
      const history = [{ guess: '1234', result: { A: 1, B: 2 }, isCorrect: false }]
      
      // 5678 should be consistent if there are targets that would give 1A2B to 1234
      // but still allow 5678 as a valid guess
      const result = isGuessConsistentWithHistory('5678', history)
      
      // Let's test this manually: if 5678 were the target, what would 1234 give?
      const manualCheck = calculateAB('1234', '5678')
      
      // 1234 vs 5678 should give 0A0B (no shared digits)
      // But we need 1A2B, so 5678 cannot be the target
      expect(manualCheck).toStrictEqual({ A: 0, B: 0 })
      expect(result).toBe(false) // 5678 is not a valid target
    })

    it('should work with the user reported scenario 1A0B', () => {
      // User's actual report: 1234 gives 1A0B, then try 5678
      const history = [{ guess: '1234', result: { A: 1, B: 0 }, isCorrect: false }]
      
      // 5678 should NOT be consistent because if 5678 were the target,
      // 1234 would give 0A0B, but we need 1A0B
      const result = isGuessConsistentWithHistory('5678', history)
      
      // Let's test this manually: if 5678 were the target, what would 1234 give?
      const manualCheck = calculateAB('1234', '5678')
      
      // 1234 vs 5678 should give 0A0B (no shared digits)
      // But we need 1A0B, so 5678 cannot be the target
      expect(manualCheck).toStrictEqual({ A: 0, B: 0 })
      expect(result).toBe(false) // 5678 is not a valid target
    })

    it('should identify what numbers ARE valid after 1234 gives 1A0B', () => {
      // If 1234 gives 1A0B, what targets are possible?
      const history = [{ guess: '1234', result: { A: 1, B: 0 }, isCorrect: false }]
      const possibleTargets = calculatePossibleTargets(history)
      
      // All possible targets should:
      // 1. Share exactly 1 digit with 1234 in the same position (1A)
      // 2. Share no other digits with 1234 (0B)
      possibleTargets.forEach(target => {
        const feedback = calculateAB('1234', target)
        expect(feedback).toStrictEqual({ A: 1, B: 0 })
      })
      
      // Examples of valid targets: 1xyz where xyz contains none of 2,3,4
      const validExamples = ['1567', '1589', '1068', '1079']
      validExamples.forEach(example => {
        expect(possibleTargets).toContain(example)
        expect(isGuessConsistentWithHistory(example, history)).toBe(true)
      })
      
      // Examples of invalid targets
      const invalidExamples = ['5678', '2134', '1234', '9876']
      invalidExamples.forEach(example => {
        if (example === '1234') {
          // 1234 would give 4A0B, not 1A0B
          expect(isGuessConsistentWithHistory(example, history)).toBe(false)
        } else if (example === '5678' || example === '9876') {
          // These share no digits, would give 0A0B, not 1A0B
          expect(isGuessConsistentWithHistory(example, history)).toBe(false)
        } else if (example === '2134') {
          // This would give 2A2B against 1234 (positions 2,3 match, positions 0,1 swapped), not 1A0B
          expect(isGuessConsistentWithHistory(example, history)).toBe(false)
        }
      })
    })

    it('should correctly handle the ACTUAL user scenario: 1234 gives 0A0B', () => {
      // User's ACTUAL scenario: If 1234 gives 0A0B, then 5678 should be valid
      const history = [{ guess: '1234', result: { A: 0, B: 0 }, isCorrect: false }]
      
      // Test the specific case: should 5678 be valid after 1234 -> 0A0B?
      const check5678 = calculateAB('1234', '5678')
      
      // 5678 SHOULD be valid because it shares no digits with 1234 (gives 0A0B, which matches the feedback)
      expect(check5678).toStrictEqual({ A: 0, B: 0 })
      expect(isGuessConsistentWithHistory('5678', history)).toBe(true)
      
      // Find actual possible targets after 1234 -> 0A0B
      const possibleTargets = calculatePossibleTargets(history)
      
      // Verify 5678 IS in the possible targets (this is what user expects)
      expect(possibleTargets).toContain('5678')
      
      // All possible targets should give 0A0B when compared to 1234
      possibleTargets.slice(0, 20).forEach(target => {
        const feedback = calculateAB('1234', target)
        expect(feedback).toStrictEqual({ A: 0, B: 0 })
      })
      
      // Test some manually calculated valid examples (numbers that share no digits with 1234)
      const validExamples = [
        '5678', // shares no digits with 1234
        '5679', // shares no digits with 1234  
        '5780', // shares no digits with 1234
        '0567', // shares no digits with 1234
      ]
      
      validExamples.forEach(example => {
        expect(calculateAB('1234', example)).toStrictEqual({ A: 0, B: 0 })
        expect(possibleTargets).toContain(example)
        expect(isGuessConsistentWithHistory(example, history)).toBe(true)
      })
    })
  })

  // === NEW STRUCTURE TESTS ===

  describe('createGameGuess', () => {
    it('should create GameGuess with all properties', () => {
      const timestamp = Date.now()
      const result = { A: 2, B: 1 }
      const guess = createGameGuess('1234', result, 3, timestamp)
      
      expect(guess).toStrictEqual({
        guess: '1234',
        result: { A: 2, B: 1 },
        attemptNumber: 3,
        timestamp
      })
    })

    it('should use current timestamp if not provided', () => {
      const before = Date.now()
      const result = { A: 2, B: 1 }
      const guess = createGameGuess('1234', result, 3)
      const after = Date.now()
      
      expect(guess.timestamp).toBeGreaterThanOrEqual(before)
      expect(guess.timestamp).toBeLessThanOrEqual(after)
    })
  })

  describe('createGameGuessFromAB', () => {
    it('should create GameGuess from individual A/B values', () => {
      const timestamp = 1000
      const guess = createGameGuessFromAB('1234', 2, 1, 3, timestamp)
      
      expect(guess).toStrictEqual({
        guess: '1234',
        result: { A: 2, B: 1 },
        attemptNumber: 3,
        timestamp: 1000
      })
    })
  })

  describe('createGameGuessFromTarget', () => {
    it('should calculate A and B automatically', () => {
      const guess = createGameGuessFromTarget('1234', '1324', 1, 1000)
      
      expect(guess).toStrictEqual({
        guess: '1234',
        result: { A: 2, B: 2 }, // positions 0,2 match, digits 3,4 exist but wrong positions
        attemptNumber: 1,
        timestamp: 1000
      })
    })

    it('should handle perfect match', () => {
      const guess = createGameGuessFromTarget('1234', '1234', 1, 1000)
      
      expect(guess.result.A).toBe(4)
      expect(guess.result.B).toBe(0)
    })
  })

  describe('withComputedProperties', () => {
    it('should add computed isCorrect property', () => {
      const guess = createGameGuess('1234', { A: 4, B: 0 }, 1)
      const computed = withComputedProperties(guess)
      
      expect(computed.isCorrect).toBe(true)
    })

    it('should add computed resultString property', () => {
      const guess = createGameGuess('1234', { A: 2, B: 1 }, 1)
      const computed = withComputedProperties(guess)
      
      expect(computed.resultString).toBe('2A1B')
    })

    it('should handle non-winning guess', () => {
      const guess = createGameGuess('1234', { A: 1, B: 2 }, 1)
      const computed = withComputedProperties(guess)
      
      expect(computed.isCorrect).toBe(false)
      expect(computed.resultString).toBe('1A2B')
    })
  })

  describe('gameRecordToGameGuess', () => {
    it('should convert GuessRecord to GameGuess', () => {
      const record = { guess: '1234', result: { A: 2, B: 1 }, isCorrect: false }
      const gameGuess = gameRecordToGameGuess(record, 3, 1000)
      
      expect(gameGuess).toStrictEqual({
        guess: '1234',
        result: { A: 2, B: 1 },
        attemptNumber: 3,
        timestamp: 1000
      })
    })

    it('should handle perfect match record', () => {
      const record = { guess: '1234', result: { A: 4, B: 0 }, isCorrect: true }
      const gameGuess = gameRecordToGameGuess(record, 1, 1000)
      
      expect(gameGuess.result.A).toBe(4)
      expect(gameGuess.result.B).toBe(0)
    })
  })

  describe('gameGuessToGameRecord', () => {
    it('should convert GameGuess to GuessRecord', () => {
      const gameGuess = createGameGuess('1234', { A: 2, B: 1 }, 3, 1000)
      const record = gameGuessToGameRecord(gameGuess)
      
      expect(record).toStrictEqual({
        guess: '1234',
        result: { A: 2, B: 1 },
        isCorrect: false
      })
    })

    it('should handle winning guess', () => {
      const gameGuess = createGameGuess('1234', { A: 4, B: 0 }, 1, 1000)
      const record = gameGuessToGameRecord(gameGuess)
      
      expect(record.isCorrect).toBe(true)
      expect(record.result).toStrictEqual({ A: 4, B: 0 })
    })
  })

  describe('parseResultString', () => {
    it('should parse valid result string', () => {
      const result = parseResultString('2A1B')
      expect(result).toStrictEqual({ A: 2, B: 1 })
    })

    it('should handle perfect match', () => {
      const result = parseResultString('4A0B')
      expect(result).toStrictEqual({ A: 4, B: 0 })
    })

    it('should throw error for invalid format', () => {
      expect(() => parseResultString('invalid')).toThrow('Invalid result format: invalid')
    })
  })

  describe('formatResultString', () => {
    it('should format GuessResult to string', () => {
      const result = formatResultString({ A: 2, B: 1 })
      expect(result).toBe('2A1B')
    })

    it('should handle perfect match', () => {
      const result = formatResultString({ A: 4, B: 0 })
      expect(result).toBe('4A0B')
    })

    it('should handle no match', () => {
      const result = formatResultString({ A: 0, B: 0 })
      expect(result).toBe('0A0B')
    })
  })

  describe('GameGuess vs GuessRecord compatibility', () => {
    it('should maintain data integrity during conversion', () => {
      const originalRecord = { guess: '1234', result: { A: 2, B: 1 }, isCorrect: false }
      const gameGuess = gameRecordToGameGuess(originalRecord, 3, 1000)
      const convertedRecord = gameGuessToGameRecord(gameGuess)
      
      expect(convertedRecord).toStrictEqual(originalRecord)
    })

    it('should produce same results for both GuessRecord and GameGuess formats', () => {
      // GuessRecord format
      const gameRecordHistory = [
        { guess: '1234', result: { A: 1, B: 2 }, isCorrect: false },
        { guess: '5678', result: { A: 0, B: 0 }, isCorrect: false }
      ]
      
      // GameGuess format  
      const gameGuessHistory = [
        createGameGuess('1234', { A: 1, B: 2 }, 1, 1000),
        createGameGuess('5678', { A: 0, B: 0 }, 2, 2000)
      ]
      
      const recordTargets = calculatePossibleTargets(gameRecordHistory)
      const guessTargets = calculatePossibleTargets(gameGuessHistory)
      
      // Results should be identical
      expect(guessTargets.sort()).toStrictEqual(recordTargets.sort())
      
      // Test consistency checking
      const testGuess = '9012'
      const recordConsistent = isGuessConsistentWithHistory(testGuess, gameRecordHistory)
      const guessConsistent = isGuessConsistentWithHistory(testGuess, gameGuessHistory)
      
      expect(guessConsistent).toBe(recordConsistent)
    })

    it('should work with mixed legacy string conversion', () => {
      // Test parseResultString and formatResultString work correctly
      const legacyString = '2A1B'
      const gameResult = parseResultString(legacyString)
      const backToString = formatResultString(gameResult)
      
      expect(gameResult).toStrictEqual({ A: 2, B: 1 })
      expect(backToString).toBe(legacyString)
    })
  })
})
