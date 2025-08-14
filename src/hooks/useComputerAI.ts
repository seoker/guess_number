import { useState, useCallback } from 'react'
import { ComputerAI, GameResult } from '../types'
import { 
  generateAllPossibleNumbers, 
  makeComputerGuess, 
  updatePossibleNumbers,
  checkFeedbackConsistency,
  calculateAB 
} from '../utils/gameUtils'

export const useComputerAI = () => {
  const [computerAI, setComputerAI] = useState<ComputerAI>({
    possibleNumbers: [],
    currentGuess: '',
    playerFeedback: { A: '', B: '' },
    showFeedbackForm: false
  })

  const initializeAI = useCallback(() => {
    setComputerAI({
      possibleNumbers: generateAllPossibleNumbers(),
      currentGuess: '',
      playerFeedback: { A: '', B: '' },
      showFeedbackForm: false
    })
  }, [])

  const makeGuess = useCallback((): string => {
    const guess = makeComputerGuess(computerAI.possibleNumbers)
    setComputerAI(prev => ({
      ...prev,
      currentGuess: guess,
      showFeedbackForm: true
    }))
    return guess
  }, [computerAI.possibleNumbers])

  const updateFeedback = useCallback((type: 'A' | 'B', value: string) => {
    setComputerAI(prev => ({
      ...prev,
      playerFeedback: { ...prev.playerFeedback, [type]: value }
    }))
  }, [])

  const processFeedback = useCallback((result: string): string[] => {
    const newPossibleNumbers = updatePossibleNumbers(
      computerAI.currentGuess, 
      result, 
      computerAI.possibleNumbers
    )
    
    setComputerAI(prev => ({
      ...prev,
      possibleNumbers: newPossibleNumbers,
      showFeedbackForm: false,
      playerFeedback: { A: '', B: '' }
    }))
    
    return newPossibleNumbers
  }, [computerAI.currentGuess, computerAI.possibleNumbers])

  const checkFeedbackIsConsistent = useCallback((feedback: GameResult): boolean => {
    return checkFeedbackConsistency(
      computerAI.currentGuess, 
      feedback, 
      computerAI.possibleNumbers
    )
  }, [computerAI.currentGuess, computerAI.possibleNumbers])

  const resetFeedbackForm = useCallback(() => {
    setComputerAI(prev => ({
      ...prev,
      showFeedbackForm: false,
      playerFeedback: { A: '', B: '' }
    }))
  }, [])

  const recalculatePossibleNumbers = useCallback((history: Array<{ guess: string; result: string }>) => {
    let possibleNumbers = generateAllPossibleNumbers()
    
    for (const record of history) {
      possibleNumbers = possibleNumbers.filter(num => {
        const { A, B } = calculateAB(record.guess, num)
        return `${A}A${B}B` === record.result
      })
    }
    
    setComputerAI(prev => ({ ...prev, possibleNumbers }))
    return possibleNumbers
  }, [])

  return {
    computerAI,
    initializeAI,
    makeGuess,
    updateFeedback,
    processFeedback,
    checkFeedbackIsConsistent,
    resetFeedbackForm,
    recalculatePossibleNumbers
  }
}