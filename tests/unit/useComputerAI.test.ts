import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useComputerAI } from '../../src/hooks/useComputerAI'
import * as gameUtils from '../../src/utils/gameUtils'

// Mock gameUtils
vi.mock('../../src/utils/gameUtils', () => ({
  generateAllPossibleNumbers: vi.fn(),
  makeComputerGuess: vi.fn(),
  updatePossibleNumbers: vi.fn(),
  checkFeedbackConsistency: vi.fn(),
  calculateAB: vi.fn(),
  calculatePossibleTargets: vi.fn()
}))

describe('useComputerAI', () => {
  const mockPossibleNumbers = ['1234', '5678', '9012', '3456']
  const mockAllPossibleNumbers = ['1234', '5678', '9012', '3456', '7890']

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(gameUtils.generateAllPossibleNumbers).mockReturnValue(mockAllPossibleNumbers)
    vi.mocked(gameUtils.makeComputerGuess).mockReturnValue('1234')
    vi.mocked(gameUtils.updatePossibleNumbers).mockReturnValue(mockPossibleNumbers)
    vi.mocked(gameUtils.checkFeedbackConsistency).mockReturnValue(true)
    vi.mocked(gameUtils.calculateAB).mockReturnValue({ A: 1, B: 2 })
    vi.mocked(gameUtils.calculatePossibleTargets).mockReturnValue(mockPossibleNumbers)
  })

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useComputerAI())
      
      expect(result.current.computerAI.possibleNumbers).toStrictEqual([])
      expect(result.current.computerAI.currentGuess).toBe('')
      expect(result.current.computerAI.playerFeedback).toStrictEqual({ A: 0, B: 0 })
      expect(result.current.computerAI.showFeedbackForm).toBe(false)
    })

    it('should initialize AI with all possible numbers', () => {
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.initializeAI()
      })

      expect(gameUtils.generateAllPossibleNumbers).toHaveBeenCalled()
      expect(result.current.computerAI.possibleNumbers).toStrictEqual(mockAllPossibleNumbers)
      expect(result.current.computerAI.currentGuess).toBe('')
      expect(result.current.computerAI.playerFeedback).toStrictEqual({ A: 0, B: 0 })
      expect(result.current.computerAI.showFeedbackForm).toBe(false)
    })
  })

  describe('makeGuess', () => {
    it('should make a guess and show feedback form', () => {
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.initializeAI()
      })

      let guess: string
      act(() => {
        guess = result.current.makeGuess()
      })

      expect(gameUtils.makeComputerGuess).toHaveBeenCalledWith(mockAllPossibleNumbers)
      expect(guess!).toBe('1234')
      expect(result.current.computerAI.currentGuess).toBe('1234')
      expect(result.current.computerAI.showFeedbackForm).toBe(true)
    })
  })

  describe('updateFeedback', () => {
    it('should update A feedback', () => {
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.updateFeedback('A', '2')
      })

      expect(result.current.computerAI.playerFeedback.A).toBe(2)
      expect(result.current.computerAI.playerFeedback.B).toBe(0)
    })

    it('should update B feedback', () => {
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.updateFeedback('B', '1')
      })

      expect(result.current.computerAI.playerFeedback.A).toBe(0)
      expect(result.current.computerAI.playerFeedback.B).toBe(1)
    })

    it('should update both A and B feedback independently', () => {
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.updateFeedback('A', '3')
      })
      
      act(() => {
        result.current.updateFeedback('B', '1')
      })

      expect(result.current.computerAI.playerFeedback.A).toBe(3)
      expect(result.current.computerAI.playerFeedback.B).toBe(1)
    })
  })

  describe('processFeedback', () => {
    it('should process feedback and update possible numbers', () => {
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.initializeAI()
      })
      
      act(() => {
        result.current.makeGuess()
      })

      let newPossibleNumbers: string[]
      act(() => {
        newPossibleNumbers = result.current.processFeedback('1A2B')
      })

      expect(gameUtils.updatePossibleNumbers).toHaveBeenCalledWith('1234', '1A2B', mockAllPossibleNumbers)
      expect(newPossibleNumbers!).toStrictEqual(mockPossibleNumbers)
      expect(result.current.computerAI.possibleNumbers).toStrictEqual(mockPossibleNumbers)
      expect(result.current.computerAI.showFeedbackForm).toBe(false)
      expect(result.current.computerAI.playerFeedback).toStrictEqual({ A: 0, B: 0 })
    })
  })

  describe('checkFeedbackIsConsistent', () => {
    it('should check feedback consistency', () => {
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.initializeAI()
      })
      
      act(() => {
        result.current.makeGuess()
      })

      let isConsistent: boolean
      act(() => {
        isConsistent = result.current.checkFeedbackIsConsistent({ A: 1, B: 2 })
      })

      expect(gameUtils.checkFeedbackConsistency).toHaveBeenCalledWith('1234', { A: 1, B: 2 }, mockAllPossibleNumbers)
      expect(isConsistent!).toBe(true)
    })

    it('should return false for inconsistent feedback', () => {
      vi.mocked(gameUtils.checkFeedbackConsistency).mockReturnValue(false)
      
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.initializeAI()
      })
      
      act(() => {
        result.current.makeGuess()
      })

      let isConsistent: boolean
      act(() => {
        isConsistent = result.current.checkFeedbackIsConsistent({ A: 4, B: 1 })
      })

      expect(isConsistent!).toBe(false)
    })
  })

  describe('resetFeedbackForm', () => {
    it('should reset feedback form state', () => {
      const { result } = renderHook(() => useComputerAI())
      
      act(() => {
        result.current.initializeAI()
      })
      
      act(() => {
        result.current.makeGuess()
      })
      
      act(() => {
        result.current.updateFeedback('A', '2')
      })
      
      act(() => {
        result.current.updateFeedback('B', '1')
      })

      act(() => {
        result.current.resetFeedbackForm()
      })

      expect(result.current.computerAI.showFeedbackForm).toBe(false)
      expect(result.current.computerAI.playerFeedback).toStrictEqual({ A: 0, B: 0 })
    })
  })

  describe('recalculatePossibleNumbers', () => {
    it('should recalculate possible numbers from history', () => {
      const { result } = renderHook(() => useComputerAI())
      
      const history = [
        { guess: '1234', result: '1A2B' }
      ]

      let newPossibleNumbers: string[]
      act(() => {
        newPossibleNumbers = result.current.recalculatePossibleNumbers(history)
      })

      expect(gameUtils.calculatePossibleTargets).toHaveBeenCalledWith(history)
      expect(Array.isArray(newPossibleNumbers!)).toBe(true)
      expect(result.current.computerAI.possibleNumbers).toStrictEqual(newPossibleNumbers!)
    })

    it('should handle empty history', () => {
      const { result } = renderHook(() => useComputerAI())
      
      let newPossibleNumbers: string[]
      act(() => {
        newPossibleNumbers = result.current.recalculatePossibleNumbers([])
      })

      expect(gameUtils.calculatePossibleTargets).toHaveBeenCalledWith([])
      expect(result.current.computerAI.possibleNumbers).toStrictEqual(mockPossibleNumbers)
      expect(newPossibleNumbers!).toStrictEqual(mockPossibleNumbers)
    })
  })
})