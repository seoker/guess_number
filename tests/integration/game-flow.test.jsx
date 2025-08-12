import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App.jsx'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'zh',
      changeLanguage: vi.fn()
    }
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
      
      // 檢查開始畫面 (使用 className 選擇器來避免重複)
      expect(screen.getByText('gameTab')).toBeInTheDocument() // Navigation tab
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
    it('應該處理玩家的猜測輸入', async () => {
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 等待遊戲開始，檢查玩家輸入界面
      await waitFor(() => {
        expect(screen.getByPlaceholderText('guessPlaceholder')).toBeInTheDocument()
      })
      
      // 玩家輸入猜測
      const input = screen.getByPlaceholderText('guessPlaceholder')
      await user.type(input, '1234')
      
      // 檢查按鈕是否啟用
      const guessButton = screen.getByRole('button', { name: 'guess' })
      expect(guessButton).toBeEnabled()
    })

    it('應該處理玩家的無效輸入', async () => {
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 等待遊戲開始
      await waitFor(() => {
        expect(screen.getByPlaceholderText('guessPlaceholder')).toBeInTheDocument()
      })
      
      // 玩家輸入無效猜測
      const input = screen.getByPlaceholderText('guessPlaceholder')
      await user.type(input, '123')
      
      const guessButton = screen.getByRole('button', { name: 'guess' })
      expect(guessButton).toBeDisabled()
    })
  })

  describe('遊戲界面', () => {
    it('應該顯示遊戲基本界面元素', async () => {
      render(<App />)
      
      // 開始遊戲
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // 檢查遊戲界面元素
      await waitFor(() => {
        expect(screen.getByText(/playerAttempts/)).toBeInTheDocument()
        expect(screen.getByText(/computerAttempts/)).toBeInTheDocument()
        expect(screen.getByText(/currentTurn/)).toBeInTheDocument()
        expect(screen.getByPlaceholderText('guessPlaceholder')).toBeInTheDocument()
      })
    })
  })

  describe('導航功能', () => {
    it('應該能夠在遊戲和記錄頁面間切換', async () => {
      render(<App />)
      
      // 檢查初始狀態 - 應該顯示遊戲內容
      expect(screen.getByRole('button', { name: 'startGame' })).toBeInTheDocument()
      
      // 切換到記錄頁面
      const recordsTab = screen.getByRole('button', { name: 'recordsTab' })
      await user.click(recordsTab)
      
      // 檢查是否切換到記錄頁面 - 記錄相關內容應該顯示
      expect(screen.queryByRole('button', { name: 'startGame' })).not.toBeInTheDocument()
    })
  })

  describe('語言切換', () => {
    it('應該顯示語言選擇器', async () => {
      render(<App />)
      
      // 檢查語言選擇器存在
      expect(screen.getAllByText('🌐')).toHaveLength(1) // language selector
      expect(screen.getByText('中文')).toBeInTheDocument()
    })
  })

  describe('應用程式結構', () => {
    it('應該包含所有主要組件', async () => {
      render(<App />)
      
      // 檢查導航欄
      expect(screen.getByText('gameTab')).toBeInTheDocument()
      expect(screen.getByText('recordsTab')).toBeInTheDocument()
      
      // 檢查遊戲區域
      expect(screen.getByRole('button', { name: 'startGame' })).toBeInTheDocument()
      
      // 檢查語言選擇器
      expect(screen.getByText('中文')).toBeInTheDocument()
    })
  })
})
