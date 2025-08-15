import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { WinScreen } from '../../src/components/WinScreen'

describe('WinScreen', () => {
  const mockStartNewGame = vi.fn()
  const mockT = vi.fn((key: string) => key)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render game over message and play again button', () => {
    render(<WinScreen startNewGame={mockStartNewGame} t={mockT} />)

    expect(mockT).toHaveBeenCalledWith('gameOver')
    expect(mockT).toHaveBeenCalledWith('playAgain')

    const playAgainButton = screen.getByRole('button')
    expect(playAgainButton).toBeInTheDocument()
  })

  it('should call startNewGame when play again button is clicked', async () => {
    const user = userEvent.setup()
    render(<WinScreen startNewGame={mockStartNewGame} t={mockT} />)

    const playAgainButton = screen.getByRole('button')
    await user.click(playAgainButton)

    expect(mockStartNewGame).toHaveBeenCalled()
  })

  it('should have proper CSS classes', () => {
    render(<WinScreen startNewGame={mockStartNewGame} t={mockT} />)

    expect(document.querySelector('.win-section')).toBeInTheDocument()
    expect(document.querySelector('.win-message')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('restart-button')
  })
})