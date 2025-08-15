import { useState, useEffect } from 'react'
import { SavedGameRecord } from '../types'

export const useGameRecords = () => {
  const [gameRecords, setGameRecords] = useState<SavedGameRecord[]>([])

  // Load records from localStorage, validating structure and discarding incompatible data
  const loadRecords = (): SavedGameRecord[] => {
    try {
      const saved = localStorage.getItem('guessNumberGameRecords')
      if (saved) {
        const parsed = JSON.parse(saved)
        
        // Validate the data structure - discard if incompatible
        if (Array.isArray(parsed)) {
          const validRecords = parsed.filter(record => {
            // Check if record has required structure
            if (!record || typeof record !== 'object') return false
            
            // Check if playerHistory and computerHistory exist and are arrays
            if (!Array.isArray(record.playerHistory) || !Array.isArray(record.computerHistory)) return false
            
            // Check if history records have the new structure (result as object with A/B)
            const hasValidHistory = record.playerHistory.every((hist: any) => 
              hist && typeof hist === 'object' && 
              hist.result && typeof hist.result === 'object' &&
              typeof hist.result.A === 'number' && typeof hist.result.B === 'number'
            ) && record.computerHistory.every((hist: any) => 
              hist && typeof hist === 'object' && 
              hist.result && typeof hist.result === 'object' &&
              typeof hist.result.A === 'number' && typeof hist.result.B === 'number'
            )
            
            return hasValidHistory
          })
          
          // If we filtered out some records, save the cleaned version
          if (validRecords.length !== parsed.length) {
            console.log(`Discarded ${parsed.length - validRecords.length} incompatible game records`)
            localStorage.setItem('guessNumberGameRecords', JSON.stringify(validRecords))
          }
          
          return validRecords as SavedGameRecord[]
        }
      }
    } catch (error) {
      console.error('Failed to load game records:', error)
      // Clear corrupted data
      localStorage.removeItem('guessNumberGameRecords')
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
