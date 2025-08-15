import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, RenderHookResult } from '@testing-library/react'
import { useGameLogic } from '../../src/hooks/useGameLogic'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))

describe('useGameLogic', () => {
  let hookResult: RenderHookResult<ReturnType<typeof useGameLogic>, unknown>
  const mockAddGameRecord = vi.fn()

  beforeEach(() => {
    mockAddGameRecord.mockClear()
    hookResult = renderHook(() => useGameLogic(mockAddGameRecord))
  })

  describe('game initialization', () => {
    it('should correctly initialize game state', () => {
      const hook = hookResult.result.current
      expect(hook.gameState.gameStarted).toBe(false)
      expect(hook.gameState.playerAttempts).toBe(0)
      expect(hook.gameState.computerAttempts).toBe(0)
      expect(hook.gameState.gameWon).toBe(false)
    })

    it('should be able to start new game', () => {
      act(() => {
        hookResult.result.current.startNewGame()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.gameStarted).toBe(true)
      expect(hook.gameState.computerTarget).toHaveLength(4)
      expect(hook.gameState.currentTurn).toBe('player')
    })
  })

  describe('player guessing', () => {
    beforeEach(() => {
      act(() => {
        hookResult.result.current.startNewGame()
      })
    })

    it('should handle correct player guess', () => {
      act(() => {
        hookResult.result.current.updatePlayerGuess('1234')
      })

      act(() => {
        hookResult.result.current.handlePlayerGuess()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.playerAttempts).toBe(1)
      expect(hook.history.player).toHaveLength(1)
    })

    it('should reject invalid player guess', () => {
      act(() => {
        hookResult.result.current.updatePlayerGuess('123')
      })

      act(() => {
        hookResult.result.current.handlePlayerGuess()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.playerAttempts).toBe(0)
      expect(hook.gameState.message).toBe('fourDigitsRequired')
    })
  })

  describe('hint functionality', () => {
    beforeEach(() => {
      act(() => {
        hookResult.result.current.startNewGame()
      })
    })

    it('should start with 3 hints available', () => {
      const hook = hookResult.result.current
      expect(hook.gameState.hintsRemaining).toBe(3)
    })

    it('should not allow hint check when no previous guesses exist', () => {
      act(() => {
        hookResult.result.current.updatePlayerGuess('1234')
      })

      act(() => {
        hookResult.result.current.handleHintCheck()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.hintsRemaining).toBe(3)
    })

    it('should consume a hint when checking valid guess with history', () => {
      // Make a first guess to establish history
      act(() => {
        hookResult.result.current.updatePlayerGuess('1234')
      })
      act(() => {
        hookResult.result.current.handlePlayerGuess()
      })

      // Now make a second guess and check hint
      act(() => {
        hookResult.result.current.updatePlayerGuess('5678')
      })
      act(() => {
        hookResult.result.current.handleHintCheck()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.hintsRemaining).toBe(2)
    })

    it('should not consume hint when guess is invalid', () => {
      act(() => {
        hookResult.result.current.updatePlayerGuess('123')
      })

      act(() => {
        hookResult.result.current.handleHintCheck()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.hintsRemaining).toBe(3)
      expect(hook.gameState.message).toBe('fourDigitsRequired')
    })

    it('should not allow hint check when no hints remaining', () => {
      // Use up all hints first
      for (let i = 0; i < 3; i++) {
        // Make a guess to establish history
        act(() => {
          hookResult.result.current.updatePlayerGuess('1234')
        })
        act(() => {
          hookResult.result.current.handlePlayerGuess()
        })
        
        // Use a hint
        act(() => {
          hookResult.result.current.updatePlayerGuess('5678')
        })
        act(() => {
          hookResult.result.current.handleHintCheck()
        })
      }

      // Try to use hint when none remaining
      act(() => {
        hookResult.result.current.updatePlayerGuess('9012')
      })
      act(() => {
        hookResult.result.current.handleHintCheck()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.hintsRemaining).toBe(0)
      expect(hook.gameState.message).toBe('noHintsRemaining')
    })

    it('should reset hints when starting new game', () => {
      // Use a hint first
      act(() => {
        hookResult.result.current.updatePlayerGuess('1234')
      })
      act(() => {
        hookResult.result.current.handlePlayerGuess()
      })
      act(() => {
        hookResult.result.current.updatePlayerGuess('5678')
      })
      act(() => {
        hookResult.result.current.handleHintCheck()
      })

      expect(hookResult.result.current.gameState.hintsRemaining).toBe(2)

      // Start new game
      act(() => {
        hookResult.result.current.startNewGame()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.hintsRemaining).toBe(3)
    })

    it('should provide feedback when checking hint', () => {
      // Start game and make first guess
      act(() => {
        hookResult.result.current.startNewGame()
      })
      
      // Make first guess to create history
      act(() => {
        hookResult.result.current.updatePlayerGuess('1356')
      })
      act(() => {
        hookResult.result.current.handlePlayerGuess()
      })

      // Now check any valid guess - should get some feedback
      act(() => {
        hookResult.result.current.updatePlayerGuess('1234')
      })
      act(() => {
        hookResult.result.current.handleHintCheck()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.hintsRemaining).toBe(2)
      // Should get either consistent or inconsistent message
      expect(['hintConsistent', 'hintInconsistent'].some(msg => 
        hook.gameState.message === msg
      )).toBe(true)
    })

    it('should validate multiple previous guesses correctly', () => {
      // Start game
      act(() => {
        hookResult.result.current.startNewGame()
      })

      // Make two previous guesses to build history
      act(() => {
        hookResult.result.current.updatePlayerGuess('1356')
      })
      act(() => {
        hookResult.result.current.handlePlayerGuess()
      })

      act(() => {
        hookResult.result.current.updatePlayerGuess('7890')
      })
      act(() => {
        hookResult.result.current.handlePlayerGuess()
      })

      // Now check a guess against both previous results
      act(() => {
        hookResult.result.current.updatePlayerGuess('2468')
      })
      act(() => {
        hookResult.result.current.handleHintCheck()
      })

      const hook = hookResult.result.current
      expect(hook.gameState.hintsRemaining).toBe(2)
      // Message should be either consistent or inconsistent
      expect(['hintConsistent', 'hintInconsistent'].some(msg => 
        hook.gameState.message.includes(msg)
      )).toBe(true)
    })
  })

  describe('game configuration', () => {
    it('should have correct game configuration', () => {
      const hook = hookResult.result.current
      expect(hook.GAME_CONFIG.DIGIT_COUNT).toBe(4)
      expect(hook.GAME_CONFIG.MAX_DIGIT).toBe(10)
      expect(hook.GAME_CONFIG.COMPUTER_THINKING_TIME).toBe(1000)
    })
  })
})
