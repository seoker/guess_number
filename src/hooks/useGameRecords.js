import { useState, useEffect } from 'react'

export const useGameRecords = () => {
  const [gameRecords, setGameRecords] = useState([])

  // Load records from localStorage
  const loadRecords = () => {
    try {
      const saved = localStorage.getItem('guessNumberGameRecords')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load game records:', error)
    }
    return []
  }

  // Save records to localStorage
  const saveRecords = (records) => {
    try {
      localStorage.setItem('guessNumberGameRecords', JSON.stringify(records))
    } catch (error) {
      console.error('Failed to save game records:', error)
    }
  }

  // Add new game record
  const addGameRecord = (record) => {
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...record
    }
    
    const updatedRecords = [newRecord, ...gameRecords]
    setGameRecords(updatedRecords)
    saveRecords(updatedRecords)
  }

  // Clear all records
  const clearAllRecords = () => {
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
