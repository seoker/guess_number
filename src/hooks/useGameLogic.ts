import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { GameHistory, SavedGameRecord, GuessResult, MessageType, GameWinner } from '../types'
import { useGameState } from './useGameState'
import { useComputerAI } from './useComputerAI'
import { useFeedbackCorrection } from './useFeedbackCorrection'
import { 
  GAME_CONFIG, 
  calculateAB, 
  validateNumber, 
  validateFeedback,
  calculatePossibleTargets
} from '../utils/gameUtils'

export const useGameLogic = (addGameRecord: (record: Omit<SavedGameRecord, 'id' | 'timestamp'>) => void) => {
  const { t } = useTranslation()
  
  // Use specialized hooks
  const {
    gameState,
    startNewGame: startGame,
    resetGame: resetGameState,
    updatePlayerGuess,
    setMessage,
    clearMessage,
    playerTurnSuccess,
    playerWins,
    playerWinsWithComputerAttempts,
    computerFinalTurn,
    computerWins,
    gameDraw,
    switchToPlayer,
    consumeHint
  } = useGameState()
  
  const {
    computerAI,
    initializeAI,
    makeGuess,
    updateFeedback,
    processFeedback,
    checkFeedbackIsConsistent,
    resetFeedbackForm,
    recalculatePossibleNumbers
  } = useComputerAI()
  
  const {
    feedbackCorrection,
    startCorrection,
    showHistory,
    cancelCorrection,
    completeCorrection
  } = useFeedbackCorrection()

  // History records
  const [history, setHistory] = useState<GameHistory>({
    player: [],
    computer: []
  })

  // Generate computer complaint message
  const generateComplaint = useCallback((guess: string, feedback: GuessResult): string => {
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
  const getMessageType = useCallback((): MessageType => {
    if (gameState.gameWon) return MessageType.SUCCESS
    return gameState.messageType
  }, [gameState.gameWon, gameState.messageType])

  // Start new game
  const startNewGame = useCallback((): void => {
    startGame()
    setHistory({ player: [], computer: [] })
    initializeAI()
  }, [startGame, initializeAI])

  // Handle player guess
  const handlePlayerGuess = useCallback((): void => {
    const validation = validateNumber(gameState.playerGuess)
    if (!validation.valid) {
      setMessage(t(validation.message || ''), MessageType.INFO)
      return
    }

    const currentPlayerAttempt = gameState.playerAttempts + 1

    if (gameState.playerGuess === gameState.computerTarget) {
      const playerRecord = { 
        guess: gameState.playerGuess, 
        result: { A: 4, B: 0 }, 
        isCorrect: true 
      }
      setHistory(prev => ({ ...prev, player: [...prev.player, playerRecord] }))
      
      if (currentPlayerAttempt > gameState.computerAttempts) {
        computerFinalTurn(currentPlayerAttempt)
        setMessage(t('playerFoundAnswer'))
        
        setTimeout(() => {
          const computerGuessNum = makeGuess()
          setMessage(`${t('computerFinalGuess')}${computerGuessNum}`)
        }, GAME_CONFIG.COMPUTER_THINKING_TIME)
      } else {
        playerWins(currentPlayerAttempt)
        setMessage(t('playerWon'), MessageType.SUCCESS)
        
        if (addGameRecord) {
          addGameRecord({
            winner: GameWinner.PLAYER,
            playerAttempts: currentPlayerAttempt,
            computerAttempts: gameState.computerAttempts,
            totalRounds: currentPlayerAttempt + gameState.computerAttempts,
            playerHistory: [...history.player, playerRecord],
            computerHistory: history.computer
          })
        }
      }
    } else {
      const result = calculateAB(gameState.playerGuess, gameState.computerTarget)
      const resultString = `${result.A}A${result.B}B`
      const playerRecord = { guess: gameState.playerGuess, result, isCorrect: false }
      
      playerTurnSuccess(currentPlayerAttempt, `${t('yourHint')}${resultString}`)
      setHistory(prev => ({ ...prev, player: [...prev.player, playerRecord] }))
      
      setTimeout(() => {
        makeGuess()
        setMessage(t('computerThinking'))
      }, GAME_CONFIG.COMPUTER_THINKING_TIME)
    }
  }, [gameState.playerGuess, gameState.computerTarget, gameState.playerAttempts, gameState.computerAttempts, history.player, history.computer, setMessage, playerTurnSuccess, playerWins, computerFinalTurn, makeGuess, t, addGameRecord])

  // Handle player feedback
  const handleFeedbackSubmit = useCallback(() => {
    const A = computerAI.playerFeedback.A
    const B = computerAI.playerFeedback.B
    
    const validation = validateFeedback(A, B)
    if (!validation.valid) {
      setMessage(t(validation.message || ''), MessageType.INFO)
      return
    }

    const feedback = { A, B }
    
    if (!checkFeedbackIsConsistent(feedback)) {
      const complaint = generateComplaint(computerAI.currentGuess, feedback)
      setMessage(complaint, MessageType.COMPLAINT)
      startCorrection()
      return
    }

    const currentComputerAttempt = gameState.computerAttempts + 1
    const computerRecord = { 
      guess: computerAI.currentGuess, 
      result: feedback, 
      isCorrect: A === GAME_CONFIG.DIGIT_COUNT 
    }
    
    setHistory(prev => ({ ...prev, computer: [...prev.computer, computerRecord] }))
    
    if (A === GAME_CONFIG.DIGIT_COUNT) {
      const playerAlreadyWon = history.player.some(record => record.isCorrect)
      
      if (playerAlreadyWon) {
        gameDraw(currentComputerAttempt)
        setMessage(t('gameDraw'), MessageType.SUCCESS)
        
        if (addGameRecord) {
          const playerWinningRound = history.player.length
          addGameRecord({
            winner: GameWinner.DRAW,
            playerAttempts: playerWinningRound,
            computerAttempts: currentComputerAttempt,
            totalRounds: Math.max(playerWinningRound, currentComputerAttempt),
            playerHistory: history.player,
            computerHistory: [...history.computer, computerRecord]
          })
        }
      } else {
        computerWins(currentComputerAttempt, gameState.computerTarget)
        setMessage(t('computerWon', { computerNumber: gameState.computerTarget }), MessageType.SUCCESS)
        
        if (addGameRecord) {
          addGameRecord({
            winner: GameWinner.COMPUTER,
            playerAttempts: history.player.length,
            computerAttempts: currentComputerAttempt,
            totalRounds: history.player.length + currentComputerAttempt,
            playerHistory: history.player,
            computerHistory: [...history.computer, computerRecord]
          })
        }
      }
    } else {
      const playerAlreadyWon = history.player.some(record => record.isCorrect)
      
      if (playerAlreadyWon) {
        playerWinsWithComputerAttempts(history.player.length, currentComputerAttempt)
        setMessage(t('playerWon'), MessageType.SUCCESS)
        
        if (addGameRecord) {
          addGameRecord({
            winner: GameWinner.PLAYER,
            playerAttempts: history.player.length,
            computerAttempts: currentComputerAttempt,
            totalRounds: history.player.length + currentComputerAttempt,
            playerHistory: history.player,
            computerHistory: [...history.computer, computerRecord]
          })
        }
      } else {
        const remainingNumbers = processFeedback(`${A}A${B}B`)
        if (remainingNumbers.length === 0) {
          setMessage(t('noPossibleNumbers'))
          return
        }
        switchToPlayer()
      }
    }
    
    resetFeedbackForm()
  }, [computerAI.playerFeedback, computerAI.currentGuess, gameState.computerAttempts, gameState.computerTarget, history.player, history.computer, checkFeedbackIsConsistent, generateComplaint, startCorrection, gameDraw, computerWins, playerWinsWithComputerAttempts, processFeedback, switchToPlayer, resetFeedbackForm, setMessage, t, addGameRecord])

  // Start feedback correction
  const startFeedbackCorrection = useCallback(() => {
    showHistory()
  }, [showHistory])

  // Reset game to initial state
  const resetGame = useCallback(() => {
    resetGameState()
    setHistory({ player: [], computer: [] })
    initializeAI()
    completeCorrection()
  }, [resetGameState, initializeAI, completeCorrection])

  // Correct history feedback
  const correctHistoryFeedback = useCallback((index: number, newA: number, newB: number) => {
    const updatedHistory = [...history.computer]
    updatedHistory[index].result = { A: newA, B: newB }
    
    setHistory(prev => ({ ...prev, computer: updatedHistory }))
    recalculatePossibleNumbers(updatedHistory.slice(0, index + 1))
    completeCorrection()
    switchToPlayer()
    clearMessage()
  }, [history.computer, recalculatePossibleNumbers, completeCorrection, switchToPlayer, clearMessage])

  // Cancel correction
  const cancelFeedbackCorrection = useCallback(() => {
    cancelCorrection()
    clearMessage()
  }, [cancelCorrection, clearMessage])

  // Handle hint check
  const handleHintCheck = useCallback((): void => {
    if (gameState.hintsRemaining <= 0) {
      setMessage(t('noHintsRemaining'), MessageType.INFO)
      return
    }

    const validation = validateNumber(gameState.playerGuess)
    if (!validation.valid) {
      setMessage(t(validation.message || ''), MessageType.INFO)
      return
    }

    // Don't allow hint check if no previous guesses exist
    if (history.player.length === 0) {
      setMessage(t('hintButtonTooltip'), MessageType.INFO)
      return
    }

    // Check if current guess is in the player's possible numbers pool (based on player's previous guesses)
    const playerPossibleTargets = calculatePossibleTargets(history.player)
    const isConsistent = playerPossibleTargets.includes(gameState.playerGuess)

    consumeHint()
    
    if (isConsistent) {
      setMessage(t('hintConsistent'), MessageType.SUCCESS)
    } else {
      setMessage(t('hintInconsistent'), MessageType.INFO)
    }
  }, [gameState.playerGuess, gameState.hintsRemaining, history.player, setMessage, consumeHint, t])

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
    updatePlayerFeedback: updateFeedback,
    getMessageType,
    startFeedbackCorrection,
    resetGame,
    correctHistoryFeedback,
    cancelFeedbackCorrection,
    handleHintCheck,
    
    // Constants
    GAME_CONFIG,
    MESSAGE_TYPES: {
      SUCCESS: 'success',
      COMPLAINT: 'complaint', 
      INFO: 'info'
    }
  }
}
