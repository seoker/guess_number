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

export interface GameState {
  gameStarted: boolean;
  gameWon: boolean;
  computerTarget: string;
  playerGuess: string;
  playerAttempts: number;
  computerAttempts: number;
  currentTurn: CurrentTurn;
  message: string;
  messageType: MessageType;
}

export interface GameRecord {
  guess: string;
  result: string;
  isCorrect: boolean;
}

export interface GameHistory {
  player: GameRecord[];
  computer: GameRecord[];
}

export interface ComputerAI {
  possibleNumbers: string[];
  currentGuess: string;
  playerFeedback: {
    A: string;
    B: string;
  };
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
  playerHistory: GameRecord[];
  computerHistory: GameRecord[];
}

export interface GameResult {
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
  history: GameRecord[];
  correctHistoryFeedback: (index: number, A: number, B: number) => void;
  cancelFeedbackCorrection: () => void;
  t: (key: string, options?: any) => string;
}