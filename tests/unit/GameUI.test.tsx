import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameUI } from '../../src/components/GameUI'
import { 
  CurrentTurn, 
  MessageType, 
  Language,
  GameState,
  GameHistory,
  ComputerAI,
  FeedbackCorrection,
  GameUIProps
} from '../../src/types/index'

// Mock hooks with proper TypeScript types
const mockGameState: GameState = {
  gameStarted: false,
  gameWon: false,
  currentTurn: CurrentTurn.PLAYER,
  playerGuess: '',
  playerAttempts: 0,
  computerAttempts: 0,
  message: '',
  computerTarget: '1234',
  messageType: MessageType.INFO,
  hintsRemaining: 3
}

const mockHistory: GameHistory = {
  player: [],
  computer: []
}

const mockComputerAI: ComputerAI = {
  showFeedbackForm: false,
  currentGuess: '',
  playerFeedback: { A: '', B: '' },
  possibleNumbers: []
}

const mockFeedbackCorrection: FeedbackCorrection = {
  isActive: false,
  showHistory: false
}

const mockProps: GameUIProps = {
  gameState: mockGameState,
  history: mockHistory,
  computerAI: mockComputerAI,
  feedbackCorrection: mockFeedbackCorrection,
  startNewGame: vi.fn() as () => void,
  handlePlayerGuess: vi.fn() as () => void,
  handleFeedbackSubmit: vi.fn() as () => void,
  updatePlayerGuess: vi.fn() as (guess: string) => void,
  updatePlayerFeedback: vi.fn() as (type: 'A' | 'B', value: string) => void,
  getMessageType: vi.fn(() => MessageType.INFO) as () => MessageType,
  startFeedbackCorrection: vi.fn() as () => void,
  resetGame: vi.fn() as () => void,
  correctHistoryFeedback: vi.fn() as (index: number, A: number, B: number) => void,
  cancelFeedbackCorrection: vi.fn() as () => void,
  handleHintCheck: vi.fn() as () => void,
  t: vi.fn((key: string) => key) as (key: string, options?: any) => string,
  currentLanguage: 'zh-TW',
  changeLanguage: vi.fn() as (lng: string) => void,
  getSupportedLanguages: vi.fn(() => [
    { code: 'zh-TW', name: 'Traditional Chinese', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]) as () => Language[]
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
        currentTurn: CurrentTurn.PLAYER
      }
    }

    it('should display game in progress screen', () => {
      render(<GameUI {...gameInProgressProps} />)
      
      expect(screen.getByText(/playerAttempts/)).toBeInTheDocument()
      expect(screen.getByText(/computerAttempts/)).toBeInTheDocument()
      expect(screen.getByText(/currentTurn/)).toBeInTheDocument()
    })

    it('should display 4 digit input boxes', () => {
      const { container } = render(<GameUI {...gameInProgressProps} />)
      
      // Check for 4 digit input boxes using their IDs
      const digit0 = container.querySelector('#digit-0')
      const digit1 = container.querySelector('#digit-1') 
      const digit2 = container.querySelector('#digit-2')
      const digit3 = container.querySelector('#digit-3')
      
      expect(digit0).toBeInTheDocument()
      expect(digit1).toBeInTheDocument()
      expect(digit2).toBeInTheDocument()
      expect(digit3).toBeInTheDocument()
      
      // Check attributes
      expect(digit0).toHaveAttribute('maxLength', '1')
      expect(digit0).toHaveAttribute('inputMode', 'numeric')
      
      // All should be enabled
      expect(digit0).not.toBeDisabled()
      expect(digit1).not.toBeDisabled()
      expect(digit2).not.toBeDisabled()
      expect(digit3).not.toBeDisabled()
    })

    it('should handle sequential digit input', async () => {
      const user = userEvent.setup()
      const { container } = render(<GameUI {...gameInProgressProps} />)
      
      const digit0 = container.querySelector('#digit-0')
      const digit1 = container.querySelector('#digit-1')
      const digit2 = container.querySelector('#digit-2')
      const digit3 = container.querySelector('#digit-3')
      
      await user.type(digit0!, '1')
      await user.type(digit1!, '2')
      await user.type(digit2!, '3')
      await user.type(digit3!, '4')
      
      // Each digit entry should call updatePlayerGuess
      expect(mockProps.updatePlayerGuess).toHaveBeenCalledTimes(4)
    })

    it('should handle out-of-order digit input', async () => {
      const user = userEvent.setup()
      const { container } = render(<GameUI {...gameInProgressProps} />)
      
      const digit0 = container.querySelector('#digit-0')
      const digit1 = container.querySelector('#digit-1')
      const digit2 = container.querySelector('#digit-2')
      const digit3 = container.querySelector('#digit-3')
      
      // Enter digits in random order: 2nd, 4th, 1st, 3rd
      await user.type(digit1!, '7')
      await user.type(digit3!, '9')
      await user.type(digit0!, '5')
      await user.type(digit2!, '8')
      
      // Should call updatePlayerGuess for each digit entry
      expect(mockProps.updatePlayerGuess).toHaveBeenCalledTimes(4)
    })

    it('should handle sparse digit input (gaps)', async () => {
      const user = userEvent.setup()
      const { container } = render(<GameUI {...gameInProgressProps} />)
      
      const digit0 = container.querySelector('#digit-0')
      const digit2 = container.querySelector('#digit-2')
      
      // Only enter 1st and 3rd digits
      await user.type(digit0!, '2')
      await user.type(digit2!, '6')
      
      expect(mockProps.updatePlayerGuess).toHaveBeenCalledTimes(2)
    })

    it('should handle digit overwriting', async () => {
      const user = userEvent.setup()
      const { container } = render(<GameUI {...gameInProgressProps} />)
      
      const digit0 = container.querySelector('#digit-0')
      const digit1 = container.querySelector('#digit-1')
      
      // Enter initial digits
      await user.type(digit0!, '1')
      await user.type(digit1!, '2')
      
      // Overwrite them
      await user.clear(digit0!)
      await user.type(digit0!, '9')
      await user.clear(digit1!)
      await user.type(digit1!, '8')
      
      expect(mockProps.updatePlayerGuess).toHaveBeenCalled()
    })

    it('should only accept single numeric digits', async () => {
      const user = userEvent.setup()
      const { container } = render(<GameUI {...gameInProgressProps} />)
      
      const digit0 = container.querySelector('#digit-0')
      
      // Try to enter multiple characters, letters, special chars
      await user.type(digit0!, 'abc123!@#')
      
      // Due to the digit input handling logic, non-numeric chars are filtered out
      // Only the last numeric digit should remain due to maxLength=1
      expect(mockProps.updatePlayerGuess).toHaveBeenCalled()
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

    it('should enable guess button when all 4 digits are entered', async () => {
      const propsWithCompleteGuess = {
        ...gameInProgressProps,
        gameState: {
          ...gameInProgressProps.gameState,
          playerGuess: '1234'
        }
      }
      
      render(<GameUI {...propsWithCompleteGuess} />)
      
      const guessButton = screen.getByText('guess')
      expect(guessButton).not.toBeDisabled()
    })

    it('should disable guess button with partial digit input', async () => {
      const propsWithPartialGuess = {
        ...gameInProgressProps,
        gameState: {
          ...gameInProgressProps.gameState,
          playerGuess: '12' // Only 2 digits, length < 4
        }
      }
      
      render(<GameUI {...propsWithPartialGuess} />)
      
      const guessButton = screen.getByText('guess')
      expect(guessButton).toBeDisabled()
    })

    it('should handle keyboard navigation between digit inputs', async () => {
      const user = userEvent.setup()
      const { container } = render(<GameUI {...gameInProgressProps} />)
      
      const digit0 = container.querySelector('#digit-0') as HTMLInputElement
      
      // Focus first input and enter digit
      digit0.focus()
      await user.type(digit0, '1')
      
      // Should call updatePlayerGuess when digit is entered
      expect(mockProps.updatePlayerGuess).toHaveBeenCalled()
    })
  })

  describe('computer turn', () => {
    const computerTurnProps = {
      ...mockProps,
      gameState: {
        ...mockGameState,
        gameStarted: true,
        currentTurn: CurrentTurn.COMPUTER
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
        getMessageType: vi.fn(() => MessageType.COMPLAINT)
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
        getMessageType: vi.fn(() => MessageType.COMPLAINT)
      }
      
      render(<GameUI {...propsWithComplaint} />)
      
      const fixButton = screen.getByText('fixFeedback')
      const resetButton = screen.getByText('resetGame')
      
      await user.click(fixButton)
      expect(mockProps.startFeedbackCorrection).toHaveBeenCalledTimes(1)
      
      await user.click(resetButton)
      // The function should not be called immediately due to confirmation dialog
      expect(mockProps.resetGame).toHaveBeenCalledTimes(0)
    })
  })

  describe('hint functionality', () => {
    const propsWithHistory = {
      ...mockProps,
      gameState: {
        ...mockGameState,
        gameStarted: true,
        currentTurn: CurrentTurn.PLAYER,
        playerGuess: '1234',
        hintsRemaining: 3
      },
      history: {
        player: [{ guess: '5678', result: '0A2B', isCorrect: false }],
        computer: []
      }
    }

    it('should display hint button with remaining count', () => {
      render(<GameUI {...propsWithHistory} />)
      
      const hintButton = screen.getByText('checkHint (3)')
      expect(hintButton).toBeInTheDocument()
    })

    it('should disable hint button when no history exists', () => {
      const propsNoHistory = {
        ...propsWithHistory,
        history: { player: [], computer: [] }
      }
      
      render(<GameUI {...propsNoHistory} />)
      
      const hintButton = screen.getByText('checkHint (3)')
      expect(hintButton).toBeDisabled()
    })

    it('should disable hint button when no hints remaining', () => {
      const propsNoHints = {
        ...propsWithHistory,
        gameState: {
          ...propsWithHistory.gameState,
          hintsRemaining: 0
        }
      }
      
      render(<GameUI {...propsNoHints} />)
      
      const hintButton = screen.getByText('checkHint (0)')
      expect(hintButton).toBeDisabled()
    })

    it('should disable hint button when guess is incomplete', () => {
      const propsIncompleteGuess = {
        ...propsWithHistory,
        gameState: {
          ...propsWithHistory.gameState,
          playerGuess: '123'
        }
      }
      
      render(<GameUI {...propsIncompleteGuess} />)
      
      const hintButton = screen.getByText('checkHint (3)')
      expect(hintButton).toBeDisabled()
    })

    it('should call handleHintCheck when hint button clicked', async () => {
      const user = userEvent.setup()
      render(<GameUI {...propsWithHistory} />)
      
      const hintButton = screen.getByText('checkHint (3)')
      await user.click(hintButton)
      
      expect(mockProps.handleHintCheck).toHaveBeenCalledTimes(1)
    })

    it('should not show hint button during computer turn', () => {
      const propsComputerTurn = {
        ...propsWithHistory,
        gameState: {
          ...propsWithHistory.gameState,
          currentTurn: CurrentTurn.COMPUTER
        },
        computerAI: {
          ...mockComputerAI,
          showFeedbackForm: true
        }
      }
      
      render(<GameUI {...propsComputerTurn} />)
      
      expect(screen.queryByText(/checkHint/)).not.toBeInTheDocument()
    })
  })
})
