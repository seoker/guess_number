import { useState, useEffect } from 'react'
import { translations, addNewTranslations } from '../i18n/translations'
import { i18nConfig } from '../i18n/config'

// 應用新的翻譯
const enhancedTranslations = addNewTranslations(translations)

export const useI18n = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // 從 localStorage 讀取保存的語言設定，預設為中文
    return localStorage.getItem('gameLanguage') || i18nConfig.defaultLanguage
  })

  // 當語言改變時保存到 localStorage
  useEffect(() => {
    localStorage.setItem('gameLanguage', currentLanguage)
  }, [currentLanguage])

  // 翻譯函數
  const t = (key, params = {}) => {
    const translation = enhancedTranslations[currentLanguage]?.[key]
    
    if (!translation) {
      console.warn(`Translation key "${key}" not found for language "${currentLanguage}"`)
      return key
    }

    // 如果有參數需要替換
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match
      })
    }

    return translation
  }

  // 切換語言
  const changeLanguage = (language) => {
    if (enhancedTranslations[language]) {
      setCurrentLanguage(language)
    } else {
      console.warn(`Language "${language}" is not supported`)
    }
  }

  // 獲取支援的語言列表
  const getSupportedLanguages = () => {
    return Object.keys(enhancedTranslations).map(code => ({
      code,
      name: i18nConfig.supportedLanguages[code] || code
    }))
  }

  return {
    currentLanguage,
    changeLanguage,
    t,
    getSupportedLanguages
  }
}
