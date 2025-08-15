import { useState, useCallback } from 'react'
import { ComputerAI, GuessResult } from '../types'
import { GuessRecord } from '../types'
import { 
  generateAllPossibleNumbers, 
  makeComputerGuess, 
  updatePossibleNumbers,
  checkFeedbackConsistency,
  calculatePossibleTargets
} from '../utils/gameUtils'

export const useComputerAI = () => {
  const [computerAI, setComputerAI] = useState<ComputerAI>({
    possibleNumbers: [],
    currentGuess: '',
    playerFeedback: { A: 0, B: 0 },
    showFeedbackForm: false
  })

  const initializeAI = useCallback(() => {
    setComputerAI({
      possibleNumbers: generateAllPossibleNumbers(),
      currentGuess: '',
      playerFeedback: { A: 0, B: 0 },
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
    const numValue = parseInt(value) || 0
    setComputerAI(prev => ({
      ...prev,
      playerFeedback: { ...prev.playerFeedback, [type]: numValue }
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
      playerFeedback: { A: 0, B: 0 }
    }))
    
    return newPossibleNumbers
  }, [computerAI.currentGuess, computerAI.possibleNumbers])

  const checkFeedbackIsConsistent = useCallback((feedback: GuessResult): boolean => {
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
      playerFeedback: { A: 0, B: 0 }
    }))
  }, [])

  const recalculatePossibleNumbers = useCallback((history: GuessRecord[]) => {
    const possibleNumbers = calculatePossibleTargets(history)
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