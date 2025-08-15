import { useCallback } from 'react'
import Swal from 'sweetalert2'

export interface ConfirmationDialogsResult {
  showResetConfirmation: () => Promise<void>
  showRestartConfirmation: () => Promise<void>
}

export const useConfirmationDialogs = (
  resetGame: () => void,
  startNewGame: () => void,
  t: (key: string) => string
): ConfirmationDialogsResult => {
  const showResetConfirmation = useCallback(async (): Promise<void> => {
    const result = await Swal.fire({
      title: t('confirmResetGame'),
      text: t('resetGameWarning'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#747d8c',
      confirmButtonText: t('confirmReset'),
      cancelButtonText: t('cancel'),
      reverseButtons: true
    })

    if (result.isConfirmed) {
      resetGame()
      Swal.fire({
        title: t('gameReset'),
        text: t('newGameStarted'),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }, [resetGame, t])

  const showRestartConfirmation = useCallback(async (): Promise<void> => {
    const result = await Swal.fire({
      title: t('confirmRestartGame'),
      text: t('restartGameWarning'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#747d8c',
      confirmButtonText: t('confirmRestart'),
      cancelButtonText: t('cancel'),
      reverseButtons: true
    })

    if (result.isConfirmed) {
      startNewGame()
      Swal.fire({
        title: t('gameRestarted'),
        text: t('freshGameStarted'),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }, [startNewGame, t])

  return {
    showResetConfirmation,
    showRestartConfirmation
  }
}