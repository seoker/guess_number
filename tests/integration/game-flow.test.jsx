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

describe('complete game flow tests', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('game initialization', () => {
    it('should correctly initialize game', async () => {
      render(<App />)
      
      // Check start screen (use className selector to avoid duplication)
      expect(screen.getByText('gameTab')).toBeInTheDocument() // Navigation tab
      expect(screen.getByRole('button', { name: 'startGame' })).toBeInTheDocument()
      
      // Start game
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // Check game state
      await waitFor(() => {
        expect(screen.getByText(/playerAttempts/)).toBeInTheDocument()
        expect(screen.getByText(/computerAttempts/)).toBeInTheDocument()
      })
    })
  })

  describe('player guess flow', () => {
    it('should handle player guess input', async () => {
      render(<App />)
      
      // Start game
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // Wait for game to start, check player input interface
      await waitFor(() => {
        expect(screen.getByPlaceholderText('guessPlaceholder')).toBeInTheDocument()
      })
      
      // Player enters guess
      const input = screen.getByPlaceholderText('guessPlaceholder')
      await user.type(input, '1234')
      
      // Check if button is enabled
      const guessButton = screen.getByRole('button', { name: 'guess' })
      expect(guessButton).toBeEnabled()
    })

    it('should handle player invalid input', async () => {
      render(<App />)
      
      // Start game
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // Wait for game to start
      await waitFor(() => {
        expect(screen.getByPlaceholderText('guessPlaceholder')).toBeInTheDocument()
      })
      
      // Player enters invalid guess
      const input = screen.getByPlaceholderText('guessPlaceholder')
      await user.type(input, '123')
      
      const guessButton = screen.getByRole('button', { name: 'guess' })
      expect(guessButton).toBeDisabled()
    })
  })

  describe('game interface', () => {
    it('should display basic game interface elements', async () => {
      render(<App />)
      
      // Start game
      const startButton = screen.getByRole('button', { name: 'startGame' })
      await user.click(startButton)
      
      // Check game interface elements
      await waitFor(() => {
        expect(screen.getByText(/playerAttempts/)).toBeInTheDocument()
        expect(screen.getByText(/computerAttempts/)).toBeInTheDocument()
        expect(screen.getByText(/currentTurn/)).toBeInTheDocument()
        expect(screen.getByPlaceholderText('guessPlaceholder')).toBeInTheDocument()
      })
    })
  })

  describe('navigation functionality', () => {
    it('should be able to switch between game and records pages', async () => {
      render(<App />)
      
      // Check initial state - should display game content
      expect(screen.getByRole('button', { name: 'startGame' })).toBeInTheDocument()
      
      // Switch to records page
      const recordsTab = screen.getByRole('button', { name: 'recordsTab' })
      await user.click(recordsTab)
      
      // Check if switched to records page - record related content should be displayed
      expect(screen.queryByRole('button', { name: 'startGame' })).not.toBeInTheDocument()
    })
  })

  describe('language switching', () => {
    it('should display language selector', async () => {
      render(<App />)
      
      // Check language selector exists
      expect(screen.getAllByText('🌐')).toHaveLength(1) // language selector
      expect(screen.getByText('中文')).toBeInTheDocument()
    })
  })

  describe('application structure', () => {
    it('should include all main components', async () => {
      render(<App />)
      
      // Check navigation bar
      expect(screen.getByText('gameTab')).toBeInTheDocument()
      expect(screen.getByText('recordsTab')).toBeInTheDocument()
      
      // Check game area
      expect(screen.getByRole('button', { name: 'startGame' })).toBeInTheDocument()
      
      // Check language selector
      expect(screen.getByText('中文')).toBeInTheDocument()
    })
  })
})
