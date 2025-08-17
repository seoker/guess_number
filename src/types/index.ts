/* Enums */

export enum CurrentTurn {
  PLAYER = 'player',
  COMPUTER = 'computer'
}

export enum MessageType {
  INFO = 'info',
  SUCCESS = 'success',
  COMPLAINT = 'complaint'
}

export enum GameWinner {
  PLAYER = 'player',
  COMPUTER = 'computer',
  DRAW = 'draw'
}

/* Game state and logic types */

export interface MessageInfo {
  key: string;
  params?: Record<string, string | number>;
}

export interface GameState {
  gameStarted: boolean;
  gameWon: boolean;
  computerTarget: string;
  playerGuess: string;
  playerAttempts: number;
  computerAttempts: number;
  currentTurn: CurrentTurn;
  message: string;
  messageInfo: MessageInfo | null;
  messageType: MessageType;
  hintsRemaining: number;
}

// Base interface for any history entry (minimal shared structure)
export interface BaseHistoryEntry {
  guess: string;
}

// Modern structured approach using GuessResult for A/B values
export interface GameGuess extends BaseHistoryEntry {
  result: GuessResult;  // Use existing GuessResult type
  attemptNumber: number;
  timestamp: number;
}

// Computed properties helper
export interface GameGuessComputed extends GameGuess {
  readonly isCorrect: boolean;
  readonly resultString: string; // "1A2B" format for display
}

// Updated GuessRecord to use structured result (no more string parsing!)
export interface GuessRecord extends BaseHistoryEntry {
  result: GuessResult;  // Now uses GuessResult instead of string
  isCorrect: boolean;
}

// Type alias for common history entry patterns
export type HistoryEntry = GuessRecord | GameGuess;

// Type alias for arrays of history entries
export type HistoryArray = GuessRecord[] | GameGuess[];


// Legacy interface for backward compatibility
export interface GameHistory {
  player: GuessRecord[];
  computer: GuessRecord[];
}

export interface ComputerAI {
  possibleNumbers: string[];
  currentGuess: string;
  playerFeedback: GuessResult;  // Now uses GuessResult instead of string values
  showFeedbackForm: boolean;
}

export interface FeedbackCorrection {
  isActive: boolean;
  showHistory: boolean;
}

export interface SavedGameRecord {
  id: string;
  timestamp: number;
  winner: GameWinner | null;
  playerAttempts: number;
  computerAttempts: number;
  totalRounds: number;
  playerHistory: GuessRecord[];
  computerHistory: GuessRecord[];
}

export interface GuessResult {
  A: number;
  B: number;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

/* Component props types */

export interface NavigationBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  t: (key: string) => string;
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
  getSupportedLanguages: () => Language[];
}

export interface LanguageSelectorProps {
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
  getSupportedLanguages: () => Language[];
}

export interface GameUIProps {
  gameState: GameState;
  history: GameHistory;
  computerAI: ComputerAI;
  feedbackCorrection: FeedbackCorrection;
  startNewGame: () => void;
  handlePlayerGuess: () => void;
  handleFeedbackSubmit: () => void;
  updatePlayerGuess: (guess: string) => void;
  updatePlayerFeedback: (type: 'A' | 'B', value: string) => void;
  getMessageType: () => MessageType;
  startFeedbackCorrection: () => void;
  resetGame: () => void;
  correctHistoryFeedback: (index: number, A: number, B: number) => void;
  cancelFeedbackCorrection: () => void;
  handleHintCheck: () => void;
  t: (key: string, options?: any) => string;
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
  getSupportedLanguages: () => Language[];
}

export interface GameRecordsProps {
  gameRecords: SavedGameRecord[];
  clearAllRecords: () => void;
  t: (key: string, options?: any) => string;
}

export interface FeedbackCorrectionPanelProps {
  history: GuessRecord[];
  correctHistoryFeedback: (index: number, A: number, B: number) => void;
  cancelFeedbackCorrection: () => void;
  t: (key: string, options?: any) => string;
}