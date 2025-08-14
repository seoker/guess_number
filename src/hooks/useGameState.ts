import { useReducer, useCallback } from 'react'
import { GameState, MessageType, CurrentTurn } from '../types'
import { generateTargetNumber } from '../utils/gameUtils'

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_PLAYER_GUESS'; payload: string }
  | { type: 'SET_MESSAGE'; payload: { message: string; messageType: MessageType } }
  | { type: 'CLEAR_MESSAGE' }
  | { type: 'PLAYER_TURN_SUCCESS'; payload: { attempts: number; result: string } }
  | { type: 'PLAYER_WINS'; payload: number }
  | { type: 'COMPUTER_TURN'; payload: number }
  | { type: 'COMPUTER_FINAL_TURN'; payload: number }
  | { type: 'COMPUTER_WINS'; payload: { computerAttempts: number; computerTarget: string } }
  | { type: 'GAME_DRAW'; payload: number }
  | { type: 'SWITCH_TO_PLAYER' }
  | { type: 'SWITCH_TO_COMPUTER' }

const initialState: GameState = {
  computerTarget: '',
  playerGuess: '',
  message: '',
  messageType: MessageType.INFO,
  playerAttempts: 0,
  computerAttempts: 0,
  gameWon: false,
  gameStarted: false,
  currentTurn: CurrentTurn.PLAYER
}

const gameStateReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        computerTarget: generateTargetNumber(),
        gameStarted: true,
        currentTurn: CurrentTurn.PLAYER
      }

    case 'RESET_GAME':
      return {
        ...initialState,
        computerTarget: generateTargetNumber(),
        gameStarted: true,
        currentTurn: CurrentTurn.PLAYER
      }

    case 'UPDATE_PLAYER_GUESS':
      return {
        ...state,
        playerGuess: action.payload
      }

    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.payload.message,
        messageType: action.payload.messageType
      }

    case 'CLEAR_MESSAGE':
      return {
        ...state,
        message: '',
        messageType: MessageType.INFO
      }

    case 'PLAYER_TURN_SUCCESS':
      return {
        ...state,
        playerAttempts: action.payload.attempts,
        message: action.payload.result,
        messageType: MessageType.INFO,
        currentTurn: CurrentTurn.COMPUTER,
        playerGuess: ''
      }

    case 'PLAYER_WINS':
      return {
        ...state,
        playerAttempts: action.payload,
        gameWon: true,
        message: '',
        messageType: MessageType.SUCCESS,
        playerGuess: ''
      }

    case 'COMPUTER_TURN':
      return {
        ...state,
        playerAttempts: action.payload,
        message: '',
        messageType: MessageType.INFO,
        currentTurn: CurrentTurn.COMPUTER,
        playerGuess: ''
      }

    case 'COMPUTER_FINAL_TURN':
      return {
        ...state,
        playerAttempts: action.payload,
        message: '',
        messageType: MessageType.INFO,
        currentTurn: CurrentTurn.COMPUTER,
        playerGuess: ''
      }

    case 'COMPUTER_WINS':
      return {
        ...state,
        computerAttempts: action.payload.computerAttempts,
        gameWon: true,
        message: '',
        messageType: MessageType.SUCCESS
      }

    case 'GAME_DRAW':
      return {
        ...state,
        computerAttempts: action.payload,
        gameWon: true,
        message: '',
        messageType: MessageType.SUCCESS
      }

    case 'SWITCH_TO_PLAYER':
      return {
        ...state,
        currentTurn: CurrentTurn.PLAYER,
        message: '',
        messageType: MessageType.INFO
      }

    case 'SWITCH_TO_COMPUTER':
      return {
        ...state,
        currentTurn: CurrentTurn.COMPUTER
      }

    default:
      return state
  }
}

export const useGameState = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialState)

  const startNewGame = useCallback(() => {
    dispatch({ type: 'START_GAME' })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [])

  const updatePlayerGuess = useCallback((guess: string) => {
    dispatch({ type: 'UPDATE_PLAYER_GUESS', payload: guess })
  }, [])

  const setMessage = useCallback((message: string, messageType: MessageType = MessageType.INFO) => {
    dispatch({ type: 'SET_MESSAGE', payload: { message, messageType } })
  }, [])

  const clearMessage = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGE' })
  }, [])

  const playerTurnSuccess = useCallback((attempts: number, result: string) => {
    dispatch({ type: 'PLAYER_TURN_SUCCESS', payload: { attempts, result } })
  }, [])

  const playerWins = useCallback((attempts: number) => {
    dispatch({ type: 'PLAYER_WINS', payload: attempts })
  }, [])

  const computerTurn = useCallback((playerAttempts: number) => {
    dispatch({ type: 'COMPUTER_TURN', payload: playerAttempts })
  }, [])

  const computerFinalTurn = useCallback((playerAttempts: number) => {
    dispatch({ type: 'COMPUTER_FINAL_TURN', payload: playerAttempts })
  }, [])

  const computerWins = useCallback((computerAttempts: number, computerTarget: string) => {
    dispatch({ type: 'COMPUTER_WINS', payload: { computerAttempts, computerTarget } })
  }, [])

  const gameDraw = useCallback((computerAttempts: number) => {
    dispatch({ type: 'GAME_DRAW', payload: computerAttempts })
  }, [])

  const switchToPlayer = useCallback(() => {
    dispatch({ type: 'SWITCH_TO_PLAYER' })
  }, [])

  const switchToComputer = useCallback(() => {
    dispatch({ type: 'SWITCH_TO_COMPUTER' })
  }, [])

  return {
    gameState,
    startNewGame,
    resetGame,
    updatePlayerGuess,
    setMessage,
    clearMessage,
    playerTurnSuccess,
    playerWins,
    computerTurn,
    computerFinalTurn,
    computerWins,
    gameDraw,
    switchToPlayer,
    switchToComputer
  }
}