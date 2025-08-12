// import { addNewTranslations } from './translations' // Currently unused

// 國際化相關配置
export const i18nConfig = {
  // 支援的語言
  supportedLanguages: {
    zh: '中文',
    en: 'English', 
    ja: '日本語'
  },
  
  // 預設語言
  defaultLanguage: 'zh',
  
  // 語言選擇器標籤
  languageSelectorLabel: '🌐',
  
  // 各語言的抱怨關鍵字（用於檢測訊息類型）
  complaintKeywords: {
    zh: ['等等', '不合理', '開玩笑', '有問題', '不對'],
    en: ['Wait', 'unreasonable', 'joking', 'problematic', 'wrong'],
    ja: ['待って', '不合理', '冗談', '問題', '間違い']
  },
  
  // 訊息類型
  messageTypes: {
    SUCCESS: 'success',
    INFO: 'info', 
    COMPLAINT: 'complaint'
  }
}

// 獲取當前語言的抱怨關鍵字
export const getComplaintKeywords = (currentLanguage) => {
  return i18nConfig.complaintKeywords[currentLanguage] || i18nConfig.complaintKeywords.zh
}

// 獲取所有語言的抱怨關鍵字（用於檢測）
export const getAllComplaintKeywords = () => {
  return Object.values(i18nConfig.complaintKeywords).flat()
}
