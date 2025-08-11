import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameLogic } from '../../src/hooks/useGameLogic'

// Mock i18n
const mockT = vi.fn((key) => key)

describe('useGameLogic', () => {
  let hook

  beforeEach(() => {
    const { result } = renderHook(() => useGameLogic(mockT))
    hook = result.current
  })

  describe('遊戲初始化', () => {
    it('應該正確初始化遊戲狀態', () => {
      expect(hook.gameState.gameStarted).toBe(false)
      expect(hook.gameState.playerAttempts).toBe(0)
      expect(hook.gameState.computerAttempts).toBe(0)
      expect(hook.gameState.gameWon).toBe(false)
    })

    it('應該能夠開始新遊戲', () => {
      act(() => {
        hook.startNewGame()
      })

      expect(hook.gameState.gameStarted).toBe(true)
      expect(hook.gameState.computerTarget).toHaveLength(4)
      expect(hook.gameState.currentTurn).toBe('computer')
    })
  })

  describe('玩家猜測', () => {
    beforeEach(() => {
      act(() => {
        hook.startNewGame()
      })
    })

    it('應該處理正確的玩家猜測', () => {
      act(() => {
        hook.updatePlayerGuess('1234')
      })

      act(() => {
        hook.handlePlayerGuess()
      })

      expect(hook.gameState.playerAttempts).toBe(1)
      expect(hook.history.player).toHaveLength(1)
    })

    it('應該拒絕無效的玩家猜測', () => {
      act(() => {
        hook.updatePlayerGuess('123')
      })

      act(() => {
        hook.handlePlayerGuess()
      })

      expect(hook.gameState.playerAttempts).toBe(0)
      expect(hook.gameState.message).toBe('fourDigitsRequired')
    })
  })

  describe('遊戲配置', () => {
    it('應該有正確的遊戲配置', () => {
      expect(hook.GAME_CONFIG.DIGIT_COUNT).toBe(4)
      expect(hook.GAME_CONFIG.MAX_DIGIT).toBe(10)
      expect(hook.GAME_CONFIG.COMPUTER_THINKING_TIME).toBe(1000)
    })
  })
})
