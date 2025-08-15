import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useDigitInput } from '../../src/hooks/useDigitInput'

describe('useDigitInput', () => {
  let mockUpdateGuess: ReturnType<typeof vi.fn>
  let mockOnSubmit: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockUpdateGuess = vi.fn()
    mockOnSubmit = vi.fn()
    
    document.body.innerHTML = `
      <input id="digit-0" />
      <input id="digit-1" />
      <input id="digit-2" />
      <input id="digit-3" />
    `
  })

  afterEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('should handle digit change for empty guess', () => {
    const { result } = renderHook(() =>
      useDigitInput('', mockUpdateGuess, mockOnSubmit)
    )

    act(() => {
      result.current.handleDigitChange(0, '5')
    })

    expect(mockUpdateGuess).toHaveBeenCalledWith('5')
  })

  it('should handle digit change for existing guess', () => {
    const { result } = renderHook(() =>
      useDigitInput('1 3 ', mockUpdateGuess, mockOnSubmit)
    )

    act(() => {
      result.current.handleDigitChange(1, '2')
    })

    expect(mockUpdateGuess).toHaveBeenCalledWith('123')
  })

  it('should only allow numeric input', () => {
    const { result } = renderHook(() =>
      useDigitInput('', mockUpdateGuess, mockOnSubmit)
    )

    act(() => {
      result.current.handleDigitChange(0, 'abc5def')
    })

    expect(mockUpdateGuess).toHaveBeenCalledWith('5')
  })

  it('should auto-focus next input after digit entry', () => {
    const nextInput = document.getElementById('digit-1') as HTMLInputElement
    const focusSpy = vi.spyOn(nextInput, 'focus')

    const { result } = renderHook(() =>
      useDigitInput('', mockUpdateGuess, mockOnSubmit)
    )

    act(() => {
      result.current.handleDigitChange(0, '5')
    })

    expect(focusSpy).toHaveBeenCalled()
  })

  it('should not auto-focus on last digit', () => {
    const { result } = renderHook(() =>
      useDigitInput('', mockUpdateGuess, mockOnSubmit)
    )

    act(() => {
      result.current.handleDigitChange(3, '5')
    })

    expect(mockUpdateGuess).toHaveBeenCalledWith('   5')
  })

  describe('handleDigitKeyDown', () => {
    it('should handle Enter key to submit', () => {
      const { result } = renderHook(() =>
        useDigitInput('1234', mockUpdateGuess, mockOnSubmit)
      )

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>

      act(() => {
        result.current.handleDigitKeyDown(2, mockEvent)
      })

      expect(mockOnSubmit).toHaveBeenCalled()
    })

    it('should handle Backspace to clear current digit', () => {
      const { result } = renderHook(() =>
        useDigitInput('1234', mockUpdateGuess, mockOnSubmit)
      )

      const mockEvent = {
        key: 'Backspace',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>

      act(() => {
        result.current.handleDigitKeyDown(2, mockEvent)
      })

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockUpdateGuess).toHaveBeenCalledWith('12 4')
    })

    it('should handle Backspace to move to previous input when current is empty', () => {
      const prevInput = document.getElementById('digit-1') as HTMLInputElement
      const focusSpy = vi.spyOn(prevInput, 'focus')

      const { result } = renderHook(() =>
        useDigitInput('1   ', mockUpdateGuess, mockOnSubmit)
      )

      const mockEvent = {
        key: 'Backspace',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>

      act(() => {
        result.current.handleDigitKeyDown(2, mockEvent)
      })

      expect(focusSpy).toHaveBeenCalled()
      expect(mockUpdateGuess).toHaveBeenCalledWith('1')
    })

    it('should handle ArrowLeft navigation', () => {
      const prevInput = document.getElementById('digit-1') as HTMLInputElement
      const focusSpy = vi.spyOn(prevInput, 'focus')

      const { result } = renderHook(() =>
        useDigitInput('1234', mockUpdateGuess, mockOnSubmit)
      )

      const mockEvent = {
        key: 'ArrowLeft',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>

      act(() => {
        result.current.handleDigitKeyDown(2, mockEvent)
      })

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should handle ArrowRight navigation', () => {
      const nextInput = document.getElementById('digit-3') as HTMLInputElement
      const focusSpy = vi.spyOn(nextInput, 'focus')

      const { result } = renderHook(() =>
        useDigitInput('1234', mockUpdateGuess, mockOnSubmit)
      )

      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>

      act(() => {
        result.current.handleDigitKeyDown(2, mockEvent)
      })

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should not navigate beyond boundaries', () => {
      const { result } = renderHook(() =>
        useDigitInput('1234', mockUpdateGuess, mockOnSubmit)
      )

      const mockEvent = {
        key: 'ArrowLeft',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>

      act(() => {
        result.current.handleDigitKeyDown(0, mockEvent)
      })

      expect(mockUpdateGuess).not.toHaveBeenCalled()
    })
  })
})