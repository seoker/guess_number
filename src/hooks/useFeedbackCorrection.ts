import { useState, useCallback } from 'react'
import { FeedbackCorrection } from '../types'

export const useFeedbackCorrection = () => {
  const [feedbackCorrection, setFeedbackCorrection] = useState<FeedbackCorrection>({
    isActive: false,
    showHistory: false
  })

  const startCorrection = useCallback(() => {
    setFeedbackCorrection(prev => ({ ...prev, isActive: true }))
  }, [])

  const showHistory = useCallback(() => {
    setFeedbackCorrection(prev => ({ ...prev, showHistory: true }))
  }, [])

  const cancelCorrection = useCallback(() => {
    setFeedbackCorrection({ isActive: false, showHistory: false })
  }, [])

  const completeCorrection = useCallback(() => {
    setFeedbackCorrection({ isActive: false, showHistory: false })
  }, [])

  return {
    feedbackCorrection,
    startCorrection,
    showHistory,
    cancelCorrection,
    completeCorrection
  }
}