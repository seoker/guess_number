import { useState, useEffect } from 'react'
import { SavedGameRecord } from '../types'

export const useGameRecords = () => {
  const [gameRecords, setGameRecords] = useState<SavedGameRecord[]>([])

  // Load records from localStorage
  const loadRecords = (): SavedGameRecord[] => {
    try {
      const saved = localStorage.getItem('guessNumberGameRecords')
      if (saved) {
        return JSON.parse(saved) as SavedGameRecord[]
      }
    } catch (error) {
      console.error('Failed to load game records:', error)
    }
    return []
  }

  // Save records to localStorage
  const saveRecords = (records: SavedGameRecord[]): void => {
    try {
      localStorage.setItem('guessNumberGameRecords', JSON.stringify(records))
    } catch (error) {
      console.error('Failed to save game records:', error)
    }
  }

  // Add new game record
  const addGameRecord = (record: Omit<SavedGameRecord, 'id' | 'timestamp'>): void => {
    const newRecord: SavedGameRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...record
    }
    
    const updatedRecords = [newRecord, ...gameRecords]
    setGameRecords(updatedRecords)
    saveRecords(updatedRecords)
  }

  // Clear all records
  const clearAllRecords = (): void => {
    setGameRecords([])
    localStorage.removeItem('guessNumberGameRecords')
  }

  // Load records on initialization
  useEffect(() => {
    setGameRecords(loadRecords())
  }, [])

  return {
    gameRecords,
    addGameRecord,
    clearAllRecords
  }
}
