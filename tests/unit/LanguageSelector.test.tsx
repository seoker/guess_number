import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageSelector } from '../../src/components/LanguageSelector'
import { Language } from '../../src/types'

describe('LanguageSelector', () => {
  const mockLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇹🇼' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ]

  const mockChangeLanguage = vi.fn()
  const mockGetSupportedLanguages = vi.fn()
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSupportedLanguages.mockReturnValue(mockLanguages)
    user = userEvent.setup()
  })

  describe('rendering', () => {
    it('should render language selector with current language', () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      expect(screen.getByText('▼')).toBeInTheDocument()
    })

    it('should show current language name even if not in supported list', () => {
      const unsupportedLanguage = 'unknown'
      render(
        <LanguageSelector
          currentLanguage={unsupportedLanguage}
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      expect(screen.getByText(unsupportedLanguage)).toBeInTheDocument()
      expect(screen.getAllByText('🌐')).toHaveLength(2) // Label + flag icon
    })

    it('should render all flag icons correctly', async () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      // Open dropdown
      await user.click(screen.getByText('English'))

      // Check specific flag emojis
      expect(screen.getAllByText('🇺🇸')).toHaveLength(2) // Current + dropdown
      expect(screen.getByText('🇹🇼')).toBeInTheDocument()
      expect(screen.getByText('🇯🇵')).toBeInTheDocument()
      expect(screen.getByText('🇪🇸')).toBeInTheDocument()
    })

    it('should render default flag for unsupported country codes', () => {
      const unsupportedLanguages: Language[] = [
        { code: 'unsupported', name: 'Unsupported', flag: '🌐' }
      ]
      
      mockGetSupportedLanguages.mockReturnValue(unsupportedLanguages)
      
      render(
        <LanguageSelector
          currentLanguage="unsupported"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      expect(screen.getAllByText('🌐')).toHaveLength(2) // Label + flag icon
    })
  })

  describe('dropdown functionality', () => {
    it('should open dropdown when clicked', async () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      // Initially dropdown should be closed
      expect(screen.queryByText('中文')).not.toBeInTheDocument()

      // Click to open
      await user.click(screen.getByText('English'))

      // Dropdown should now be open
      expect(screen.getByText('中文')).toBeInTheDocument()
      expect(screen.getByText('日本語')).toBeInTheDocument()
      expect(screen.getByText('Español')).toBeInTheDocument()
    })

    it('should close dropdown when clicked again', async () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      const trigger = screen.getByText('English')
      
      // Open dropdown
      await user.click(trigger)
      expect(screen.getByText('中文')).toBeInTheDocument()

      // Close dropdown
      await user.click(trigger)
      expect(screen.queryByText('中文')).not.toBeInTheDocument()
    })

    it('should show selected state for current language', async () => {
      render(
        <LanguageSelector
          currentLanguage="zh"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      // Open dropdown
      await user.click(screen.getByText('中文'))

      // Find dropdown items by class name
      const dropdownItems = document.querySelectorAll('.dropdown-item')
      const zhItem = Array.from(dropdownItems).find(item => item.textContent?.includes('中文'))
      const enItem = Array.from(dropdownItems).find(item => item.textContent?.includes('English'))

      expect(zhItem).toHaveClass('selected')
      expect(enItem).not.toHaveClass('selected')
    })

    it('should handle language selection', async () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      // Open dropdown
      await user.click(screen.getByText('English'))

      // Select a different language
      await user.click(screen.getByText('中文'))

      expect(mockChangeLanguage).toHaveBeenCalledWith('zh')
      expect(mockChangeLanguage).toHaveBeenCalledTimes(1)
    })

    it('should close dropdown after language selection', async () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      // Open dropdown
      await user.click(screen.getByText('English'))
      expect(screen.getByText('中文')).toBeInTheDocument()

      // Select a language
      await user.click(screen.getByText('中文'))

      // Dropdown should be closed
      expect(screen.queryByText('日本語')).not.toBeInTheDocument()
    })
  })

  describe('click outside behavior', () => {
    it('should close dropdown when clicking outside', async () => {
      render(
        <div>
          <div data-testid="outside">Outside element</div>
          <LanguageSelector
            currentLanguage="en"
            changeLanguage={mockChangeLanguage}
            getSupportedLanguages={mockGetSupportedLanguages}
          />
        </div>
      )

      // Open dropdown
      await user.click(screen.getByText('English'))
      expect(screen.getByText('中文')).toBeInTheDocument()

      // Click outside
      await user.click(screen.getByTestId('outside'))

      // Dropdown should close
      expect(screen.queryByText('中文')).not.toBeInTheDocument()
    })

    it('should not close dropdown when clicking inside', async () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      // Open dropdown
      await user.click(screen.getByText('English'))
      expect(screen.getByText('中文')).toBeInTheDocument()

      // Click on the dropdown itself
      const dropdown = screen.getByText('中文').closest('.custom-select-wrapper')
      await user.click(dropdown!)

      // Dropdown should remain open
      expect(screen.getByText('中文')).toBeInTheDocument()
    })
  })

  describe('arrow icon behavior', () => {
    it('should show closed arrow initially', () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      const arrow = screen.getByText('▼')
      expect(arrow).not.toHaveClass('open')
    })

    it('should show open arrow when dropdown is open', async () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      // Open dropdown
      await user.click(screen.getByText('English'))

      const arrow = screen.getByText('▼')
      expect(arrow).toHaveClass('open')
    })
  })

  describe('accessibility', () => {
    it('should have proper label', () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      // Check that the label element exists
      const label = document.querySelector('label[for="language-select"]')
      expect(label).toBeInTheDocument()
      expect(label?.textContent).toBe('🌐 ')
    })

    it('should handle keyboard events appropriately', async () => {
      render(
        <LanguageSelector
          currentLanguage="en"
          changeLanguage={mockChangeLanguage}
          getSupportedLanguages={mockGetSupportedLanguages}
        />
      )

      const selector = screen.getByText('English').closest('.custom-select')!
      
      // Focus and press Enter - this should open the dropdown
      await user.type(selector, '{Enter}')
      
      // Enter key should open the dropdown
      expect(screen.getByText('中文')).toBeInTheDocument()
      
      // Should still work with mouse click to close and reopen
      await user.click(selector)
      expect(screen.queryByText('中文')).not.toBeInTheDocument()
      await user.click(selector)
      expect(screen.getByText('中文')).toBeInTheDocument()
    })
  })
})
