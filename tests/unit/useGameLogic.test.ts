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

  describe('game configuration', () => {
    it('should have correct game configuration', () => {
      const hook = hookResult.result.current
      expect(hook.GAME_CONFIG.DIGIT_COUNT).toBe(4)
      expect(hook.GAME_CONFIG.MAX_DIGIT).toBe(10)
      expect(hook.GAME_CONFIG.COMPUTER_THINKING_TIME).toBe(1000)
    })
  })
})
