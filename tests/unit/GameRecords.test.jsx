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
        gameIncomplete: 'Game Incomplete',
        playerWonInRounds: `Player won in ${options?.rounds || 0} rounds`,
        computerWonInRounds: `Computer won in ${options?.rounds || 0} rounds`
      }
      return translations[key] || key
    }
  })
}))

describe('gameRecords', () => {
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
      gameIncomplete: 'Game Incomplete',
      playerWonInRounds: `Player won in ${options?.rounds || 0} rounds`,
      computerWonInRounds: `Computer won in ${options?.rounds || 0} rounds`
    }
    return translations[key] || key
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('empty records state', () => {
    it('應該顯示空記錄訊息', () => {
      render(<GameRecords gameRecords={[]} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.getByText('Game Records')).toBeInTheDocument()
      expect(screen.getByText('No game records yet')).toBeInTheDocument()
    })

    it('應該不顯示清除按鈕當沒有記錄時', () => {
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

    it('應該顯示所有翻譯後的標籤', () => {
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.getByText('Game Records')).toBeInTheDocument()
      expect(screen.getByText('Clear All Records')).toBeInTheDocument()
      expect(screen.getAllByText('Total Rounds:')).toHaveLength(3)
      expect(screen.getAllByText('Player Attempts:')).toHaveLength(3)
      expect(screen.getAllByText('Computer Attempts:')).toHaveLength(3)
    })

    it('應該顯示正確的勝利者標籤', () => {
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.getByText('Player Won')).toBeInTheDocument()
      expect(screen.getByText('Computer Won')).toBeInTheDocument()
      expect(screen.getByText('Game Incomplete')).toBeInTheDocument()
    })

    it('應該顯示正確的勝利描述', () => {
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      expect(screen.getByText('Player won in 3 rounds')).toBeInTheDocument()
      expect(screen.getByText('Computer won in 4 rounds')).toBeInTheDocument()
    })

    it('應該顯示正確的統計數據', () => {
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      // Check that values are displayed - some numbers appear multiple times so we check length
      expect(screen.getAllByText('5')).toHaveLength(2) // totalRounds for first record and playerAttempts for second record
      expect(screen.getAllByText('3')).toHaveLength(2) // playerAttempts for first record and totalRounds for third record
      expect(screen.getAllByText('2')).toHaveLength(2) // computerAttempts for first record and playerAttempts for third record
      expect(screen.getByText('9')).toBeInTheDocument() // totalRounds for second record (unique)
      expect(screen.getByText('4')).toBeInTheDocument() // computerAttempts for second record (unique)
      expect(screen.getByText('1')).toBeInTheDocument() // computerAttempts for third record (unique)
    })

    it('清除按鈕點擊應該調用正確的函數', async () => {
      const user = userEvent.setup()
      render(<GameRecords gameRecords={sampleRecords} clearAllRecords={mockClearAllRecords} t={mockT} />)
      
      const clearButton = screen.getByText('Clear All Records')
      await user.click(clearButton)
      
      expect(mockClearAllRecords).toHaveBeenCalledTimes(1)
    })
  })

  describe('translation functionality', () => {
    it('應該調用所有必需的翻譯鍵', () => {
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

    it('應該處理電腦勝利的翻譯', () => {
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

    it('應該處理未完成遊戲的翻譯', () => {
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
    it('應該顯示格式化的日期', () => {
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
      expect(screen.getByText(/2023/)).toBeInTheDocument()
    })
  })
})