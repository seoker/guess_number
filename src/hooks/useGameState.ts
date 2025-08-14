import { useReducer, useCallback } from 'react'
import { GameState, MessageType, CurrentTurn } from '../types'
import { generateTargetNumber } from '../utils/gameUtils'

enum GameActionType {
  START_GAME = 'START_GAME',
  RESET_GAME = 'RESET_GAME',
  UPDATE_PLAYER_GUESS = 'UPDATE_PLAYER_GUESS',
  SET_MESSAGE = 'SET_MESSAGE',
  CLEAR_MESSAGE = 'CLEAR_MESSAGE',
  PLAYER_TURN_SUCCESS = 'PLAYER_TURN_SUCCESS',
  PLAYER_WINS = 'PLAYER_WINS',
  PLAYER_WINS_WITH_COMPUTER_ATTEMPTS = 'PLAYER_WINS_WITH_COMPUTER_ATTEMPTS',
  COMPUTER_TURN = 'COMPUTER_TURN',
  COMPUTER_FINAL_TURN = 'COMPUTER_FINAL_TURN',
  COMPUTER_WINS = 'COMPUTER_WINS',
  GAME_DRAW = 'GAME_DRAW',
  SWITCH_TO_PLAYER = 'SWITCH_TO_PLAYER',
  SWITCH_TO_COMPUTER = 'SWITCH_TO_COMPUTER'
}

