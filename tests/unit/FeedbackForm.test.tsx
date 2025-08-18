import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { FeedbackForm } from '../../src/components/FeedbackForm'

describe('FeedbackForm', () => {
  const mockOnFeedbackClick = vi.fn()
  const mockOnSubmit = vi.fn()
  const mockT = vi.fn((key: string) => key)

  const defaultProps = {
    computerGuess: '1234',
    playerFeedback: { A: 1, B: 2 },
    onFeedbackClick: mockOnFeedbackClick,
    onSubmit: mockOnSubmit,
    t: mockT
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render computer guess and feedback hint', () => {
    render(<FeedbackForm {...defaultProps} />)

    expect(mockT).toHaveBeenCalledWith('computerGuess')
    expect(mockT).toHaveBeenCalledWith('feedbackHint')
    expect(screen.getByText(/computerGuess1234/)).toBeInTheDocument()
  })

  it('should display current feedback values', () => {
    render(<FeedbackForm {...defaultProps} />)

    const aValueElement = screen.getByText('1')
    const bValueElement = screen.getByText('2')

    expect(aValueElement).toBeInTheDocument()
    expect(bValueElement).toBeInTheDocument()
  })

  it('should handle A feedback clicks', async () => {
    const user = userEvent.setup()
    render(<FeedbackForm {...defaultProps} />)

    const buttons = screen.getAllByRole('button')
    const aIncreaseButton = buttons.find(btn => btn.textContent === '▲')
    await user.click(aIncreaseButton!)

    expect(mockOnFeedbackClick).toHaveBeenCalledWith('A', 2)
  })

  it('should handle B feedback clicks', async () => {
    const user = userEvent.setup()
    render(<FeedbackForm {...defaultProps} />)

    const buttons = screen.getAllByRole('button')
    const bIncreaseButtons = buttons.filter(btn => btn.textContent === '▲')
    const bIncreaseButton = bIncreaseButtons[1] // Second ▲ button is for B
    await user.click(bIncreaseButton!)

    expect(mockOnFeedbackClick).toHaveBeenCalledWith('B', 3)
  })

  it('should cycle feedback values from 4 to 0', async () => {
    const user = userEvent.setup()
    const props = {
      ...defaultProps,
      playerFeedback: { A: 4, B: 4 }
    }
    render(<FeedbackForm {...props} />)

    const buttons = screen.getAllByRole('button')
    const aIncreaseButton = buttons.find(btn => btn.textContent === '▲')
    await user.click(aIncreaseButton!)

    expect(mockOnFeedbackClick).toHaveBeenCalledWith('A', 0)
  })

  it('should handle submit button click', async () => {
    const user = userEvent.setup()
    render(<FeedbackForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submitFeedback' })
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it('should render with proper CSS classes', () => {
    render(<FeedbackForm {...defaultProps} />)

    expect(document.querySelector('.feedback-section')).toBeInTheDocument()
    expect(document.querySelector('.feedback-hint')).toBeInTheDocument()
    expect(document.querySelector('.feedback-form')).toBeInTheDocument()
    expect(document.querySelector('.feedback-display')).toBeInTheDocument()
  })

  it('should handle zero values in feedback', () => {
    const props = {
      ...defaultProps,
      playerFeedback: { A: 0, B: 0 }
    }
    render(<FeedbackForm {...props} />)

    const zeroValueElements = screen.getAllByText('0')
    
    expect(zeroValueElements).toHaveLength(2) // Both A and B show 0
  })
})