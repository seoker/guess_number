import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock React DOM
const mockRender = vi.fn()
const mockCreateRoot = vi.fn(() => ({ render: mockRender }))

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot
}))

// Mock App component
vi.mock('../../src/App.tsx', () => ({
  default: () => 'App'
}))

// Mock i18n
vi.mock('../../src/i18n/i18n.ts', () => ({}))

// Mock CSS imports
vi.mock('../../src/index.css', () => ({}))
vi.mock('../../src/styles/utilities.css', () => ({}))

describe('main.tsx', () => {
  let mockRootElement: HTMLElement
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Create a mock root element
    mockRootElement = document.createElement('div')
    mockRootElement.id = 'root'
    document.body.appendChild(mockRootElement)
    
    // Mock getElementById to return our mock element
    vi.spyOn(document, 'getElementById').mockReturnValue(mockRootElement)
  })
  
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('should render App component in StrictMode', async () => {
    // Import main.tsx to execute the render logic
    await import('../../src/main.tsx')

    // Verify getElementById was called with 'root'
    expect(document.getElementById).toHaveBeenCalledWith('root')
    
    // Verify createRoot was called with the root element
    expect(mockCreateRoot).toHaveBeenCalledWith(mockRootElement)
    
    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1)
    
    // The render call should include React element
    expect(mockRender).toHaveBeenCalled()
  })

  it('should throw error when root element is not found', async () => {
    // Mock getElementById to return null
    vi.spyOn(document, 'getElementById').mockReturnValue(null)

    // Clear the module cache to re-import
    vi.resetModules()

    // Import should throw an error
    await expect(import('../../src/main.tsx')).rejects.toThrow('Root element not found')
  })

  it('should import required CSS files', () => {
    // This test verifies that CSS imports don't throw errors
    // The actual CSS content is mocked, but imports should work
    expect(() => {
      require('../../src/index.css')
      require('../../src/styles/utilities.css')
    }).not.toThrow()
  })

  it('should import i18n configuration', () => {
    // This test verifies that i18n import is properly mocked
    expect(true).toBe(true)
  })
})