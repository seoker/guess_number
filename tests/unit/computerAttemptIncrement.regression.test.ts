import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../../src/hooks/useGameState'

describe('computer Attempt Increment Regression Tests', () => {
  describe('playerWinsWithComputerAttempts action', () => {
    it('should correctly update both player and computer attempts when player wins with computer final guess', () => {
      const { result } = renderHook(() => useGameState())

      // Start game
      act(() => {
        result.current.startNewGame()
      })

      // Initial state
      expect(result.current.gameState.playerAttempts).toBe(0)
      expect(result.current.gameState.computerAttempts).toBe(0)
      expect(result.current.gameState.gameWon).toBe(false)

      // Simulate player wins with computer having made 1 final attempt
      act(() => {
        result.current.playerWinsWithComputerAttempts(1, 1)
      })

      // Both should be 1, game should be won
      expect(result.current.gameState.playerAttempts).toBe(1)
      expect(result.current.gameState.computerAttempts).toBe(1)
      expect(result.current.gameState.gameWon).toBe(true)
    })

    it('should handle multiple attempts correctly', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.startNewGame()
      })

      // Simulate a longer game where player wins after computer made several attempts
      act(() => {
        result.current.playerWinsWithComputerAttempts(3, 3)
      })

      expect(result.current.gameState.playerAttempts).toBe(3)
      expect(result.current.gameState.computerAttempts).toBe(3)
      expect(result.current.gameState.gameWon).toBe(true)
    })

    it('should handle asymmetric attempt counts correctly', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.startNewGame()
      })

      // Player wins with 2 attempts, computer made 3 attempts (final guess scenario)
      act(() => {
        result.current.playerWinsWithComputerAttempts(2, 3)
      })

      expect(result.current.gameState.playerAttempts).toBe(2)
      expect(result.current.gameState.computerAttempts).toBe(3)
      expect(result.current.gameState.gameWon).toBe(true)
    })
  })

  describe('computer attempt increment in normal flow', () => {
    it('should increment computer attempts when switching to player', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.startNewGame()
      })

      expect(result.current.gameState.computerAttempts).toBe(0)

      // Simulate computer turn completion
      act(() => {
        result.current.switchToPlayer()
      })

      expect(result.current.gameState.computerAttempts).toBe(1)
    })

    it('should increment computer attempts multiple times', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.startNewGame()
      })

      // Multiple computer turns
      act(() => {
        result.current.switchToPlayer()
      })
      expect(result.current.gameState.computerAttempts).toBe(1)

      act(() => {
        result.current.switchToPlayer()
      })
      expect(result.current.gameState.computerAttempts).toBe(2)

      act(() => {
        result.current.switchToPlayer()
      })
      expect(result.current.gameState.computerAttempts).toBe(3)
    })
  })

  describe('game state consistency', () => {
    it('should maintain proper state when using playerWinsWithComputerAttempts', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.startNewGame()
      })

      const initialTarget = result.current.gameState.computerTarget

      act(() => {
        result.current.playerWinsWithComputerAttempts(2, 2)
      })

      // Game should be won, but other properties should be preserved/reset correctly
      expect(result.current.gameState.gameWon).toBe(true)
      expect(result.current.gameState.computerTarget).toBe(initialTarget) // Should be preserved
      expect(result.current.gameState.playerGuess).toBe('') // Should be cleared
      expect(result.current.gameState.message).toBe('') // Should be cleared
      expect(result.current.gameState.gameStarted).toBe(true) // Should remain true
    })
  })
})