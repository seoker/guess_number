import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('i18n configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should initialize i18next with correct configuration', async () => {
    // Mock i18next modules
    const mockInit = vi.fn()
    const mockUse = vi.fn(() => ({ use: mockUse, init: mockInit }))

    vi.doMock('i18next', () => ({
      default: {
        use: mockUse,
        init: mockInit
      }
    }))

    vi.doMock('react-i18next', () => ({
      initReactI18next: 'initReactI18next'
    }))

    vi.doMock('i18next-browser-languagedetector', () => ({
      default: 'LanguageDetector'
    }))

    // Mock translation files
    vi.doMock('../../src/i18n/locales/zh.json', () => ({
      default: { 'test.key': 'Chinese' }
    }))

    vi.doMock('../../src/i18n/locales/en.json', () => ({
      default: { 'test.key': 'English' }
    }))

    vi.doMock('../../src/i18n/locales/ja.json', () => ({
      default: { 'test.key': 'Japanese' }
    }))

    // Import the i18n configuration
    await import('../../src/i18n/i18n.ts')

    // Verify the plugins were used
    expect(mockUse).toHaveBeenCalledWith('LanguageDetector')
    expect(mockUse).toHaveBeenCalledWith('initReactI18next')

    // Verify init was called
    expect(mockInit).toHaveBeenCalled()
    
    // Check that the configuration structure is correct
    if (mockInit.mock.calls.length > 0) {
      const initConfig = mockInit.mock.calls[0][0]
      expect(initConfig).toBeDefined()
      expect(initConfig.fallbackLng).toBe('zh')
      expect(initConfig.debug).toBe(false)
    }
  })

  it('should have resources for all supported languages', async () => {
    // Mock i18next modules
    const mockInit = vi.fn()
    const mockUse = vi.fn(() => ({ use: mockUse, init: mockInit }))

    vi.doMock('i18next', () => ({
      default: {
        use: mockUse,
        init: mockInit
      }
    }))

    vi.doMock('react-i18next', () => ({
      initReactI18next: 'initReactI18next'
    }))

    vi.doMock('i18next-browser-languagedetector', () => ({
      default: 'LanguageDetector'
    }))

    // Mock translation files
    vi.doMock('../../src/i18n/locales/zh.json', () => ({
      default: { 'test.key': 'Chinese' }
    }))

    vi.doMock('../../src/i18n/locales/en.json', () => ({
      default: { 'test.key': 'English' }
    }))

    vi.doMock('../../src/i18n/locales/ja.json', () => ({
      default: { 'test.key': 'Japanese' }
    }))

    await import('../../src/i18n/i18n.ts')

    // Verify that init was called with resources
    expect(mockInit).toHaveBeenCalled()
    if (mockInit.mock.calls.length > 0) {
      const initConfig = mockInit.mock.calls[0][0]
      expect(initConfig.resources).toBeDefined()
    }
  })

  it('should export i18n instance', async () => {
    // Mock i18next modules
    const mockInit = vi.fn()
    const mockUse = vi.fn(() => ({ use: mockUse, init: mockInit }))

    vi.doMock('i18next', () => ({
      default: {
        use: mockUse,
        init: mockInit
      }
    }))

    vi.doMock('react-i18next', () => ({
      initReactI18next: 'initReactI18next'
    }))

    vi.doMock('i18next-browser-languagedetector', () => ({
      default: 'LanguageDetector'
    }))

    // Mock translation files
    vi.doMock('../../src/i18n/locales/zh.json', () => ({
      default: { 'test.key': 'Chinese' }
    }))

    vi.doMock('../../src/i18n/locales/en.json', () => ({
      default: { 'test.key': 'English' }
    }))

    vi.doMock('../../src/i18n/locales/ja.json', () => ({
      default: { 'test.key': 'Japanese' }
    }))

    const i18nModule = await import('../../src/i18n/i18n.ts')
    
    // Should export the i18n instance as default
    expect(i18nModule.default).toBeDefined()
  })

  it('should configure i18n properly', async () => {
    // Mock i18next modules
    const mockInit = vi.fn()
    const mockUse = vi.fn(() => ({ use: mockUse, init: mockInit }))

    vi.doMock('i18next', () => ({
      default: {
        use: mockUse,
        init: mockInit
      }
    }))

    vi.doMock('react-i18next', () => ({
      initReactI18next: 'initReactI18next'
    }))

    vi.doMock('i18next-browser-languagedetector', () => ({
      default: 'LanguageDetector'
    }))

    // Mock translation files
    vi.doMock('../../src/i18n/locales/zh.json', () => ({
      default: { 'test.key': 'Chinese' }
    }))

    vi.doMock('../../src/i18n/locales/en.json', () => ({
      default: { 'test.key': 'English' }
    }))

    vi.doMock('../../src/i18n/locales/ja.json', () => ({
      default: { 'test.key': 'Japanese' }
    }))

    await import('../../src/i18n/i18n.ts')

    // Verify basic setup was called
    expect(mockUse).toHaveBeenCalled()
    expect(mockInit).toHaveBeenCalled()
  })
})
