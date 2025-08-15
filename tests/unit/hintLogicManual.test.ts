import { describe, it, expect } from 'vitest'
import { calculateAB } from '../../src/utils/gameUtils'

describe('hint Logic Verification', () => {
  describe('calculateAB function verification', () => {
    it('should calculate AB correctly for exact match', () => {
      const result = calculateAB('1234', '1234')
      expect(result.A).toBe(4)
      expect(result.B).toBe(0)
    })

    it('should calculate AB correctly for no match', () => {
      const result = calculateAB('1234', '5678')
      expect(result.A).toBe(0)
      expect(result.B).toBe(0)
    })

    it('should calculate AB correctly for 2A2B case', () => {
      // If computer target is 1324, and player guesses 1234
      // A: Position 0: 1=1 ✓, Position 3: 4=4 ✓ -> A=2
      // B: Position 1: 2 exists in target but wrong pos ✓, Position 2: 3 exists in target but wrong pos ✓ -> B=2
      const result = calculateAB('1234', '1324')
      expect(result.A).toBe(2) // positions 0 and 3
      expect(result.B).toBe(2) // digits 2 and 3 exist but wrong positions
    })

    it('should calculate AB correctly for mixed case', () => {
      // If computer target is 2134, and player guesses 1234  
      // Position 1: 1 vs 2 (no match, but 1 exists in target at pos 3) -> B
      // Position 2: 2 vs 1 (no match, but 2 exists in target at pos 1) -> B  
      // Position 3: 3 vs 3 (match) -> A
      // Position 4: 4 vs 4 (match) -> A
      // So should be 2A2B
      const result = calculateAB('1234', '2143')
      expect(result.A).toBe(0) // no exact position matches
      expect(result.B).toBe(4) // all digits exist but in wrong positions
    })
  })

  describe('hint consistency logic verification', () => {
    it('should validate scenario: guess 1234 got 2A0B, check if 5678 is consistent', () => {
      // Previous: player guessed 1234, got 2A0B
      // Question: could 5678 be the target?
      // If 5678 were target, then calculateAB('1234', '5678') should give 2A0B
      const result = calculateAB('1234', '5678')
      
      // 1234 vs 5678: no digits match at all
      expect(result.A).toBe(0)
      expect(result.B).toBe(0)
      
      // This means 5678 is NOT consistent with "1234 got 2A0B"
      // Because if 5678 were the target, 1234 would get 0A0B, not 2A0B
      const isConsistent = (result.A === 2 && result.B === 0)
      expect(isConsistent).toBe(false)
    })

    it('should validate scenario: guess 1234 got 2A0B, check if 1256 is consistent', () => {
      // Previous: player guessed 1234, got 2A0B
      // Question: could 1256 be the target?
      const result = calculateAB('1234', '1256')
      
      // 1234 vs 1256: 
      // A: Position 0: 1=1 ✓, Position 1: 2=2 ✓ -> A=2
      // B: Position 2: 3 not in 1256, Position 3: 4 not in 1256 -> B=0
      expect(result.A).toBe(2)
      expect(result.B).toBe(0)
      
      // This IS consistent with "1234 got 2A0B"
      const isConsistent = (result.A === 2 && result.B === 0)
      expect(isConsistent).toBe(true)
    })

    it('should validate scenario: guess 1234 got 1A1B, check if target could be 2134', () => {
      // If target were 2134, what would 1234 get?
      const result = calculateAB('1234', '2134')
      
      // 1234 vs 2134:
      // Position 1: 1≠2, but 1 exists at pos 3 -> B
      // Position 2: 2≠1, but 2 exists at pos 1 -> B  
      // Position 3: 3≠3, wait that's wrong...
      // Let me recalculate: 1234 vs 2134
      // Position 1: 1≠2 (1 exists in target at position 3, so B)
      // Position 2: 2≠1 (2 exists in target at position 1, so B)
      // Position 3: 3=3 (exact match, so A)
      // Position 4: 4≠4, wait that's wrong too...
      // 2134 -> positions are: 2(1st), 1(2nd), 3(3rd), 4(4th)
      // So: 1234 vs 2134
      // Pos 1: 1 vs 2 -> 1 exists at pos 2 of target -> B
      // Pos 2: 2 vs 1 -> 2 exists at pos 1 of target -> B  
      // Pos 3: 3 vs 3 -> exact match -> A
      // Pos 4: 4 vs 4 -> exact match -> A
      // Total: 2A2B
      expect(result.A).toBe(2)
      expect(result.B).toBe(2)
      
      // So 2134 would NOT be consistent with "1234 got 1A1B"
      const isConsistent = (result.A === 1 && result.B === 1)
      expect(isConsistent).toBe(false)
    })
  })
})