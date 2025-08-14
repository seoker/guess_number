import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { GameState, GameHistory, ComputerAI, FeedbackCorrection, SavedGameRecord, GameResult } from '../types'

// Game configuration
const GAME_CONFIG = {
  DIGIT_COUNT: 4,
  MAX_DIGIT: 10,
  COMPUTER_THINKING_TIME: 1000
}

export const useGameLogic = (addGameRecord: (record: Omit<SavedGameRecord, 'id' | 'timestamp'>) => void) => {
  const { t } = useTranslation()
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    computerTarget: '',
    playerGuess: '',
    message: '',
    messageType: 'info',
    playerAttempts: 0,
    computerAttempts: 0,
    gameWon: false,
    gameStarted: false,
    currentTurn: 'player'
  })

  // History records
  const [history, setHistory] = useState<GameHistory>({
    player: [],
    computer: []
  })

  // Computer AI state
  const [computerAI, setComputerAI] = useState<ComputerAI>({
    possibleNumbers: [],
    currentGuess: '',
    playerFeedback: { A: '', B: '' },
    showFeedbackForm: false
  })

  // Feedback correction state
  const [feedbackCorrection, setFeedbackCorrection] = useState<FeedbackCorrection>({
    isActive: false,
    showHistory: false
  })

  // Generate four unique digits
  const generateTargetNumber = useCallback((): string => {
    const digits: number[] = []
    while (digits.length < GAME_CONFIG.DIGIT_COUNT) {
      const digit = Math.floor(Math.random() * GAME_CONFIG.MAX_DIGIT)
      if (!digits.includes(digit)) {
        digits.push(digit)
      }
    }
    return digits.join('')
  }, [])

  // Initialize computer possible numbers list
  const initializeComputerPossibleNumbers = useCallback((): string[] => {
    const numbers: string[] = []
    for (let i = 0; i < 10000; i++) {
      const num = i.toString().padStart(GAME_CONFIG.DIGIT_COUNT, '0')
      const digits = num.split('')
      if (new Set(digits).size === GAME_CONFIG.DIGIT_COUNT) {
        numbers.push(num)
      }
    }
    return numbers
  }, [])

  // Validate number format
  const validateNumber = useCallback((number: string): { valid: boolean; message?: string } => {
    if (number.length !== GAME_CONFIG.DIGIT_COUNT) {
      return { valid: false, message: t('fourDigitsRequired') }
    }

    if (!/^\d{4}$/.test(number)) {
      return { valid: false, message: t('fourDigitsRequired') }
    }

    const digits = number.split('')
    const uniqueDigits = new Set(digits)
    if (uniqueDigits.size !== GAME_CONFIG.DIGIT_COUNT) {
      return { valid: false, message: t('digitsMustBeUnique') }
    }

    return { valid: true }
  }, [t])

  // Validate A and B values
  const validateFeedback = useCallback((A: number, B: number): { valid: boolean; message?: string } => {
    if (A < 0 || A > GAME_CONFIG.DIGIT_COUNT || B < 0 || B > GAME_CONFIG.DIGIT_COUNT || A + B > GAME_CONFIG.DIGIT_COUNT) {
      return { valid: false, message: t('invalidFeedback') }
    }
    return { valid: true }
  }, [t])

  // Calculate A and B numbers
  const calculateAB = useCallback((guess: string, target: string): GameResult => {
    let A = 0
    let B = 0
    const guessDigits = guess.split('')
    const targetDigits = target.split('')

    // Calculate A (correct number and position)
    for (let i = 0; i < GAME_CONFIG.DIGIT_COUNT; i++) {
      if (guessDigits[i] === targetDigits[i]) {
        A++
      }
    }

    // Calculate B (correct number, wrong position)
    for (let i = 0; i < GAME_CONFIG.DIGIT_COUNT; i++) {
      if (targetDigits.includes(guessDigits[i]) && guessDigits[i] !== targetDigits[i]) {
        B++
      }
    }

    return { A, B }
  }, [])

  // Computer reasoning for next guess
  const computerMakeGuess = useCallback((): string => {
    if (computerAI.possibleNumbers.length === 0) {
      return generateTargetNumber()
    }
    
    const randomIndex = Math.floor(Math.random() * computerAI.possibleNumbers.length)
    return computerAI.possibleNumbers[randomIndex]
  }, [computerAI.possibleNumbers, generateTargetNumber])

  // Update computer possible numbers based on feedback
  const updateComputerPossibleNumbers = useCallback((guess: string, result: string): string[] => {
    const newPossibleNumbers = computerAI.possibleNumbers.filter((num: string) => {
      const { A, B } = calculateAB(guess, num)
      return `${A}A${B}B` === result
    })
    setComputerAI(prev => ({ ...prev, possibleNumbers: newPossibleNumbers }))
    return newPossibleNumbers
  }, [computerAI.possibleNumbers, calculateAB])

  // Check if feedback is reasonable
  const checkFeedbackConsistency = useCallback((guess: string, feedback: GameResult): boolean => {
    const { A, B } = feedback
    const result = `${A}A${B}B`
    
    const possibleNumbers = computerAI.possibleNumbers.filter((num: string) => {
      const calculatedAB = calculateAB(guess, num)
      return `${calculatedAB.A}A${calculatedAB.B}B` === result
    })
    
    return possibleNumbers.length > 0
  }, [computerAI.possibleNumbers, calculateAB])

  // Generate computer complaint message
  const generateComplaint = useCallback((guess: string, feedback: GameResult): string => {
    const complaints = [
      t('complaints.inconsistent', { guess, feedback: `${feedback.A}A${feedback.B}B` }),
      t('complaints.unreasonable', { guess, feedback: `${feedback.A}A${feedback.B}B` }),
      t('complaints.joking', { guess, feedback: `${feedback.A}A${feedback.B}B` }),
      t('complaints.problematic', { guess, feedback: `${feedback.A}A${feedback.B}B` }),
      t('complaints.wrong', { guess, feedback: `${feedback.A}A${feedback.B}B` })
    ]
    
    return complaints[Math.floor(Math.random() * complaints.length)]
  }, [t])

  // Determine message type
  const getMessageType = useCallback((): 'info' | 'success' | 'complaint' => {
    if (gameState.gameWon) return 'success'
    return gameState.messageType
  }, [gameState.gameWon, gameState.messageType])

  // Start new game
  const startNewGame = useCallback((): void => {
    setGameState({
      computerTarget: generateTargetNumber(),
      playerGuess: '',
      message: '',
      messageType: 'info',
      playerAttempts: 0,
      computerAttempts: 0,
      gameWon: false,
      gameStarted: true,
      currentTurn: 'player' // Start with player
    })
    
    setHistory({ player: [], computer: [] })
    
    setComputerAI({
      possibleNumbers: initializeComputerPossibleNumbers(),
      currentGuess: '',
      playerFeedback: { A: '', B: '' },
      showFeedbackForm: false
    })
  }, [generateTargetNumber, initializeComputerPossibleNumbers])

  // Handle player guess
  const handlePlayerGuess = useCallback((): void => {
    const validation = validateNumber(gameState.playerGuess)
    if (!validation.valid) {
      setGameState(prev => ({ ...prev, message: validation.message || '', messageType: 'info' }))
      return
    }

    // Calculate current attempt number (will be used for record keeping)
    const currentPlayerAttempt = gameState.playerAttempts + 1

    setGameState(prev => ({ 
      ...prev,
      playerAttempts: currentPlayerAttempt,
      message: '',
      messageType: 'info'
    }))

    if (gameState.playerGuess === gameState.computerTarget) {
      // Player found the correct number
      setHistory(prev => ({
        ...prev,
        player: [...prev.player, { 
          guess: gameState.playerGuess, 
          result: '4A0B', 
          isCorrect: true 
        }]
      }))
      
      // Check if computer should get a final turn (fair play - equal attempts)
      if (currentPlayerAttempt > gameState.computerAttempts) {
        // Give computer one final guess since player went first
        setGameState(prev => ({ 
          ...prev,
          message: t('playerFoundAnswer'),
          messageType: 'info',
          currentTurn: 'computer',
          playerGuess: ''
        }))
        
        // Trigger computer's final turn
        setTimeout(() => {
          const computerGuessNum = computerMakeGuess()
          setComputerAI(prev => ({ 
            ...prev,
            currentGuess: computerGuessNum,
            showFeedbackForm: true 
          }))
          setGameState(prev => ({ 
            ...prev,
            message: `${t('computerFinalGuess')}${computerGuessNum}`,
            messageType: 'info'
          }))
        }, GAME_CONFIG.COMPUTER_THINKING_TIME)
      } else {
        // Game ends - player wins
        setGameState(prev => ({ 
          ...prev,
          message: t('playerWon'),
          messageType: 'success',
          gameWon: true
        }))
        
        // Save game record
        if (addGameRecord) {
          addGameRecord({
            winner: 'player',
            playerAttempts: currentPlayerAttempt,
            computerAttempts: gameState.computerAttempts,
            totalRounds: currentPlayerAttempt + gameState.computerAttempts,
            playerHistory: [...history.player, { 
              guess: gameState.playerGuess, 
              result: '4A0B', 
              isCorrect: true 
            }],
            computerHistory: history.computer
          })
        }
      }
    } else {
      const { A, B } = calculateAB(gameState.playerGuess, gameState.computerTarget)
      const result = `${A}A${B}B`
      setGameState(prev => ({ 
        ...prev,
        message: `${t('yourHint')}${result}`,
        messageType: 'info',
        currentTurn: 'computer',
        playerGuess: ''
      }))
      setHistory(prev => ({
        ...prev,
        player: [...prev.player, { 
          guess: gameState.playerGuess, 
          result, 
          isCorrect: false 
        }]
      }))
      
      // Trigger computer turn
      setTimeout(() => {
        const computerGuessNum = computerMakeGuess()
        setComputerAI(prev => ({ 
          ...prev,
          currentGuess: computerGuessNum,
          showFeedbackForm: true 
        }))
        setGameState(prev => ({ 
          ...prev,
          message: t('computerThinking'),
          messageType: 'info'
        }))
      }, GAME_CONFIG.COMPUTER_THINKING_TIME)
    }
  }, [gameState.playerGuess, gameState.computerTarget, gameState.playerAttempts, gameState.computerAttempts, history.player, history.computer, validateNumber, calculateAB, computerMakeGuess, t, addGameRecord])

  // Handle player feedback
  const handleFeedbackSubmit = useCallback(() => {
    const A = parseInt(computerAI.playerFeedback.A) || 0
    const B = parseInt(computerAI.playerFeedback.B) || 0
    
    const validation = validateFeedback(A, B)
    if (!validation.valid) {
      setGameState(prev => ({ ...prev, message: validation.message || '', messageType: 'info' }))
      return
    }

    const feedback = { A, B }
    
    // Check if feedback is reasonable
    if (!checkFeedbackConsistency(computerAI.currentGuess, feedback)) {
      const complaint = generateComplaint(computerAI.currentGuess, feedback)
      setGameState(prev => ({ ...prev, message: complaint, messageType: 'complaint' }))
      setFeedbackCorrection(prev => ({ ...prev, isActive: true }))
      return
    }

    const result = `${A}A${B}B`
    const currentComputerAttempt = gameState.computerAttempts + 1
    
    setHistory(prev => ({
      ...prev,
      computer: [...prev.computer, { 
        guess: computerAI.currentGuess, 
        result, 
        isCorrect: A === GAME_CONFIG.DIGIT_COUNT 
      }]
    }))
    
    if (A === GAME_CONFIG.DIGIT_COUNT) {
      // Computer found the correct number
      // Check if player has already found the answer (same round = draw)
      const playerAlreadyWon = history.player.some(record => record.isCorrect)
      
      if (playerAlreadyWon) {
        // Both players succeeded in the same round - it's a draw!
        setGameState(prev => ({ 
          ...prev,
          gameWon: true,
          computerAttempts: currentComputerAttempt,
          message: t('gameDraw'),
          messageType: 'success'
        }))
        
        // Save game record - draw
        if (addGameRecord) {
          // Find player's winning round from history (they already won)
          const playerWinningRound = history.player.length
          addGameRecord({
            winner: 'draw',
            playerAttempts: playerWinningRound,
            computerAttempts: currentComputerAttempt,
            totalRounds: Math.max(playerWinningRound, currentComputerAttempt),  // Max rounds reached
            playerHistory: history.player,
            computerHistory: [...history.computer, { 
              guess: computerAI.currentGuess, 
              result: `${A}A${B}B`, 
              isCorrect: true 
            }]
          })
        }
      } else {
        // Computer wins - player hasn't found the answer yet
        setGameState(prev => ({ 
          ...prev,
          gameWon: true,
          computerAttempts: currentComputerAttempt,
          message: t('computerWon', { computerNumber: prev.computerTarget }),
          messageType: 'success'
        }))
        
        // Save game record
        if (addGameRecord) {
          addGameRecord({
            winner: 'computer',
            playerAttempts: history.player.length,  // Player attempts made
            computerAttempts: currentComputerAttempt,  // Computer's winning round
            totalRounds: history.player.length + currentComputerAttempt,
            playerHistory: history.player,
            computerHistory: [...history.computer, { 
              guess: computerAI.currentGuess, 
              result: `${A}A${B}B`, 
              isCorrect: true 
            }]
          })
        }
      }
    } else {
      // Check if player has already found the answer (computer's final turn)
      const playerAlreadyWon = history.player.some(record => record.isCorrect)
      
      if (playerAlreadyWon) {
        // This was computer's final attempt after player won - player wins
        setGameState(prev => ({ 
          ...prev,
          gameWon: true,
          computerAttempts: currentComputerAttempt,
          message: t('playerWon'),
          messageType: 'success'
        }))
        
        // Save game record - player wins
        if (addGameRecord) {
          addGameRecord({
            winner: 'player',
            playerAttempts: history.player.length,  // Player's winning round count
            computerAttempts: currentComputerAttempt,  // Computer's final attempt
            totalRounds: history.player.length + currentComputerAttempt,
            playerHistory: history.player,
            computerHistory: [...history.computer, { 
              guess: computerAI.currentGuess, 
              result: `${A}A${B}B`, 
              isCorrect: false 
            }]
          })
        }
      } else {
        // Normal game continues
        const remainingNumbers = updateComputerPossibleNumbers(computerAI.currentGuess, result)
        if (remainingNumbers.length === 0) {
          setGameState(prev => ({ 
            ...prev,
            message: t('noPossibleNumbers'),
            messageType: 'info'
          }))
          return
        }
        setGameState(prev => ({ 
          ...prev,
          computerAttempts: currentComputerAttempt,
          currentTurn: 'player',
          message: '',
          messageType: 'info'
        }))
      }
    }
    
    // Reset computer AI state
    setComputerAI(prev => ({
      ...prev,
      showFeedbackForm: false,
      playerFeedback: { A: '', B: '' }
    }))
  }, [computerAI.playerFeedback, computerAI.currentGuess, gameState.computerAttempts, history.player, history.computer, validateFeedback, checkFeedbackConsistency, generateComplaint, updateComputerPossibleNumbers, t, addGameRecord])

  // Update player guess
  const updatePlayerGuess = useCallback((guess: string) => {
    setGameState(prev => ({ ...prev, playerGuess: guess }))
  }, [])

  // Update player feedback
  const updatePlayerFeedback = useCallback((type: 'A' | 'B', value: string) => {
    setComputerAI(prev => ({
      ...prev,
      playerFeedback: { ...prev.playerFeedback, [type]: value }
    }))
  }, [])

  // Start feedback correction
  const startFeedbackCorrection = useCallback(() => {
    setFeedbackCorrection(prev => ({ ...prev, showHistory: true }))
  }, [])

  // Reset game to initial state
  const resetGame = useCallback(() => {
    setGameState({
      computerTarget: generateTargetNumber(),
      playerGuess: '',
      message: '',
      messageType: 'info',
      playerAttempts: 0,
      computerAttempts: 0,
      gameWon: false,
      gameStarted: true,
      currentTurn: 'player'
    })
    
    setHistory({ player: [], computer: [] })
    
    setComputerAI({
      possibleNumbers: initializeComputerPossibleNumbers(),
      currentGuess: '',
      playerFeedback: { A: '', B: '' },
      showFeedbackForm: false
    })

    setFeedbackCorrection({
      isActive: false,
      showHistory: false
    })
  }, [generateTargetNumber, initializeComputerPossibleNumbers])

  // Correct history feedback
  const correctHistoryFeedback = useCallback((index: number, newA: number, newB: number) => {
    const updatedHistory = [...history.computer]
    updatedHistory[index].result = `${newA}A${newB}B`
    
    // Reinitialize computer possible numbers list
    let possibleNumbers = initializeComputerPossibleNumbers()
    
    // Recalculate possible numbers based on corrected history
    for (let i = 0; i <= index; i++) {
      const record = updatedHistory[i]
      possibleNumbers = possibleNumbers.filter(num => {
        const { A, B } = calculateAB(record.guess, num)
        return `${A}A${B}B` === record.result
      })
    }
    
    setHistory(prev => ({ ...prev, computer: updatedHistory }))
    setComputerAI(prev => ({ ...prev, possibleNumbers }))
    setFeedbackCorrection({ isActive: false, showHistory: false })
    setGameState(prev => ({ 
      ...prev, 
      message: '',
      messageType: 'info',
      currentTurn: 'player'
    }))
  }, [history.computer, initializeComputerPossibleNumbers, calculateAB])

  // Cancel correction
  const cancelFeedbackCorrection = useCallback(() => {
    setFeedbackCorrection({ isActive: false, showHistory: false })
    setGameState(prev => ({ ...prev, message: '', messageType: 'info' }))
  }, [])

  // Initialize game
  useEffect(() => {
    if (gameState.gameStarted && !gameState.computerTarget) {
      setGameState(prev => ({ ...prev, computerTarget: generateTargetNumber() }))
      setComputerAI(prev => ({ ...prev, possibleNumbers: initializeComputerPossibleNumbers() }))
    }
  }, [gameState.gameStarted, gameState.computerTarget, generateTargetNumber, initializeComputerPossibleNumbers])

  return {
    // State
    gameState,
    history,
    computerAI,
    feedbackCorrection,
    
    // Methods
    startNewGame,
    handlePlayerGuess,
    handleFeedbackSubmit,
    updatePlayerGuess,
    updatePlayerFeedback,
    getMessageType,
    startFeedbackCorrection,
    resetGame,
    correctHistoryFeedback,
    cancelFeedbackCorrection,
    
    // Constants
    GAME_CONFIG,
    MESSAGE_TYPES: {
      SUCCESS: 'success',
      COMPLAINT: 'complaint', 
      INFO: 'info'
    }
  }
}
