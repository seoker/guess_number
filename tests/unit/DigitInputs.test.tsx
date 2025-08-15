import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DigitInputs } from '../../src/components/DigitInputs'

vi.mock('../../src/hooks/useDigitInput', () => ({
  useDigitInput: vi.fn(() => ({
    handleDigitChange: vi.fn(),
    handleDigitKeyDown: vi.fn()
  }))
}))

describe('DigitInputs', () => {
  let mockUpdatePlayerGuess: ReturnType<typeof vi.fn>
  let mockHandlePlayerGuess: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockUpdatePlayerGuess = vi.fn()
    mockHandlePlayerGuess = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render 4 digit inputs', () => {
    render(
      <DigitInputs
        playerGuess=""
        updatePlayerGuess={mockUpdatePlayerGuess}
        handlePlayerGuess={mockHandlePlayerGuess}
        disabled={false}
      />
    )

    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(4)

    inputs.forEach((input, index) => {
      expect(input).toHaveAttribute('id', `digit-${index}`)
      expect(input).toHaveAttribute('maxLength', '1')
      expect(input).toHaveAttribute('placeholder', '?')
      expect(input).toHaveClass('digit-input')
    })
  })

  it('should display current guess values', () => {
    render(
      <DigitInputs
        playerGuess="1 3 "
        updatePlayerGuess={mockUpdatePlayerGuess}
        handlePlayerGuess={mockHandlePlayerGuess}
        disabled={false}
      />
    )

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs[0].value).toBe('1')
    expect(inputs[1].value).toBe('')
    expect(inputs[2].value).toBe('3')
    expect(inputs[3].value).toBe('')
  })

  it('should handle spaces in player guess', () => {
    render(
      <DigitInputs
        playerGuess="1   "
        updatePlayerGuess={mockUpdatePlayerGuess}
        handlePlayerGuess={mockHandlePlayerGuess}
        disabled={false}
      />
    )

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs[0].value).toBe('1')
    expect(inputs[1].value).toBe('')
    expect(inputs[2].value).toBe('')
    expect(inputs[3].value).toBe('')
  })

  it('should disable inputs when disabled prop is true', () => {
    render(
      <DigitInputs
        playerGuess=""
        updatePlayerGuess={mockUpdatePlayerGuess}
        handlePlayerGuess={mockHandlePlayerGuess}
        disabled={true}
      />
    )

    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toBeDisabled()
    })
  })

  it('should have proper input attributes for numeric input', () => {
    render(
      <DigitInputs
        playerGuess=""
        updatePlayerGuess={mockUpdatePlayerGuess}
        handlePlayerGuess={mockHandlePlayerGuess}
        disabled={false}
      />
    )

    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toHaveAttribute('type', 'text')
      expect(input).toHaveAttribute('inputMode', 'numeric')
      expect(input).toHaveAttribute('pattern', '[0-9]')
    })
  })

  it('should have digit-inputs container class', () => {
    render(
      <DigitInputs
        playerGuess=""
        updatePlayerGuess={mockUpdatePlayerGuess}
        handlePlayerGuess={mockHandlePlayerGuess}
        disabled={false}
      />
    )

    expect(document.querySelector('.digit-inputs')).toBeInTheDocument()
  })
})