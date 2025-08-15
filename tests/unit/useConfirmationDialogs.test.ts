import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useConfirmationDialogs } from '../../src/hooks/useConfirmationDialogs'
import Swal from 'sweetalert2'

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn()
  }
}))

describe('useConfirmationDialogs', () => {
  let mockResetGame: ReturnType<typeof vi.fn>
  let mockStartNewGame: ReturnType<typeof vi.fn>
  let mockT: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockResetGame = vi.fn()
    mockStartNewGame = vi.fn()
    mockT = vi.fn((key: string) => key)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('showResetConfirmation', () => {
    it('should show confirmation dialog and execute reset when confirmed', async () => {
      vi.mocked(Swal.fire)
        .mockResolvedValueOnce({ isConfirmed: true } as any)
        .mockResolvedValueOnce({} as any)

      const { result } = renderHook(() =>
        useConfirmationDialogs(mockResetGame, mockStartNewGame, mockT)
      )

      await act(async () => {
        await result.current.showResetConfirmation()
      })

      expect(Swal.fire).toHaveBeenCalledTimes(2)
      expect(Swal.fire).toHaveBeenNthCalledWith(1, {
        title: 'confirmResetGame',
        text: 'resetGameWarning',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4757',
        cancelButtonColor: '#747d8c',
        confirmButtonText: 'confirmReset',
        cancelButtonText: 'cancel',
        reverseButtons: true
      })
      expect(mockResetGame).toHaveBeenCalled()
      expect(Swal.fire).toHaveBeenNthCalledWith(2, {
        title: 'gameReset',
        text: 'newGameStarted',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    })

    it('should not execute reset when cancelled', async () => {
      vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false } as any)

      const { result } = renderHook(() =>
        useConfirmationDialogs(mockResetGame, mockStartNewGame, mockT)
      )

      await act(async () => {
        await result.current.showResetConfirmation()
      })

      expect(mockResetGame).not.toHaveBeenCalled()
      expect(Swal.fire).toHaveBeenCalledTimes(1)
    })
  })

  describe('showRestartConfirmation', () => {
    it('should show confirmation dialog and execute restart when confirmed', async () => {
      vi.mocked(Swal.fire)
        .mockResolvedValueOnce({ isConfirmed: true } as any)
        .mockResolvedValueOnce({} as any)

      const { result } = renderHook(() =>
        useConfirmationDialogs(mockResetGame, mockStartNewGame, mockT)
      )

      await act(async () => {
        await result.current.showRestartConfirmation()
      })

      expect(Swal.fire).toHaveBeenCalledTimes(2)
      expect(Swal.fire).toHaveBeenNthCalledWith(1, {
        title: 'confirmRestartGame',
        text: 'restartGameWarning',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4757',
        cancelButtonColor: '#747d8c',
        confirmButtonText: 'confirmRestart',
        cancelButtonText: 'cancel',
        reverseButtons: true
      })
      expect(mockStartNewGame).toHaveBeenCalled()
      expect(Swal.fire).toHaveBeenNthCalledWith(2, {
        title: 'gameRestarted',
        text: 'freshGameStarted',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    })

    it('should not execute restart when cancelled', async () => {
      vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false } as any)

      const { result } = renderHook(() =>
        useConfirmationDialogs(mockResetGame, mockStartNewGame, mockT)
      )

      await act(async () => {
        await result.current.showRestartConfirmation()
      })

      expect(mockStartNewGame).not.toHaveBeenCalled()
      expect(Swal.fire).toHaveBeenCalledTimes(1)
    })
  })

  it('should use translation function for all texts', async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as any)

    const { result } = renderHook(() =>
      useConfirmationDialogs(mockResetGame, mockStartNewGame, mockT)
    )

    await act(async () => {
      await result.current.showResetConfirmation()
    })

    expect(mockT).toHaveBeenCalledWith('confirmResetGame')
    expect(mockT).toHaveBeenCalledWith('resetGameWarning')
    expect(mockT).toHaveBeenCalledWith('confirmReset')
    expect(mockT).toHaveBeenCalledWith('cancel')
  })
})