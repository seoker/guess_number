import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, RenderHookResult } from '@testing-library/react'
import { useGameState } from '../../src/hooks/useGameState'
import { MessageType } from '../../src/types'

describe('useGameState', () => {
  let hookResult: RenderHookResult<ReturnType<typeof useGameState>, unknown>

  beforeEach(() => {
    hookResult = renderHook(() => useGameState())
  })

  describe('player attempts tracking', () => {
    beforeEach(() => {
      act(() => {
        hookResult.result.current.startNewGame()
      })
    })

    it('should initialize player attempts to 0', () => {
      const { gameState } = hookResult.result.current
      expect(gameState.playerAttempts).toBe(0)
    })

    it('should increment player attempts on successful turn', () => {
      const { gameState, playerTurnSuccess } = hookResult.result.current
      
      expect(gameState.playerAttempts).toBe(0)
      
      act(() => {
        playerTurnSuccess(1, '1A2B')
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(1)
      expect(hookResult.result.current.gameState.currentTurn).toBe('computer')
      expect(hookResult.result.current.gameState.message).toBe('1A2B')
    })

    it('should increment player attempts multiple times correctly', () => {
      const { playerTurnSuccess } = hookResult.result.current
      
      // Initial state
      expect(hookResult.result.current.gameState.playerAttempts).toBe(0)
      
      // First player turn
      act(() => {
        playerTurnSuccess(1, '0A1B')
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(1)
      
      // Second player turn (simulate switching back to player)
      act(() => {
        hookResult.result.current.switchToPlayer()
        playerTurnSuccess(2, '1A1B')
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
      
      // Third player turn
      act(() => {
        hookResult.result.current.switchToPlayer()
        playerTurnSuccess(3, '2A1B')
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(3)
    })

    it('should set correct player attempts when player wins', () => {
      const { playerWins } = hookResult.result.current
      
      act(() => {
        playerWins(4)
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(4)
      expect(hookResult.result.current.gameState.gameWon).toBe(true)
    })

    it('should reset player attempts when starting new game', () => {
      const { playerTurnSuccess, startNewGame } = hookResult.result.current
      
      // Make some player attempts
      act(() => {
        playerTurnSuccess(1, '1A0B')
        hookResult.result.current.switchToPlayer()
        playerTurnSuccess(2, '0A2B')
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
      
      // Start new game
      act(() => {
        startNewGame()
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(0)
    })

    it('should reset player attempts when resetting game', () => {
      const { playerTurnSuccess, resetGame } = hookResult.result.current
      
      // Make some player attempts
      act(() => {
        playerTurnSuccess(1, '1A1B')
        hookResult.result.current.switchToPlayer()
        playerTurnSuccess(2, '2A0B')
        hookResult.result.current.switchToPlayer()
        playerTurnSuccess(3, '1A2B')
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(3)
      
      // Reset game
      act(() => {
        resetGame()
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(0)
    })

    it('should maintain player attempts during computer operations', () => {
      const { playerTurnSuccess, switchToPlayer, computerWins } = hookResult.result.current
      
      // Make player attempt
      act(() => {
        playerTurnSuccess(2, '1A1B')
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
      
      // Switch to player should not affect player attempts
      act(() => {
        switchToPlayer()
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
      
      // Computer wins should not affect player attempts
      act(() => {
        computerWins(3, '1234')
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
    })

    it('should handle computer final turn without affecting player attempts', () => {
      const { playerTurnSuccess, computerFinalTurn } = hookResult.result.current
      
      // Player makes attempts first
      act(() => {
        playerTurnSuccess(1, '1A0B')
        hookResult.result.current.switchToPlayer()
        playerTurnSuccess(2, '0A1B')
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
      
      // Computer final turn should update player attempts to the value passed
      act(() => {
        computerFinalTurn(3)
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(3)
      expect(hookResult.result.current.gameState.currentTurn).toBe('computer')
    })
  })

  describe('computer attempts tracking', () => {
    beforeEach(() => {
      act(() => {
        hookResult.result.current.startNewGame()
      })
    })

    it('should initialize computer attempts to 0', () => {
      const { gameState } = hookResult.result.current
      expect(gameState.computerAttempts).toBe(0)
    })

    it('should increment computer attempts when switching to player', () => {
      const { gameState, switchToPlayer } = hookResult.result.current
      
      expect(gameState.computerAttempts).toBe(0)
      
      act(() => {
        switchToPlayer()
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
    })

    it('should increment computer attempts multiple times correctly', () => {
      const { switchToPlayer } = hookResult.result.current
      
      // Initial state
      expect(hookResult.result.current.gameState.computerAttempts).toBe(0)
      
      // First computer turn
      act(() => {
        switchToPlayer()
      })
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
      
      // Second computer turn
      act(() => {
        switchToPlayer()
      })
      expect(hookResult.result.current.gameState.computerAttempts).toBe(2)
      
      // Third computer turn
      act(() => {
        switchToPlayer()
      })
      expect(hookResult.result.current.gameState.computerAttempts).toBe(3)
    })

    it('should reset computer attempts when starting new game', () => {
      const { switchToPlayer, startNewGame } = hookResult.result.current
      
      // Make some computer attempts
      act(() => {
        switchToPlayer()
        switchToPlayer()
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(2)
      
      // Start new game
      act(() => {
        startNewGame()
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(0)
    })

    it('should reset computer attempts when resetting game', () => {
      const { switchToPlayer, resetGame } = hookResult.result.current
      
      // Make some computer attempts
      act(() => {
        switchToPlayer()
        switchToPlayer()
        switchToPlayer()
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(3)
      
      // Reset game
      act(() => {
        resetGame()
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(0)
    })

    it('should set correct computer attempts when computer wins', () => {
      const { computerWins } = hookResult.result.current
      
      act(() => {
        computerWins(5, '1234')
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(5)
      expect(hookResult.result.current.gameState.gameWon).toBe(true)
    })

    it('should set correct computer attempts in draw scenario', () => {
      const { gameDraw } = hookResult.result.current
      
      act(() => {
        gameDraw(7)
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(7)
      expect(hookResult.result.current.gameState.gameWon).toBe(true)
    })

    it('should not increment computer attempts when switching to computer', () => {
      const { switchToPlayer, switchToComputer } = hookResult.result.current
      
      // First increment via switchToPlayer
      act(() => {
        switchToPlayer()
      })
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
      
      // Switching to computer should not increment
      act(() => {
        switchToComputer()
      })
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
    })

    it('should maintain computer attempts during player turn operations', () => {
      const { switchToPlayer, playerTurnSuccess, playerWins } = hookResult.result.current
      
      // Make computer attempt
      act(() => {
        switchToPlayer()
      })
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
      
      // Player turn success should not affect computer attempts
      act(() => {
        playerTurnSuccess(2, '1A2B')
      })
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
      
      // Player wins should not affect computer attempts
      act(() => {
        playerWins(3)
      })
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
    })
  })

  describe('combined attempts tracking', () => {
    beforeEach(() => {
      act(() => {
        hookResult.result.current.startNewGame()
      })
    })

    it('should track both player and computer attempts independently', () => {
      const { playerTurnSuccess, switchToPlayer } = hookResult.result.current
      
      // Initial state
      expect(hookResult.result.current.gameState.playerAttempts).toBe(0)
      expect(hookResult.result.current.gameState.computerAttempts).toBe(0)
      
      // Player makes first attempt
      act(() => {
        playerTurnSuccess(1, '1A2B')
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(1)
      expect(hookResult.result.current.gameState.computerAttempts).toBe(0)
      
      // Computer makes first attempt (simulated by switchToPlayer)
      act(() => {
        switchToPlayer()
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(1)
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
      
      // Player makes second attempt
      act(() => {
        playerTurnSuccess(2, '2A1B')
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
      expect(hookResult.result.current.gameState.computerAttempts).toBe(1)
      
      // Computer makes second attempt
      act(() => {
        switchToPlayer()
      })
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
      expect(hookResult.result.current.gameState.computerAttempts).toBe(2)
    })

    it('should handle draw scenario with correct attempts for both', () => {
      const { gameDraw } = hookResult.result.current
      
      // Simulate a draw at round 5
      act(() => {
        gameDraw(5)
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(5)
      expect(hookResult.result.current.gameState.gameWon).toBe(true)
    })

    it('should reset both attempts on game restart', () => {
      const { playerTurnSuccess, switchToPlayer, startNewGame } = hookResult.result.current
      
      // Make some attempts for both
      act(() => {
        playerTurnSuccess(1, '1A1B')
        switchToPlayer()
        playerTurnSuccess(2, '2A0B')
        switchToPlayer()
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(2)
      expect(hookResult.result.current.gameState.computerAttempts).toBe(2)
      
      // Start new game
      act(() => {
        startNewGame()
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(0)
      expect(hookResult.result.current.gameState.computerAttempts).toBe(0)
      expect(hookResult.result.current.gameState.gameWon).toBe(false)
      expect(hookResult.result.current.gameState.gameStarted).toBe(true)
    })

    it('should maintain correct win conditions based on attempts', () => {
      const { playerWins, computerWins } = hookResult.result.current
      
      // Test player wins with specific attempts
      act(() => {
        playerWins(3)
      })
      
      expect(hookResult.result.current.gameState.playerAttempts).toBe(3)
      expect(hookResult.result.current.gameState.gameWon).toBe(true)
      
      // Reset and test computer wins
      act(() => {
        hookResult.result.current.startNewGame()
        computerWins(4, '1234')
      })
      
      expect(hookResult.result.current.gameState.computerAttempts).toBe(4)
      expect(hookResult.result.current.gameState.gameWon).toBe(true)
    })
  })

  describe('state consistency', () => {
    it('should maintain correct state when computer attempts increment', () => {
      act(() => {
        hookResult.result.current.startNewGame()
      })

      const { switchToPlayer } = hookResult.result.current
      
      act(() => {
        switchToPlayer()
      })
      
      const { gameState } = hookResult.result.current
      expect(gameState.computerAttempts).toBe(1)
      expect(gameState.currentTurn).toBe('player')
      expect(gameState.message).toBe('')
      expect(gameState.messageType).toBe(MessageType.INFO)
      expect(gameState.gameWon).toBe(false)
    })

    it('should maintain correct state when player attempts increment', () => {
      act(() => {
        hookResult.result.current.startNewGame()
      })

      const { playerTurnSuccess } = hookResult.result.current
      
      act(() => {
        playerTurnSuccess(1, '1A2B')
      })
      
      const { gameState } = hookResult.result.current
      expect(gameState.playerAttempts).toBe(1)
      expect(gameState.currentTurn).toBe('computer')
      expect(gameState.message).toBe('1A2B')
      expect(gameState.messageType).toBe(MessageType.INFO)
      expect(gameState.gameWon).toBe(false)
      expect(gameState.playerGuess).toBe('')
    })
  })
})