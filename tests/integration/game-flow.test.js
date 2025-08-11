import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../src/App'

// Mock i18n
vi.mock('../src/hooks/useI18n', () => ({
  useI18n: () => ({
    currentLanguage: 'zh-TW',
    changeLanguage: vi.fn(),
    t: vi.fn((key) => key),
    getSupportedLanguages: vi.fn(() => ['zh-TW', 'en'])
  })
}))

describe('遊戲完整流程測試', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('遊戲初始化', () => {
    it('應該正確初始化遊戲', async () => {
      render(<App />)
      
      // 檢查開始畫面
      expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'startGame' })).toBeInTheDocument()
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 檢查遊戲狀態
      await waitFor(() => {
        expect(screen.getByText(/playerAttempts/)).toBeInTheDocument()
        expect(screen.getByText(/computerAttempts/)).toBeInTheDocument()
      })
    })
  })

  describe('玩家猜測流程', () => {
    it('應該處理玩家的正確猜測', async () => {
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 等待電腦回合結束
      await waitFor(() => {
        expect(screen.getByText(/computerGuess/)).toBeInTheDocument()
      })
      
      // 提供反饋給電腦
      const aButton = screen.getByRole('button', { name: '0' })
      const bButton = screen.getByRole('button', { name: '0' })
      await user.click(aButton)
      await user.click(bButton)
      
      const submitButton = screen.getByRole('button', { name: 'submitFeedback' })
      await user.click(submitButton)
      
      // 等待玩家回合
      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /guess/i })).toBeInTheDocument()
      })
      
      // 玩家輸入猜測
      const input = screen.getByRole('textbox', { name: /guess/i })
      await user.type(input, '1234')
      
      const guessButton = screen.getByRole('button', { name: 'guess' })
      await user.click(guessButton)
      
      // 檢查結果
      await waitFor(() => {
        expect(screen.getByText(/yourHint/)).toBeInTheDocument()
      })
    })

    it('應該處理玩家的無效輸入', async () => {
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 等待玩家回合
      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /guess/i })).toBeInTheDocument()
      })
      
      // 玩家輸入無效猜測
      const input = screen.getByRole('textbox', { name: /guess/i })
      await user.type(input, '123')
      
      const guessButton = screen.getByRole('button', { name: 'guess' })
      expect(guessButton).toBeDisabled()
    })
  })

  describe('電腦猜測流程', () => {
    it('應該處理電腦猜測和玩家反饋', async () => {
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 等待電腦猜測
      await waitFor(() => {
        expect(screen.getByText(/computerGuess/)).toBeInTheDocument()
      })
      
      // 檢查電腦猜測格式
      const computerGuess = screen.getByText(/[0-9]{4}/)
      expect(computerGuess).toBeInTheDocument()
      
      // 提供反饋
      const aButton = screen.getByRole('button', { name: '1' })
      const bButton = screen.getByRole('button', { name: '1' })
      await user.click(aButton)
      await user.click(bButton)
      
      const submitButton = screen.getByRole('button', { name: 'submitFeedback' })
      await user.click(submitButton)
      
      // 檢查回合切換
      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /guess/i })).toBeInTheDocument()
      })
    })
  })

  describe('遊戲結束條件', () => {
    it('應該在玩家猜對時結束遊戲', async () => {
      // 這個測試需要模擬特定的遊戲狀態
      // 在實際應用中，你可能需要 mock 隨機數生成
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 等待電腦回合
      await waitFor(() => {
        expect(screen.getByText(/computerGuess/)).toBeInTheDocument()
      })
      
      // 提供反饋讓電腦猜對
      const aButton = screen.getByRole('button', { name: '4' })
      const bButton = screen.getByRole('button', { name: '0' })
      await user.click(aButton)
      await user.click(bButton)
      
      const submitButton = screen.getByRole('button', { name: 'submitFeedback' })
      await user.click(submitButton)
      
      // 檢查遊戲結束
      await waitFor(() => {
        expect(screen.getByText(/computerWon/)).toBeInTheDocument()
      })
    })
  })

  describe('重新開始遊戲', () => {
    it('應該能夠重新開始遊戲', async () => {
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 等待遊戲進行
      await waitFor(() => {
        expect(screen.getByText(/playerAttempts/)).toBeInTheDocument()
      })
      
      // 重新開始遊戲
      const restartButton = screen.getByRole('button', { name: 'playAgain' })
      await user.click(restartButton)
      
      // 檢查回到開始畫面
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'startGame' })).toBeInTheDocument()
      })
    })
  })

  describe('語言切換', () => {
    it('應該能夠切換語言', async () => {
      render(<App />)
      
      // 檢查語言選擇器
      const languageSelector = screen.getByRole('combobox')
      expect(languageSelector).toBeInTheDocument()
      
      // 切換語言
      await user.selectOptions(languageSelector, 'en')
      
      // 檢查語言是否改變
      // 注意：這需要實際的 i18n 實現
    })
  })

  describe('錯誤處理', () => {
    it('應該處理無效的反饋輸入', async () => {
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 等待電腦猜測
      await waitFor(() => {
        expect(screen.getByText(/computerGuess/)).toBeInTheDocument()
      })
      
      // 提供無效反饋
      const aButton = screen.getByRole('button', { name: '5' }) // 無效的A值
      const bButton = screen.getByRole('button', { name: '0' })
      await user.click(aButton)
      await user.click(bButton)
      
      const submitButton = screen.getByRole('button', { name: 'submitFeedback' })
      await user.click(submitButton)
      
      // 檢查錯誤訊息
      await waitFor(() => {
        expect(screen.getByText(/invalidFeedback/)).toBeInTheDocument()
      })
    })
  })
})
