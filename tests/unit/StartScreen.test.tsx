import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { StartScreen } from '../../src/components/StartScreen'

describe('StartScreen', () => {
  const mockStartNewGame = vi.fn()
  const mockT = vi.fn((key: string) => key)

  it('should render description and start button', () => {
    render(<StartScreen startNewGame={mockStartNewGame} t={mockT} />)

    expect(mockT).toHaveBeenCalledWith('description')
    expect(mockT).toHaveBeenCalledWith('rules')
    expect(mockT).toHaveBeenCalledWith('rulesDetail')
    expect(mockT).toHaveBeenCalledWith('aExplanation')
    expect(mockT).toHaveBeenCalledWith('bExplanation')
    expect(mockT).toHaveBeenCalledWith('startGame')

    const startButton = screen.getByRole('button')
    expect(startButton).toBeInTheDocument()
  })

  it('should call startNewGame when button is clicked', async () => {
    const user = userEvent.setup()
    render(<StartScreen startNewGame={mockStartNewGame} t={mockT} />)

    const startButton = screen.getByRole('button')
    await user.click(startButton)

    expect(mockStartNewGame).toHaveBeenCalled()
  })

  it('should have proper CSS classes', () => {
    render(<StartScreen startNewGame={mockStartNewGame} t={mockT} />)

    expect(screen.getByRole('button')).toHaveClass('start-button')
    expect(document.querySelector('.start-screen')).toBeInTheDocument()
    expect(document.querySelector('.description')).toBeInTheDocument()
  })
})