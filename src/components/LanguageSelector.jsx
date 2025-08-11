import './LanguageSelector.css'
import { i18nConfig } from '../i18n/config'
import { useState, useRef, useEffect } from 'react'

// 國旗圖標組件
const FlagIcon = ({ countryCode }) => {
  const flagEmojis = {
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

export const LanguageSelector = ({ currentLanguage, changeLanguage, getSupportedLanguages }) => {
  const languages = getSupportedLanguages()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode)
    setIsOpen(false)
  }

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage)

  return (
    <div className="language-selector">
      <label htmlFor="language-select">{i18nConfig.languageSelectorLabel} </label>
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
