import { useState, useEffect, useCallback } from 'react'
import { i18nConfig, getAllComplaintKeywords } from '../i18n/config'

// 遊戲配置
const GAME_CONFIG = {
  DIGIT_COUNT: 4,
  MAX_DIGIT: 10,
  COMPUTER_THINKING_TIME: 1000
}

export const useGameLogic = (t, addGameRecord) => {
  // 遊戲狀態
  const [gameState, setGameState] = useState({
    computerTarget: '',
    playerGuess: '',
    message: '',
    playerAttempts: 0,
    computerAttempts: 0,
    gameWon: false,
    gameStarted: false,
    currentTurn: 'player' // 改為從玩家開始
  })

  // 歷史記錄
  const [history, setHistory] = useState({
    player: [],
    computer: []
  })

  // 電腦AI狀態
  const [computerAI, setComputerAI] = useState({
    possibleNumbers: [],
    currentGuess: '',
    playerFeedback: { A: '', B: '' },
    showFeedbackForm: false
  })

  // 生成四位不重複的數字
  const generateTargetNumber = useCallback(() => {
    const digits = []
    while (digits.length < GAME_CONFIG.DIGIT_COUNT) {
      const digit = Math.floor(Math.random() * GAME_CONFIG.MAX_DIGIT)
      if (!digits.includes(digit)) {
        digits.push(digit)
      }
    }
    return digits.join('')
  }, [])

  // 初始化電腦可能的數字列表
  const initializeComputerPossibleNumbers = useCallback(() => {
    const numbers = []
    for (let i = 0; i < 10000; i++) {
      const num = i.toString().padStart(GAME_CONFIG.DIGIT_COUNT, '0')
      const digits = num.split('')
      if (new Set(digits).size === GAME_CONFIG.DIGIT_COUNT) {
        numbers.push(num)
      }
    }
    return numbers
  }, [])

  // 驗證數字格式
  const validateNumber = useCallback((number) => {
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

  // 驗證A和B值
  const validateFeedback = useCallback((A, B) => {
    if (A < 0 || A > GAME_CONFIG.DIGIT_COUNT || B < 0 || B > GAME_CONFIG.DIGIT_COUNT || A + B > GAME_CONFIG.DIGIT_COUNT) {
      return { valid: false, message: t('invalidFeedback') }
    }
    return { valid: true }
  }, [t])

  // 計算幾A幾B
  const calculateAB = useCallback((guess, target) => {
    let A = 0
    let B = 0
    const guessDigits = guess.split('')
    const targetDigits = target.split('')

    // 計算A（位置和數字都對）
    for (let i = 0; i < GAME_CONFIG.DIGIT_COUNT; i++) {
      if (guessDigits[i] === targetDigits[i]) {
        A++
      }
    }

    // 計算B（數字對但位置不對）
    for (let i = 0; i < GAME_CONFIG.DIGIT_COUNT; i++) {
      if (targetDigits.includes(guessDigits[i]) && guessDigits[i] !== targetDigits[i]) {
        B++
      }
    }

    return { A, B }
  }, [])

  // 電腦推理下一個猜測
  const computerMakeGuess = useCallback(() => {
    if (computerAI.possibleNumbers.length === 0) {
      return generateTargetNumber()
    }
    
    const randomIndex = Math.floor(Math.random() * computerAI.possibleNumbers.length)
    return computerAI.possibleNumbers[randomIndex]
  }, [computerAI.possibleNumbers, generateTargetNumber])

  // 根據提示更新電腦可能的數字
  const updateComputerPossibleNumbers = useCallback((guess, result) => {
    const newPossibleNumbers = computerAI.possibleNumbers.filter(num => {
      const { A, B } = calculateAB(guess, num)
      return `${A}A${B}B` === result
    })
    setComputerAI(prev => ({ ...prev, possibleNumbers: newPossibleNumbers }))
    return newPossibleNumbers
  }, [computerAI.possibleNumbers, calculateAB])

  // 檢查提示是否合理
  const checkFeedbackConsistency = useCallback((guess, feedback) => {
    const { A, B } = feedback
    const result = `${A}A${B}B`
    
    const possibleNumbers = computerAI.possibleNumbers.filter(num => {
      const calculatedAB = calculateAB(guess, num)
      return `${calculatedAB.A}A${calculatedAB.B}B` === result
    })
    
    return possibleNumbers.length > 0
  }, [computerAI.possibleNumbers, calculateAB])

  // 生成電腦抱怨訊息
  const generateComplaint = useCallback((guess, feedback) => {
    const complaints = [
      t('complaints.inconsistent', { guess, feedback: `${feedback.A}A${feedback.B}B` }),
      t('complaints.unreasonable', { guess, feedback: `${feedback.A}A${feedback.B}B` }),
      t('complaints.joking', { guess, feedback: `${feedback.A}A${feedback.B}B` }),
      t('complaints.problematic', { guess, feedback: `${feedback.A}A${feedback.B}B` }),
      t('complaints.wrong', { guess, feedback: `${feedback.A}A${feedback.B}B` })
    ]
    
    return complaints[Math.floor(Math.random() * complaints.length)]
  }, [t])

  // 判斷訊息類型
  const getMessageType = useCallback((message) => {
    if (gameState.gameWon) return i18nConfig.messageTypes.SUCCESS
    if (getAllComplaintKeywords().some(keyword => message.includes(keyword))) {
      return i18nConfig.messageTypes.COMPLAINT
    }
    return i18nConfig.messageTypes.INFO
  }, [gameState.gameWon])

  // 開始新遊戲
  const startNewGame = useCallback(() => {
    setGameState({
      computerTarget: generateTargetNumber(),
      playerGuess: '',
      message: '',
      playerAttempts: 0,
      computerAttempts: 0,
      gameWon: false,
      gameStarted: true,
      currentTurn: 'player' // 從玩家開始
    })
    
    setHistory({ player: [], computer: [] })
    
    setComputerAI({
      possibleNumbers: initializeComputerPossibleNumbers(),
      currentGuess: '',
      playerFeedback: { A: '', B: '' },
      showFeedbackForm: false
    })
  }, [generateTargetNumber, initializeComputerPossibleNumbers])

  // 處理玩家猜測
  const handlePlayerGuess = useCallback(() => {
    const validation = validateNumber(gameState.playerGuess)
    if (!validation.valid) {
      setGameState(prev => ({ ...prev, message: validation.message }))
      return
    }

    setGameState(prev => ({ 
      ...prev,
      playerAttempts: prev.playerAttempts + 1,
      message: ''
    }))

    if (gameState.playerGuess === gameState.computerTarget) {
      setGameState(prev => ({ 
        ...prev,
        message: t('playerWon'),
        gameWon: true 
      }))
      setHistory(prev => ({
        ...prev,
        player: [...prev.player, { 
          guess: gameState.playerGuess, 
          result: '4A0B', 
          isCorrect: true 
        }]
      }))
      
      // 保存遊戲記錄
      if (addGameRecord) {
        addGameRecord({
          winner: 'player',
          playerAttempts: gameState.playerAttempts + 1,
          computerAttempts: gameState.computerAttempts,
          totalRounds: gameState.playerAttempts + 1 + gameState.computerAttempts
        })
      }
    } else {
      const { A, B } = calculateAB(gameState.playerGuess, gameState.computerTarget)
      const result = `${A}A${B}B`
      setGameState(prev => ({ 
        ...prev,
        message: `${t('yourHint')}${result}`,
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
      
      // 觸發電腦回合
      setTimeout(() => {
        const computerGuessNum = computerMakeGuess()
        setComputerAI(prev => ({ 
          ...prev,
          currentGuess: computerGuessNum,
          showFeedbackForm: true 
        }))
        setGameState(prev => ({ 
          ...prev,
          message: t('computerThinking', { guess: computerGuessNum })
        }))
      }, GAME_CONFIG.COMPUTER_THINKING_TIME)
    }
  }, [gameState.playerGuess, gameState.computerTarget, validateNumber, calculateAB, computerMakeGuess, t])

  // 處理玩家反饋
  const handleFeedbackSubmit = useCallback(() => {
    const A = parseInt(computerAI.playerFeedback.A) || 0
    const B = parseInt(computerAI.playerFeedback.B) || 0
    
    const validation = validateFeedback(A, B)
    if (!validation.valid) {
      setGameState(prev => ({ ...prev, message: validation.message }))
      return
    }

    const feedback = { A, B }
    
    // 檢查提示是否合理
    if (!checkFeedbackConsistency(computerAI.currentGuess, feedback)) {
      const complaint = generateComplaint(computerAI.currentGuess, feedback)
      setGameState(prev => ({ ...prev, message: complaint }))
      return
    }

    const result = `${A}A${B}B`
    
    setHistory(prev => ({
      ...prev,
      computer: [...prev.computer, { 
        guess: computerAI.currentGuess, 
        result, 
        isCorrect: A === GAME_CONFIG.DIGIT_COUNT 
      }]
    }))
    
    if (A === GAME_CONFIG.DIGIT_COUNT) {
      setGameState(prev => ({ 
        ...prev,
        gameWon: true,
        message: t('computerWon', { computerNumber: prev.computerTarget })
      }))
      
      // 保存遊戲記錄
      if (addGameRecord) {
        addGameRecord({
          winner: 'computer',
          playerAttempts: gameState.playerAttempts,
          computerAttempts: gameState.computerAttempts + 1,
          totalRounds: gameState.playerAttempts + gameState.computerAttempts + 1
        })
      }
    } else {
      const remainingNumbers = updateComputerPossibleNumbers(computerAI.currentGuess, result)
      if (remainingNumbers.length === 0) {
        setGameState(prev => ({ 
          ...prev,
          message: t('noPossibleNumbers')
        }))
        return
      }
      setGameState(prev => ({ 
        ...prev,
        computerAttempts: prev.computerAttempts + 1,
        currentTurn: 'player',
        message: ''
      }))
    }
    
    // 重置電腦AI狀態
    setComputerAI(prev => ({
      ...prev,
      showFeedbackForm: false,
      playerFeedback: { A: '', B: '' }
    }))
  }, [computerAI.playerFeedback, computerAI.currentGuess, validateFeedback, checkFeedbackConsistency, generateComplaint, updateComputerPossibleNumbers, t])

  // 更新玩家猜測
  const updatePlayerGuess = useCallback((guess) => {
    setGameState(prev => ({ ...prev, playerGuess: guess }))
  }, [])

  // 更新玩家反饋
  const updatePlayerFeedback = useCallback((type, value) => {
    setComputerAI(prev => ({
      ...prev,
      playerFeedback: { ...prev.playerFeedback, [type]: value }
    }))
  }, [])

  // 初始化遊戲
  useEffect(() => {
    if (gameState.gameStarted && !gameState.computerTarget) {
      setGameState(prev => ({ ...prev, computerTarget: generateTargetNumber() }))
      setComputerAI(prev => ({ ...prev, possibleNumbers: initializeComputerPossibleNumbers() }))
    }
  }, [gameState.gameStarted, gameState.computerTarget, generateTargetNumber, initializeComputerPossibleNumbers])

  return {
    // 狀態
    gameState,
    history,
    computerAI,
    
    // 方法
    startNewGame,
    handlePlayerGuess,
    handleFeedbackSubmit,
    updatePlayerGuess,
    updatePlayerFeedback,
    getMessageType,
    
    // 常數
    GAME_CONFIG,
    MESSAGE_TYPES: i18nConfig.messageTypes
  }
}