type GameAction =
  | { type: GameActionType.START_GAME }
  | { type: GameActionType.RESET_GAME }
  | { type: GameActionType.UPDATE_PLAYER_GUESS; payload: string }
  | { type: GameActionType.SET_MESSAGE; payload: { message: string; messageType: MessageType } }
  | { type: GameActionType.CLEAR_MESSAGE }
  | { type: GameActionType.PLAYER_TURN_SUCCESS; payload: { attempts: number; result: string } }
  | { type: GameActionType.PLAYER_WINS; payload: number }
  | { type: GameActionType.PLAYER_WINS_WITH_COMPUTER_ATTEMPTS; payload: { playerAttempts: number; computerAttempts: number } }
  | { type: GameActionType.COMPUTER_TURN; payload: number }
  | { type: GameActionType.COMPUTER_FINAL_TURN; payload: number }
  | { type: GameActionType.COMPUTER_WINS; payload: { computerAttempts: number; computerTarget: string } }
  | { type: GameActionType.GAME_DRAW; payload: number }
  | { type: GameActionType.SWITCH_TO_PLAYER }
  | { type: GameActionType.SWITCH_TO_COMPUTER }

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
    case GameActionType.START_GAME:
      return {
        ...initialState,
        computerTarget: generateTargetNumber(),
        gameStarted: true,
        currentTurn: CurrentTurn.PLAYER
      }

    case GameActionType.RESET_GAME:
      return {
        ...initialState,
        computerTarget: generateTargetNumber(),
        gameStarted: true,
        currentTurn: CurrentTurn.PLAYER
      }

    case GameActionType.UPDATE_PLAYER_GUESS:
      return {
        ...state,
        playerGuess: action.payload
      }

    case GameActionType.SET_MESSAGE:
      return {
        ...state,
        message: action.payload.message,
        messageType: action.payload.messageType
      }

    case GameActionType.CLEAR_MESSAGE:
      return {
        ...state,
        message: '',
        messageType: MessageType.INFO
      }

    case GameActionType.PLAYER_TURN_SUCCESS:
      return {
        ...state,
        playerAttempts: action.payload.attempts,
        message: action.payload.result,
        messageType: MessageType.INFO,
        currentTurn: CurrentTurn.COMPUTER,
        playerGuess: ''
      }

    case GameActionType.PLAYER_WINS:
      return {
        ...state,
        playerAttempts: action.payload,
        gameWon: true,
        message: '',
        messageType: MessageType.SUCCESS,
        playerGuess: ''
      }

    case GameActionType.PLAYER_WINS_WITH_COMPUTER_ATTEMPTS:
      return {
        ...state,
        playerAttempts: action.payload.playerAttempts,
        computerAttempts: action.payload.computerAttempts,
        gameWon: true,
        message: '',
        messageType: MessageType.SUCCESS,
        playerGuess: ''
      }

    case GameActionType.COMPUTER_TURN:
      return {
        ...state,
        playerAttempts: action.payload,
        message: '',
        messageType: MessageType.INFO,
        currentTurn: CurrentTurn.COMPUTER,
        playerGuess: ''
      }

    case GameActionType.COMPUTER_FINAL_TURN:
      return {
        ...state,
        playerAttempts: action.payload,
        message: '',
        messageType: MessageType.INFO,
        currentTurn: CurrentTurn.COMPUTER,
        playerGuess: ''
      }

    case GameActionType.COMPUTER_WINS:
      return {
        ...state,
        computerAttempts: action.payload.computerAttempts,
        gameWon: true,
        message: '',
        messageType: MessageType.SUCCESS
      }

    case GameActionType.GAME_DRAW:
      return {
        ...state,
        computerAttempts: action.payload,
        gameWon: true,
        message: '',
        messageType: MessageType.SUCCESS
      }

    case GameActionType.SWITCH_TO_PLAYER:
      return {
        ...state,
        computerAttempts: state.computerAttempts + 1,
        currentTurn: CurrentTurn.PLAYER,
        message: '',
        messageType: MessageType.INFO
      }

    case GameActionType.SWITCH_TO_COMPUTER:
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
    dispatch({ type: GameActionType.START_GAME })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: GameActionType.RESET_GAME })
  }, [])

  const updatePlayerGuess = useCallback((guess: string) => {
    dispatch({ type: GameActionType.UPDATE_PLAYER_GUESS, payload: guess })
  }, [])

  const setMessage = useCallback((message: string, messageType: MessageType = MessageType.INFO) => {
    dispatch({ type: GameActionType.SET_MESSAGE, payload: { message, messageType } })
  }, [])

  const clearMessage = useCallback(() => {
    dispatch({ type: GameActionType.CLEAR_MESSAGE })
  }, [])

  const playerTurnSuccess = useCallback((attempts: number, result: string) => {
    dispatch({ type: GameActionType.PLAYER_TURN_SUCCESS, payload: { attempts, result } })
  }, [])

  const playerWins = useCallback((attempts: number) => {
    dispatch({ type: GameActionType.PLAYER_WINS, payload: attempts })
  }, [])

  const playerWinsWithComputerAttempts = useCallback((playerAttempts: number, computerAttempts: number) => {
    dispatch({ type: GameActionType.PLAYER_WINS_WITH_COMPUTER_ATTEMPTS, payload: { playerAttempts, computerAttempts } })
  }, [])

  const computerTurn = useCallback((playerAttempts: number) => {
    dispatch({ type: GameActionType.COMPUTER_TURN, payload: playerAttempts })
  }, [])

  const computerFinalTurn = useCallback((playerAttempts: number) => {
    dispatch({ type: GameActionType.COMPUTER_FINAL_TURN, payload: playerAttempts })
  }, [])

  const computerWins = useCallback((computerAttempts: number, computerTarget: string) => {
    dispatch({ type: GameActionType.COMPUTER_WINS, payload: { computerAttempts, computerTarget } })
  }, [])

  const gameDraw = useCallback((computerAttempts: number) => {
    dispatch({ type: GameActionType.GAME_DRAW, payload: computerAttempts })
  }, [])

  const switchToPlayer = useCallback(() => {
    dispatch({ type: GameActionType.SWITCH_TO_PLAYER })
  }, [])

  const switchToComputer = useCallback(() => {
    dispatch({ type: GameActionType.SWITCH_TO_COMPUTER })
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
    playerWinsWithComputerAttempts,
    computerTurn,
    computerFinalTurn,
    computerWins,
    gameDraw,
    switchToPlayer,
    switchToComputer
  }
}
