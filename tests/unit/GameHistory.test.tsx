import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { GameHistory } from '../../src/components/GameHistory'
import { GameRecord } from '../../src/types'

describe('GameHistory', () => {
  const mockT = vi.fn((key: string) => key)

  const playerHistory: GameRecord[] = [
    { guess: '1234', result: '2A1B', isCorrect: false },
    { guess: '5678', result: '4A0B', isCorrect: true }
  ]

  const computerHistory: GameRecord[] = [
    { guess: '9876', result: '1A2B', isCorrect: false }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render player and computer history sections', () => {
    render(
      <GameHistory
        playerHistory={playerHistory}
        computerHistory={computerHistory}
        t={mockT}
      />
    )

    expect(mockT).toHaveBeenCalledWith('playerHistory')
    expect(mockT).toHaveBeenCalledWith('computerHistory')
    expect(document.querySelector('.history-container')).toBeInTheDocument()
    expect(document.querySelectorAll('.history-section')).toHaveLength(2)
  })

  it('should render player history records', () => {
    render(
      <GameHistory
        playerHistory={playerHistory}
        computerHistory={[]}
        t={mockT}
      />
    )

    expect(screen.getByText('1234')).toBeInTheDocument()
    expect(screen.getByText('2A1B')).toBeInTheDocument()
    expect(screen.getByText('5678')).toBeInTheDocument()
    expect(screen.getByText('4A0B')).toBeInTheDocument()

    const ordinals = screen.getAllByText(/^[12]$/)
    expect(ordinals).toHaveLength(2)
    expect(ordinals[0]).toHaveTextContent('1')
    expect(ordinals[1]).toHaveTextContent('2')
  })

  it('should render computer history records', () => {
    render(
      <GameHistory
        playerHistory={[]}
        computerHistory={computerHistory}
        t={mockT}
      />
    )

    expect(screen.getByText('9876')).toBeInTheDocument()
    expect(screen.getByText('1A2B')).toBeInTheDocument()

    const ordinal = screen.getByText('1')
    expect(ordinal).toBeInTheDocument()
  })

  it('should apply correct CSS classes for correct answers', () => {
    render(
      <GameHistory
        playerHistory={playerHistory}
        computerHistory={[]}
        t={mockT}
      />
    )

    const historyItems = document.querySelectorAll('.history-item')
    expect(historyItems[0]).not.toHaveClass('correct')
    expect(historyItems[1]).toHaveClass('correct')
  })

  it('should render empty histories', () => {
    render(
      <GameHistory
        playerHistory={[]}
        computerHistory={[]}
        t={mockT}
      />
    )

    const historyLists = document.querySelectorAll('.history-list')
    expect(historyLists).toHaveLength(2)
    expect(historyLists[0].children).toHaveLength(0)
    expect(historyLists[1].children).toHaveLength(0)
  })

  it('should have proper structure for history items', () => {
    render(
      <GameHistory
        playerHistory={playerHistory}
        computerHistory={[]}
        t={mockT}
      />
    )

    const historyItems = document.querySelectorAll('.history-item')
    historyItems.forEach(item => {
      expect(item).toHaveClass('item-base')
      expect(item.querySelector('.ordinal-base')).toBeInTheDocument()
      expect(item.querySelector('.history-ordinal')).toBeInTheDocument()
      expect(item.querySelector('.content-base')).toBeInTheDocument()
      expect(item.querySelector('.history-content')).toBeInTheDocument()
      expect(item.querySelector('.history-guess')).toBeInTheDocument()
      expect(item.querySelector('.history-result')).toBeInTheDocument()
    })
  })
})