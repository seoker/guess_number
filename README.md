# 🎯 Interactive Number Guessing Competition

A fun two-player number guessing game where player and computer simultaneously guess each other's four-digit numbers!

🎮 **[Try the Live Demo](https://seoker.tw/guess_number)**

## 🌍 Multi-language Support

This game supports the following languages:
- 🇹🇼 Traditional Chinese (中文)
- 🇺🇸 English
- 🇯🇵 Japanese (日本語)

### Language Switching
Click the language selector (🌐) in the top-right corner to switch game language. Language preferences are automatically saved in the browser.

## 🎮 Game Rules

1. **Objective**: Guess the opponent's four-digit number
2. **Number Rules**: Four digits must be unique (e.g., 1234, 5678)
3. **Hint System**:
   - **A**: Number of digits that are correct in both value and position
   - **B**: Number of digits that are correct in value but wrong in position
4. **Example**: 
   - Target number: 1234
   - Guess: 1567
   - Result: 1A0B (1 is in correct position, no other digits are correct but in wrong position)

## 📊 Game Records Feature

The game automatically records each match result, including:
- **Timestamp**: When the game was completed
- **Win/Loss Result**: Player victory or computer victory
- **Round Count**: Total rounds, player attempts, computer attempts
- **Persistent Storage**: Uses browser localStorage to save records

### View Records
Click the "Records" tab in the navigation bar to view all game records. Records are sorted in reverse chronological order with the newest records at the top.

### Clear Records
On the records page, you can click the "Clear All Records" button to delete all saved game records.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🛠️ Technical Features

- **React 18** - Modern frontend framework
- **Vite** - Fast development and build tool
- **Internationalization (i18n)** - Complete multi-language support with react-i18next
- **Responsive Design** - Adapts to various devices
- **Smart AI** - Computer performs logical reasoning based on hints
- **Feedback Correction** - Advanced correction system for inconsistent feedback

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── GameUI.jsx      # Main game interface
│   ├── GameUI.css      # Game styles
│   ├── NavigationBar.jsx   # Navigation bar
│   ├── NavigationBar.css   # Navigation bar styles
│   ├── GameRecords.jsx     # Game records display
│   ├── GameRecords.css     # Game records styles
│   ├── LanguageSelector.jsx # Language selector
│   └── LanguageSelector.css # Language selector styles
├── hooks/               # Custom Hooks
│   ├── useGameLogic.js  # Game logic
│   └── useGameRecords.js # Game records management
├── i18n/                # Translation files
│   ├── index.js         # i18n configuration
│   └── locales/         # Language files
│       ├── zh.json      # Traditional Chinese
│       ├── en.json      # English
│       └── ja.json      # Japanese
└── App.jsx             # Main application component
```

## 🎯 Game Features

- **Bidirectional Competition**: Player and computer guess simultaneously
- **Smart Reasoning**: Computer performs logical analysis based on hints
- **History Tracking**: Shows all guess history with ordinal numbering
- **Game Records**: Automatically saves each game result to browser
- **Navigation System**: Switch between game interface and records interface
- **Real-time Feedback**: Provides detailed A/B hints
- **Feedback Correction**: Fix and reset functionality when computer detects inconsistent feedback
- **Multi-language**: Supports Chinese, English, and Japanese

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test suite includes:
- **Unit tests** for game logic, components, and hooks
- **Integration tests** for complete game flow
- **46 test cases** ensuring full functionality

## 🚀 Deployment

The project is automatically deployed to GitHub Pages:
- **Live Demo**: [https://seoker.tw/guess_number](https://seoker.tw/guess_number)
- **Repository**: GitHub Pages deployment via gh-pages branch

Enjoy the game! 🎉