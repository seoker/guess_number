import React from 'react'
import './NavigationBar.css'
import { LanguageSelector } from './LanguageSelector'
import { NavigationBarProps } from '../types'

const NavigationBar: React.FC<NavigationBarProps> = ({ currentView, onViewChange, t, currentLanguage, changeLanguage, getSupportedLanguages }) => {
  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <h1 className="nav-title">{t('title')}</h1>
        <div className="nav-controls">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${currentView === 'game' ? 'active' : ''}`}
              onClick={() => onViewChange('game')}
            >
              {t('gameTab')}
            </button>
            <button
              className={`nav-tab ${currentView === 'records' ? 'active' : ''}`}
              onClick={() => onViewChange('records')}
            >
              {t('recordsTab')}
            </button>
          </div>
          <LanguageSelector 
            currentLanguage={currentLanguage}
            changeLanguage={changeLanguage}
            getSupportedLanguages={getSupportedLanguages}
          />
        </div>
      </div>
    </nav>
  )
}

export { NavigationBar }
