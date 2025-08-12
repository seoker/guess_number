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

const mockProps = {
  gameState: mockGameState,
  history: mockHistory,
  computerAI: mockComputerAI,
  startNewGame: vi.fn(),
  handlePlayerGuess: vi.fn(),
  handleFeedbackSubmit: vi.fn(),
  updatePlayerGuess: vi.fn(),
  updatePlayerFeedback: vi.fn(),
  getMessageType: vi.fn(() => 'INFO'),
  t: vi.fn((key) => key),
  currentLanguage: 'zh-TW',
  changeLanguage: vi.fn(),
  getSupportedLanguages: vi.fn(() => ['zh-TW', 'en'])
}

describe('gameUI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('遊戲開始畫面', () => {
    it('應該顯示開始畫面當遊戲未開始時', () => {
      render(<GameUI {...mockProps} />)
      
      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('startGame')).toBeInTheDocument()
      expect(screen.getByText(/description/)).toBeInTheDocument()
      expect(screen.getAllByText(/rules/)).toHaveLength(2) // 'rules' and 'rulesDetail' both match
    })

    it('應該能夠開始遊戲', async () => {
      const user = userEvent.setup()
      render(<GameUI {...mockProps} />)
      
      const startButton = screen.getByText('startGame')
      await user.click(startButton)
      
      expect(mockProps.startNewGame).toHaveBeenCalledTimes(1)
    })
  })

  describe('遊戲進行畫面', () => {
    const gameInProgressProps = {
      ...mockProps,
      gameState: {
        ...mockGameState,
        gameStarted: true,
        currentTurn: 'player'
      }
    }

    it('應該顯示遊戲進行畫面', () => {
      render(<GameUI {...gameInProgressProps} />)
      
      expect(screen.getByText(/playerAttempts/)).toBeInTheDocument()
      expect(screen.getByText(/computerAttempts/)).toBeInTheDocument()
      expect(screen.getByText(/currentTurn/)).toBeInTheDocument()
    })

    it('應該顯示玩家輸入區域', () => {
      render(<GameUI {...gameInProgressProps} />)
      
      const input = screen.getByPlaceholderText('guessPlaceholder')
      expect(input).toBeInTheDocument()
      expect(input).not.toBeDisabled()
    })

    it('應該處理玩家輸入', async () => {
      const user = userEvent.setup()
      render(<GameUI {...gameInProgressProps} />)
      
      const input = screen.getByPlaceholderText('guessPlaceholder')
      await user.type(input, '1234')
      
      // 因為每個字符都會觸發一次 updatePlayerGuess，所以檢查最後一次調用
      expect(mockProps.updatePlayerGuess).toHaveBeenCalledTimes(4)
      expect(mockProps.updatePlayerGuess).toHaveBeenLastCalledWith('4')
    })

    it('應該處理玩家猜測提交', async () => {
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

    it('應該在輸入不完整時禁用猜測按鈕', () => {
      render(<GameUI {...gameInProgressProps} />)
      
      const guessButton = screen.getByText('guess')
      expect(guessButton).toBeDisabled()
    })
  })

  describe('電腦回合', () => {
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

    it('應該顯示電腦猜測和反饋表單', () => {
      render(<GameUI {...computerTurnProps} />)
      
      expect(screen.getByText(/computerGuess5678/)).toBeInTheDocument()
      expect(screen.getByText('feedbackHint')).toBeInTheDocument()
    })

    it('應該顯示A和B選擇按鈕', () => {
      render(<GameUI {...computerTurnProps} />)
      
      expect(screen.getByText('aLabel')).toBeInTheDocument()
      expect(screen.getByText('bLabel')).toBeInTheDocument()
      
      // 檢查數字按鈕 (A和B區域都有，所以每個數字出現2次)
      for (let i = 0; i <= 4; i++) {
        expect(screen.getAllByText(i.toString())).toHaveLength(2)
      }
    })

    it('應該處理反饋提交', async () => {
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

  describe('歷史記錄', () => {
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

    it('應該顯示玩家歷史記錄', () => {
      render(<GameUI {...propsWithHistory} />)
      
      expect(screen.getByText('playerHistory')).toBeInTheDocument()
      expect(screen.getAllByText('1234')).toHaveLength(1)
      expect(screen.getAllByText('5678')).toHaveLength(2) // appears in both player and computer history
      expect(screen.getByText('2A2B')).toBeInTheDocument()
      expect(screen.getByText('0A0B')).toBeInTheDocument()
    })

    it('應該顯示電腦歷史記錄', () => {
      render(<GameUI {...propsWithHistory} />)
      
      expect(screen.getByText('computerHistory')).toBeInTheDocument()
      expect(screen.getByText('1A1B')).toBeInTheDocument()
    })
  })

  describe('遊戲結束', () => {
    const gameWonProps = {
      ...mockProps,
      gameState: {
        ...mockGameState,
        gameStarted: true,
        gameWon: true
      }
    }

    it('應該顯示遊戲結束畫面', () => {
      render(<GameUI {...gameWonProps} />)
      
      expect(screen.getByText('gameOver')).toBeInTheDocument()
      expect(screen.getByText('playAgain')).toBeInTheDocument()
    })

    it('應該能夠重新開始遊戲', async () => {
      const user = userEvent.setup()
      render(<GameUI {...gameWonProps} />)
      
      const playAgainButton = screen.getByText('playAgain')
      await user.click(playAgainButton)
      
      expect(mockProps.startNewGame).toHaveBeenCalledTimes(1)
    })
  })

  describe('語言切換', () => {
    it('應該接收語言相關的props', () => {
      render(<GameUI {...mockProps} />)
      
      // GameUI 組件本身不包含語言選擇器，但接收 t 函數進行翻譯
      expect(screen.getByText('title')).toBeInTheDocument()
    })
  })
})
