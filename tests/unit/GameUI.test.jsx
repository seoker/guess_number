import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameUI } from '../../src/components/GameUI'

// Mock hooks
const mockGameState = {
  gameStarted: false,
  gameWon: false,
  currentTurn: 'player',
  playerGuess: '',
  playerAttempts: 0,
  computerAttempts: 0,
  message: ''
}

const mockHistory = {
  player: [],
  computer: []
}

const mockComputerAI = {
  showFeedbackForm: false,
  currentGuess: '',
  playerFeedback: { A: '', B: '' }
}

const mockFeedbackCorrection = {
  isActive: false,
  showHistory: false
}

const mockProps = {
  gameState: mockGameState,
  history: mockHistory,
  computerAI: mockComputerAI,
  feedbackCorrection: mockFeedbackCorrection,
  startNewGame: vi.fn(),
  handlePlayerGuess: vi.fn(),
  handleFeedbackSubmit: vi.fn(),
  updatePlayerGuess: vi.fn(),
  updatePlayerFeedback: vi.fn(),
  getMessageType: vi.fn(() => 'info'),
  startFeedbackCorrection: vi.fn(),
  resetGame: vi.fn(),
  correctHistoryFeedback: vi.fn(),
  cancelFeedbackCorrection: vi.fn(),
  t: vi.fn((key) => key),
  currentLanguage: 'zh-TW',
  changeLanguage: vi.fn(),
  getSupportedLanguages: vi.fn(() => ['zh-TW', 'en'])
}

