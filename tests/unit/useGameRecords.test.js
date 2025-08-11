import { renderHook, act } from '@testing-library/react'
import { useGameRecords } from '../../src/hooks/useGameRecords'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('useGameRecords', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  test('should initialize with empty records', () => {
    const { result } = renderHook(() => useGameRecords())
    
    expect(result.current.gameRecords).toEqual([])
  })

  test('should load existing records from localStorage', () => {
    const mockRecords = [
      { id: 1, winner: 'player', playerAttempts: 5, computerAttempts: 3, totalRounds: 8 }
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecords))
    
    const { result } = renderHook(() => useGameRecords())
    
    expect(result.current.gameRecords).toEqual(mockRecords)
  })

  test('should add new game record', () => {
    const { result } = renderHook(() => useGameRecords())
    
    const newRecord = {
      winner: 'computer',
      playerAttempts: 4,
      computerAttempts: 6,
      totalRounds: 10
    }
    
    act(() => {
      result.current.addGameRecord(newRecord)
    })
    
    expect(result.current.gameRecords).toHaveLength(1)
    expect(result.current.gameRecords[0]).toMatchObject(newRecord)
    expect(result.current.gameRecords[0]).toHaveProperty('id')
    expect(result.current.gameRecords[0]).toHaveProperty('timestamp')
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  test('should clear all records', () => {
    const { result } = renderHook(() => useGameRecords())
    
    // First add a record
    act(() => {
      result.current.addGameRecord({
        winner: 'player',
        playerAttempts: 3,
        computerAttempts: 2,
        totalRounds: 5
      })
    })
    
    expect(result.current.gameRecords).toHaveLength(1)
    
    // Then clear all records
    act(() => {
      result.current.clearAllRecords()
    })
    
    expect(result.current.gameRecords).toEqual([])
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('guessNumberGameRecords')
  })

  test('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error')
    })
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const { result } = renderHook(() => useGameRecords())
    
    act(() => {
      result.current.addGameRecord({
        winner: 'player',
        playerAttempts: 2,
        computerAttempts: 1,
        totalRounds: 3
      })
    })
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to save game records:', expect.any(Error))
    consoleSpy.mockRestore()
  })
})
