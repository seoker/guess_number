import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'hintButtonTooltip') return `Check if your current guess is consistent with your previous guesses (${options?.remaining} hints remaining)`
      return key
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn()
    }
  })
}))

describe('hint Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show hint button with correct count and disable appropriately', async () => {
    const user = userEvent.setup()
    
    render(<App />)
    
    // Start the game
    await user.click(screen.getByText('startGame'))
    
    // Wait for game to start
    expect(screen.getByText('guess')).toBeInTheDocument()
    
    // Make first guess: 1234
    const digitInputs = screen.getAllByPlaceholderText('?')
    expect(digitInputs).toHaveLength(4)
    
    await user.type(digitInputs[0], '1')
    await user.type(digitInputs[1], '2')
    await user.type(digitInputs[2], '3')
    await user.type(digitInputs[3], '4')
    
    // Hint button should be disabled (no history yet)
    const hintButtonBefore = screen.getByText(/checkHint \(3\)/)
    expect(hintButtonBefore).toBeDisabled()
    
    // Submit first guess
    await user.click(screen.getByText('guess'))
    
    // After first guess, we should have history, but now it's computer's turn
    // so hint button should still be disabled
    const hintButtonAfterGuess = screen.getByText(/checkHint \(3\)/)
    expect(hintButtonAfterGuess).toBeDisabled()
    
    // The game UI should show player history
    expect(screen.getByText('1234')).toBeInTheDocument()
    const historyResults = screen.getAllByText(/\d+A\d+B/)
    expect(historyResults.length).toBeGreaterThan(0) // Should have at least one result
  })

  it('should disable hint button when no history exists', async () => {
    const user = userEvent.setup()
    
    render(<App />)
    
    // Start the game
    await user.click(screen.getByText('startGame'))
    
    // Fill in digits but don't make a guess yet
    const digitInputs = screen.getAllByPlaceholderText('?')
    await user.type(digitInputs[0], '1')
    await user.type(digitInputs[1], '2')
    await user.type(digitInputs[2], '3')
    await user.type(digitInputs[3], '4')
    
    // Hint button should be disabled (no history)
    const hintButton = screen.getByText(/checkHint \(3\)/)
    expect(hintButton).toBeDisabled()
  })

  it('should show hint button is disabled when incomplete guess', async () => {
    const user = userEvent.setup()
    
    render(<App />)
    
    // Start the game
    await user.click(screen.getByText('startGame'))
    
    const digitInputs = screen.getAllByPlaceholderText('?')
    
    // Enter incomplete guess (only 3 digits)
    await user.type(digitInputs[0], '1')
    await user.type(digitInputs[1], '2')
    await user.type(digitInputs[2], '3')
    // Leave 4th digit empty
    
    // Hint button should be disabled due to incomplete guess
    const hintButton = screen.getByText(/checkHint \(3\)/)
    expect(hintButton).toBeDisabled()
  })
})