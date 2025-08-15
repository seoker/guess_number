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

## 🤖 Vibe Coding Development

This project is a **100% AI-generated codebase** - no human developer wrote any code manually! The entire project was created through "vibe coding" using:

- **[Claude Code](https://claude.ai/code)** - Anthropic's official CLI for AI-assisted development
- **[Cursor](https://cursor.sh/)** - AI-powered code editor

### Development Process

The developer simply described the desired game features and let the AI tools handle:

- ✨ Complete codebase architecture
- 🧩 All component implementation
- 🎨 Responsive UI/UX design
- 🌍 Multi-language internationalization
- 🧪 Comprehensive testing suite
- 📱 Mobile-first responsive design
- 🚀 Deployment configuration

This demonstrates the power of modern AI coding tools to transform ideas into fully functional applications without traditional programming!

## 📁 Project Structure

```text
src/
├── components/          # React Components (TypeScript)
│   ├── GameUI.tsx       # Main game interface
│   ├── GameUI.css       # Game styles
│   ├── GameRecords.tsx  # Game records display
│   ├── GameRecords.css  # Game records styles
│   ├── NavigationBar.tsx    # Navigation bar
│   ├── NavigationBar.css    # Navigation bar styles
│   ├── LanguageSelector.tsx # Language selector
│   ├── LanguageSelector.css # Language selector styles
│   ├── DigitInputs.tsx      # 4-digit input system
│   ├── FeedbackForm.tsx     # Computer feedback form
│   ├── FeedbackCorrectionPanel.tsx # Feedback correction UI
│   ├── GameHistory.tsx      # Game history display
│   ├── StartScreen.tsx      # Game start screen
│   └── WinScreen.tsx        # Game completion screen
├── hooks/               # Custom React Hooks (TypeScript)
│   ├── useGameLogic.ts      # Core game logic and state
│   ├── useGameRecords.ts    # Game records management
│   ├── useGameState.ts      # Game state management
│   ├── useComputerAI.ts     # Computer AI logic
│   ├── useFeedbackCorrection.ts # Feedback correction logic
│   ├── useConfirmationDialogs.ts # Dialog confirmations
│   └── useDigitInput.ts     # Digit input handling
├── types/               # TypeScript Type Definitions
│   └── index.ts         # Centralized type definitions
├── utils/               # Utility Functions
│   └── gameUtils.ts     # Game calculation utilities
├── i18n/                # Internationalization
│   ├── i18n.ts          # i18n configuration
│   └── locales/         # Language files
│       ├── zh.json      # Traditional Chinese
│       ├── en.json      # English
│       └── ja.json      # Japanese
├── styles/              # Global Styles
│   └── utilities.css    # Utility CSS classes
├── App.tsx              # Main application component
└── main.tsx             # Application entry point

tests/                   # Comprehensive Test Suite
├── unit/                # Unit Tests (20+ test files)
│   ├── components/      # Component tests
│   ├── hooks/           # Hook tests
│   └── utils/           # Utility tests
├── integration/         # Integration Tests
│   ├── game-flow.test.tsx       # Complete game flows
│   └── hint-integration.test.tsx # Hint system integration
├── e2e/                 # End-to-End Tests
│   ├── digit-input.test.ts      # UI interaction tests
│   └── digit-order-regression.test.ts # Regression tests
└── setup.ts             # Test configuration
```

## 🎯 Game Features

- **Bidirectional Competition**: Player and computer guess simultaneously
- **Smart AI Reasoning**: Computer performs logical analysis and maintains possible number candidates
- **Draw Condition**: Game can end in a draw when both players succeed in the same round
- **Hint System**: Players get 3 hints to check if their guess is consistent with previous feedback
- **4-Digit Input System**: Separate input boxes for each digit with out-of-order entry support
- **History Tracking**: Shows complete guess history with A/B results for both player and computer
- **Game Records**: Automatically saves match results with detailed statistics to browser storage
- **Feedback Correction**: Advanced system to fix inconsistent feedback with history review
- **Complaint System**: Computer intelligently detects and complains about inconsistent feedback
- **Confirmation Dialogs**: Safe reset and restart operations with user confirmation
- **Multi-language**: Complete internationalization for Chinese, English, and Japanese

## 🧪 Testing

The project includes comprehensive test coverage with **20+ test files** across multiple testing levels:

```bash
# Run all tests
npm test

# Run tests with UI interface
npm run test:ui

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Architecture

- **Unit Tests** (`tests/unit/`) - Component and hook testing with TypeScript
  - All React components with full interaction testing
  - Custom hooks with state management validation
  - Utility functions and game logic verification
  - Regression tests for specific bug fixes

- **Integration Tests** (`tests/integration/`) - End-to-end workflow testing
  - Complete game flow from start to finish
  - Hint system integration with feedback validation
  - Multi-language switching and persistence

- **E2E Tests** (`tests/e2e/`) - Browser automation with Playwright
  - Real browser interaction testing
  - Digit input system regression tests
  - Cross-browser compatibility verification

### Testing Framework Stack

- **Vitest** - Fast unit test runner with TypeScript support
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end browser automation
- **jsdom** - DOM environment simulation
- **@testing-library/user-event** - User interaction simulation

## 🚀 Deployment

The project is automatically deployed to GitHub Pages:

- **Live Demo**: [https://seoker.tw/guess_number](https://seoker.tw/guess_number)
- **Repository**: GitHub Pages deployment via gh-pages branch

Enjoy the game! 🎉
