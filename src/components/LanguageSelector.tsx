import './LanguageSelector.css'
import { useState, useRef, useEffect } from 'react'
import { LanguageSelectorProps, Language } from '../types'

// Flag icon component
const FlagIcon: React.FC<{ countryCode: string }> = ({ countryCode }) => {
  const flagEmojis: Record<string, string> = {
    'zh': '🇹🇼',
    'en': '🇺🇸',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'ru': '🇷🇺'
  }
  
  return <span className="flag-icon">{flagEmojis[countryCode] || '🌐'}</span>
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, changeLanguage, getSupportedLanguages }) => {
  const languages = getSupportedLanguages()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageSelect = (languageCode: string): void => {
    changeLanguage(languageCode)
    setIsOpen(false)
  }

  const currentLanguageData = languages.find((lang: Language) => lang.code === currentLanguage)

  return (
    <div className="language-selector">
      <label htmlFor="language-select">🌐 </label>
      <div className="custom-select-wrapper" ref={dropdownRef}>
        <div 
          className="custom-select"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="select-display">
            <FlagIcon countryCode={currentLanguage} />
            <span className="language-name">{currentLanguageData?.name || currentLanguage}</span>
          </div>
          <div className={`select-arrow ${isOpen ? 'open' : ''}`}>▼</div>
        </div>
        
        {isOpen && (
          <div className="dropdown-menu">
            {languages.map(lang => (
              <div
                key={lang.code}
                className={`dropdown-item ${lang.code === currentLanguage ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <FlagIcon countryCode={lang.code} />
                <span>{lang.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
