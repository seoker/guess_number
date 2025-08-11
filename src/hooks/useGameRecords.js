import { useState, useEffect } from 'react'

export const useGameRecords = () => {
  const [gameRecords, setGameRecords] = useState([])

  // 從 localStorage 讀取記錄
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

  // 保存記錄到 localStorage
  const saveRecords = (records) => {
    try {
      localStorage.setItem('guessNumberGameRecords', JSON.stringify(records))
    } catch (error) {
      console.error('Failed to save game records:', error)
    }
  }

  // 添加新的遊戲記錄
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

  // 清除所有記錄
  const clearAllRecords = () => {
    setGameRecords([])
    localStorage.removeItem('guessNumberGameRecords')
  }

  // 初始化時載入記錄
  useEffect(() => {
    setGameRecords(loadRecords())
  }, [])

  return {
    gameRecords,
    addGameRecord,
    clearAllRecords
  }
}