// eslint-disable-next-line vitest/prefer-lowercase-title
describe('GameUI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('game start screen', () => {
    it('should display start screen when game is not started', () => {
      render(<GameUI {...mockProps} />)
      
      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('startGame')).toBeInTheDocument()
      expect(screen.getByText(/description/)).toBeInTheDocument()
      expect(screen.getAllByText(/rules/)).toHaveLength(2) // 'rules' and 'rulesDetail' both match
    })

    it('should be able to start game', async () => {
      const user = userEvent.setup()
      render(<GameUI {...mockProps} />)
      
      const startButton = screen.getByText('startGame')
      await user.click(startButton)
      
      expect(mockProps.startNewGame).toHaveBeenCalledTimes(1)
    })
  })

  describe('game in progress screen', () => {
    const gameInProgressProps = {
      ...mockProps,
      gameState: {
        ...mockGameState,
        gameStarted: true,
        currentTurn: 'player'
      }
    }

    it('should display game in progress screen', () => {
      render(<GameUI {...gameInProgressProps} />)
      
      expect(screen.getByText(/playerAttempts/)).toBeInTheDocument()
      expect(screen.getByText(/computerAttempts/)).toBeInTheDocument()
      expect(screen.getByText(/currentTurn/)).toBeInTheDocument()
    })

    it('should display player input area', () => {
      render(<GameUI {...gameInProgressProps} />)
      
      const input = screen.getByPlaceholderText('guessPlaceholder')
      expect(input).toBeInTheDocument()
      expect(input).not.toBeDisabled()
    })

    it('should handle player input', async () => {
      const user = userEvent.setup()
      render(<GameUI {...gameInProgressProps} />)
      
      const input = screen.getByPlaceholderText('guessPlaceholder')
      await user.type(input, '1234')
      
      // Each character triggers updatePlayerGuess once, so check the last call
      expect(mockProps.updatePlayerGuess).toHaveBeenCalledTimes(4)
      expect(mockProps.updatePlayerGuess).toHaveBeenLastCalledWith('4')
    })

    it('should handle player guess submission', async () => {
      const user = userEvent.setup()
      const propsWithGuess = {
        ...gameInProgressProps,
        gameState: {
          ...gameInProgressProps.gameState,
          playerGuess: '1234'
        }
      }
      
      render(<GameUI {...propsWithGuess} />)
      
      const guessButton = screen.getByText('guess')
      await user.click(guessButton)
      
      expect(mockProps.handlePlayerGuess).toHaveBeenCalledTimes(1)
    })

    it('should disable guess button when input is incomplete', () => {
      render(<GameUI {...gameInProgressProps} />)
      
      const guessButton = screen.getByText('guess')
      expect(guessButton).toBeDisabled()
    })
  })

  describe('computer turn', () => {
    const computerTurnProps = {
      ...mockProps,
      gameState: {
        ...mockGameState,
        gameStarted: true,
        currentTurn: 'computer'
      },
      computerAI: {
        ...mockComputerAI,
        showFeedbackForm: true,
        currentGuess: '5678'
      }
    }

    it('should display computer guess and feedback form', () => {
      render(<GameUI {...computerTurnProps} />)
      
      expect(screen.getByText(/computerGuess5678/)).toBeInTheDocument()
      expect(screen.getByText('feedbackHint')).toBeInTheDocument()
    })

    it('should display A and B feedback selection in "0A0B" format', () => {
      render(<GameUI {...computerTurnProps} />)
      
      // Check the feedback display shows the format "0A0B"
      expect(screen.getByText('A')).toBeInTheDocument() // Static A label
      expect(screen.getByText('B')).toBeInTheDocument() // Static B label
      
      // Check clickable number buttons (default 0)
      const numberButtons = screen.getAllByRole('button').filter(button => 
        button.textContent === '0' && button.className.includes('clickable')
      )
      expect(numberButtons).toHaveLength(2) // A and B value buttons
      
      // Check that static letters are not clickable
      const staticA = screen.getByText('A')
      const staticB = screen.getByText('B')
      expect(staticA.className).toContain('static')
      expect(staticB.className).toContain('static')
    })

    it('should handle feedback submission', async () => {
      const user = userEvent.setup()
      const propsWithFeedback = {
        ...computerTurnProps,
        computerAI: {
          ...computerTurnProps.computerAI,
          playerFeedback: { A: '2', B: '1' }
        }
      }
      
      render(<GameUI {...propsWithFeedback} />)
      
      const submitButton = screen.getByText('submitFeedback')
      await user.click(submitButton)
      
      expect(mockProps.handleFeedbackSubmit).toHaveBeenCalledTimes(1)
    })
  })

  describe('game history', () => {
    const propsWithHistory = {
      ...mockProps,
      gameState: {
        ...mockGameState,
        gameStarted: true
      },
      history: {
        player: [
          { guess: '1234', result: '2A2B', isCorrect: false },
          { guess: '5678', result: '0A0B', isCorrect: false }
        ],
        computer: [
          { guess: '5678', result: '1A1B', isCorrect: false }
        ]
      }
    }

    it('should display player history', () => {
      render(<GameUI {...propsWithHistory} />)
      
      expect(screen.getByText('playerHistory')).toBeInTheDocument()
      expect(screen.getAllByText('1234')).toHaveLength(1)
      expect(screen.getAllByText('5678')).toHaveLength(2) // appears in both player and computer history
      expect(screen.getByText('2A2B')).toBeInTheDocument()
      expect(screen.getByText('0A0B')).toBeInTheDocument()
    })

    it('should display computer history', () => {
      render(<GameUI {...propsWithHistory} />)
      
      expect(screen.getByText('computerHistory')).toBeInTheDocument()
      expect(screen.getByText('1A1B')).toBeInTheDocument()
    })
  })

  describe('game over', () => {
    const gameWonProps = {
      ...mockProps,
      gameState: {
        ...mockGameState,
        gameStarted: true,
        gameWon: true
      }
    }

    it('should display game over screen', () => {
      render(<GameUI {...gameWonProps} />)
      
      expect(screen.getByText('gameOver')).toBeInTheDocument()
      expect(screen.getByText('playAgain')).toBeInTheDocument()
    })

    it('should be able to restart game', async () => {
      const user = userEvent.setup()
      render(<GameUI {...gameWonProps} />)
      
      const playAgainButton = screen.getByText('playAgain')
      await user.click(playAgainButton)
      
      expect(mockProps.startNewGame).toHaveBeenCalledTimes(1)
    })
  })

  describe('language switching', () => {
    it('should receive language-related props', () => {
      render(<GameUI {...mockProps} />)
      
      // GameUI component itself doesn't contain language selector, but receives t function for translation
      expect(screen.getByText('title')).toBeInTheDocument()
    })
  })

  describe('feedback correction functionality', () => {
    it('should show correction buttons when complaint message appears', () => {
      const propsWithComplaint = {
        ...mockProps,
        gameState: { ...mockGameState, gameStarted: true, message: 'This is unreasonable!' },
        feedbackCorrection: { isActive: true, showHistory: false },
        getMessageType: vi.fn(() => 'complaint')
      }
      
      render(<GameUI {...propsWithComplaint} />)
      
      expect(screen.getByText('fixFeedback')).toBeInTheDocument()
      expect(screen.getByText('resetGame')).toBeInTheDocument()
    })

    it('should show correction panel after clicking correction button', () => {
      const propsWithCorrection = {
        ...mockProps,
        gameState: { ...mockGameState, gameStarted: true },
        feedbackCorrection: { isActive: true, showHistory: true },
        history: {
          ...mockHistory,
          computer: [
            { guess: '1234', result: '1A2B', isCorrect: false },
            { guess: '5678', result: '0A1B', isCorrect: false }
          ]
        }
      }
      
      render(<GameUI {...propsWithCorrection} />)
      
      expect(screen.getByText('correctFeedback')).toBeInTheDocument()
      expect(screen.getByText('selectCorrection')).toBeInTheDocument()
      // Check for the correction panel specifically
      expect(screen.getByRole('heading', { level: 3, name: 'correctFeedback' })).toBeInTheDocument()
      // Numbers appear in both regular history and correction panel, which is expected
      expect(screen.getAllByText('1234')).toHaveLength(2) // One in regular history, one in correction panel
      expect(screen.getAllByText('5678')).toHaveLength(2)
    })

    it('correction button clicks should call correct functions', async () => {
      const user = userEvent.setup()
      const propsWithComplaint = {
        ...mockProps,
        gameState: { ...mockGameState, gameStarted: true, message: 'This is unreasonable!' },
        feedbackCorrection: { isActive: true, showHistory: false },
        getMessageType: vi.fn(() => 'complaint')
      }
      
      render(<GameUI {...propsWithComplaint} />)
      
      const fixButton = screen.getByText('fixFeedback')
      const resetButton = screen.getByText('resetGame')
      
      await user.click(fixButton)
      expect(mockProps.startFeedbackCorrection).toHaveBeenCalledTimes(1)
      
      await user.click(resetButton)
      expect(mockProps.resetGame).toHaveBeenCalledTimes(1)
    })
  })
})
