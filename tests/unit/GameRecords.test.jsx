import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameRecords } from '../../src/components/GameRecords'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      // Mock translations for testing
      const translations = {
        gameRecords: 'Game Records',
        noRecordsYet: 'No game records yet',
        clearAllRecords: 'Clear All Records',
        totalRounds: 'Total Rounds',
        playerAttempts: 'Player Attempts',
        computerAttempts: 'Computer Attempts',
        playerWonShort: 'Player Won',
        computerWonShort: 'Computer Won',
        drawShort: 'Draw',
        gameIncomplete: 'Game Incomplete',
        playerWonInRounds: `Player won in ${options?.rounds || 0} rounds`,
        computerWonInRounds: `Computer won in ${options?.rounds || 0} rounds`,
        drawInRounds: `Draw in ${options?.rounds || 0} rounds`
      }
      return translations[key] || key
    }
  })
}))

// eslint-disable-next-line vitest/prefer-lowercase-title
describe('GameRecords', () => {
  const mockClearAllRecords = vi.fn()
  const mockT = vi.fn((key, options) => {
    const translations = {
      gameRecords: 'Game Records',
      noRecordsYet: 'No game records yet',
      clearAllRecords: 'Clear All Records',
      totalRounds: 'Total Rounds',
      playerAttempts: 'Player Attempts',
      computerAttempts: 'Computer Attempts',
      playerWonShort: 'Player Won',
      computerWonShort: 'Computer Won',
      drawShort: 'Draw',
      gameIncomplete: 'Game Incomplete',
      playerWonInRounds: `Player won in ${options?.rounds || 0} rounds`,
      computerWonInRounds: `Computer won in ${options?.rounds || 0} rounds`,
      drawInRounds: `Draw in ${options?.rounds || 0} rounds`
    }
    return translations[key] || key
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('empty records state', () => {
    it('should display empty records message', () => {
      render(<GameRecords gameRecords={[]} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.getByText('Game Records')).toBeInTheDocument()
      expect(screen.getByText('No game records yet')).toBeInTheDocument()
    })

    it('should not display clear button when no records', () => {
      render(<GameRecords gameRecords={[]} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.queryByText('Clear All Records')).not.toBeInTheDocument()
    })
  })

  describe('with records state', () => {
    const sampleRecords = [
      {
        id: '1',
        timestamp: 1700000000000,
        winner: 'player',
        playerAttempts: 3,
        computerAttempts: 2,
        totalRounds: 5
      },
      {
        id: '2',
        timestamp: 1700000001000,
        winner: 'computer',
        playerAttempts: 5,
        computerAttempts: 4,
        totalRounds: 9
      },
      {
        id: '3',
        timestamp: 1700000002000,
        winner: null,
        playerAttempts: 2,
        computerAttempts: 1,
        totalRounds: 3
      }
    ]

    it('should display all translated labels', () => {
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.getByText('Game Records')).toBeInTheDocument()
      expect(screen.getByText('Clear All Records')).toBeInTheDocument()
      expect(screen.getAllByText('Total Rounds:')).toHaveLength(3)
      expect(screen.getAllByText('Player Attempts:')).toHaveLength(3)
      expect(screen.getAllByText('Computer Attempts:')).toHaveLength(3)
    })

    it('should display correct winner labels', () => {
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.getByText('Player Won')).toBeInTheDocument()
      expect(screen.getByText('Computer Won')).toBeInTheDocument()
      expect(screen.getByText('Game Incomplete')).toBeInTheDocument()
    })

    it('should display correct winner descriptions', () => {
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.getByText('Player won in 3 rounds')).toBeInTheDocument()
      expect(screen.getByText('Computer won in 4 rounds')).toBeInTheDocument()
    })

    it('should display correct statistical data', () => {
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      // Check that values are displayed - some numbers appear multiple times so we check length
      expect(screen.getAllByText('5')).toHaveLength(2) // totalRounds for first record and playerAttempts for second record
      expect(screen.getAllByText('3')).toHaveLength(2) // playerAttempts for first record and totalRounds for third record
      expect(screen.getAllByText('2')).toHaveLength(2) // computerAttempts for first record and playerAttempts for third record
      expect(screen.getByText('9')).toBeInTheDocument() // totalRounds for second record (unique)
      expect(screen.getByText('4')).toBeInTheDocument() // computerAttempts for second record (unique)
      expect(screen.getByText('1')).toBeInTheDocument() // computerAttempts for third record (unique)
    })

    it('clear button click should call correct function', async () => {
      const user = userEvent.setup()
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      const clearButton = screen.getByText('Clear All Records')
      await user.click(clearButton)
      
      expect(mockClearAllRecords).toHaveBeenCalledTimes(1)
    })
  })

  describe('translation functionality', () => {
    it('should call all required translation keys', () => {
      const sampleRecord = [{
        id: '1',
        timestamp: 1700000000000,
        winner: 'player',
        playerAttempts: 3,
        computerAttempts: 2,
        totalRounds: 5
      }]

      render(<GameRecords gameRecords={sampleRecord} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      // Verify that all translation keys are called
      expect(mockT).toHaveBeenCalledWith('gameRecords')
      expect(mockT).toHaveBeenCalledWith('clearAllRecords')
      expect(mockT).toHaveBeenCalledWith('totalRounds')
      expect(mockT).toHaveBeenCalledWith('playerAttempts')
      expect(mockT).toHaveBeenCalledWith('computerAttempts')
      expect(mockT).toHaveBeenCalledWith('playerWonShort')
      expect(mockT).toHaveBeenCalledWith('playerWonInRounds', { rounds: 3 })
    })

    it('should handle computer victory translation', () => {
      const computerWonRecord = [{
        id: '1',
        timestamp: 1700000000000,
        winner: 'computer',
        playerAttempts: 5,
        computerAttempts: 3,
        totalRounds: 8
      }]

      render(<GameRecords gameRecords={computerWonRecord} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(mockT).toHaveBeenCalledWith('computerWonShort')
      expect(mockT).toHaveBeenCalledWith('computerWonInRounds', { rounds: 3 })
    })

    it('should handle incomplete game translation', () => {
      const incompleteRecord = [{
        id: '1',
        timestamp: 1700000000000,
        winner: null,
        playerAttempts: 2,
        computerAttempts: 1,
        totalRounds: 3
      }]

      render(<GameRecords gameRecords={incompleteRecord} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(mockT).toHaveBeenCalledWith('gameIncomplete')
    })
  })

  describe('date formatting', () => {
    it('should display formatted date', () => {
      const recordWithDate = [{
        id: '1',
        timestamp: 1700000000000, // Nov 14, 2023
        winner: 'player',
        playerAttempts: 3,
        computerAttempts: 2,
        totalRounds: 5
      }]

      render(<GameRecords gameRecords={recordWithDate} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      // The exact date format depends on locale, but it should contain the date
      // There are multiple elements with 2023 (desktop and mobile views)
      expect(screen.getAllByText(/2023/)).toHaveLength(2)
    })
  })
})
