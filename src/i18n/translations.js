export const translations = {
  zh: {
    // 遊戲標題和描述
    title: '猜數字遊戲 1A2B',
    description: '你和電腦同時猜測對方的四位數字！',
    rules: '規則：',
    rulesDetail: '在紙上寫下你的四位數字，然後開始競賽',
    aExplanation: 'A：數字和位置都對的個數',
    bExplanation: 'B：數字對但位置不對的個數',
    
    // 按鈕
    startGame: '開始遊戲',
    guess: '猜測',
    submitFeedback: '提交提示',
    playAgain: '再玩一次',
    
    // 遊戲狀態
    playerAttempts: '玩家嘗試',
    computerAttempts: '電腦嘗試',
    currentTurn: '當前回合',
    player: '玩家',
    computer: '電腦',
    
    // 輸入提示
    guessPlaceholder: '猜測電腦的數字...',
    feedbackHint: '請根據你的數字填入幾A幾B的提示',
    computerGuess: '電腦猜測：',
    
    // 表單標籤
    aLabel: 'A（位置和數字都對）：',
    bLabel: 'B（數字對但位置不對）：',
    
    // 歷史記錄
    playerHistory: '玩家猜測記錄',
    computerHistory: '電腦猜測記錄',
    
    // 遊戲結束
    gameOver: '🎉 遊戲結束！',
    
    // 錯誤訊息
    fourDigitsRequired: '請輸入四位數字！',
    digitsMustBeUnique: '四位數字不能重複！',
    invalidFeedback: '請輸入有效的A和B值（0-4，且A+B≤4）',
    
    // 成功訊息
    playerWon: '恭喜！你贏了！你猜對了電腦的數字！',
    computerWon: '電腦贏了！電腦猜對了你的數字！電腦的數字是：{computerNumber}',
    
    // 提示訊息
    yourHint: '你的提示：',
    computerThinking: '電腦猜測：{guess}，請填入幾A幾B的提示',
    
    // 電腦抱怨訊息
    complaints: {
      inconsistent: '等等！我猜測 {guess}，你給出 {feedback}，但這與我之前的猜測結果不一致！',
      unreasonable: '這不合理！我猜 {guess} 得到 {feedback}，但根據我之前的推理，這是不可能的！',
      joking: '我懷疑你在開玩笑！{guess} 的結果 {feedback} 與我之前的分析不符！',
      problematic: '這有問題！我猜測 {guess}，你給出 {feedback}，但這違反了邏輯！',
      wrong: '等等，這不對！{guess} 的 {feedback} 與我之前的猜測結果矛盾！'
    },
    
    // 特殊情況
    noPossibleNumbers: '這很奇怪！根據你給的提示，我找不到任何可能的數字。你確定沒有記錯嗎？'
  },
  
  en: {
    // Game title and description
    title: 'Number Guessing Game 1A2B',
    description: 'You and the computer guess each other\'s four-digit numbers simultaneously!',
    rules: 'Rules:',
    rulesDetail: 'Write down your four-digit number on paper, then start the competition',
    aExplanation: 'A: Number of digits that are correct in both value and position',
    bExplanation: 'B: Number of digits that are correct in value but wrong in position',
    
    // Buttons
    startGame: 'Start Game',
    guess: 'Guess',
    submitFeedback: 'Submit Feedback',
    playAgain: 'Play Again',
    
    // Game status
    playerAttempts: 'Player Attempts',
    computerAttempts: 'Computer Attempts',
    currentTurn: 'Current Turn',
    player: 'Player',
    computer: 'Computer',
    
    // Input placeholders
    guessPlaceholder: 'Guess the computer\'s number...',
    feedbackHint: 'Please enter the A and B feedback based on your number',
    computerGuess: 'Computer Guess:',
    
    // Form labels
    aLabel: 'A (correct digit and position):',
    bLabel: 'B (correct digit but wrong position):',
    
    // History
    playerHistory: 'Player Guess History',
    computerHistory: 'Computer Guess History',
    
    // Game over
    gameOver: '🎉 Game Over!',
    
    // Error messages
    fourDigitsRequired: 'Please enter a four-digit number!',
    digitsMustBeUnique: 'The four digits must be unique!',
    invalidFeedback: 'Please enter valid A and B values (0-4, and A+B≤4)',
    
    // Success messages
    playerWon: 'Congratulations! You won! You guessed the computer\'s number correctly!',
    computerWon: 'Computer won! The computer guessed your number correctly! The computer\'s number was: {computerNumber}',
    
    // Hint messages
    yourHint: 'Your hint:',
    computerThinking: 'Computer guess: {guess}, please enter the A and B feedback',
    
    // Computer complaint messages
    complaints: {
      inconsistent: 'Wait! I guessed {guess}, you gave {feedback}, but this is inconsistent with my previous guess results!',
      unreasonable: 'This is unreasonable! I guessed {guess} and got {feedback}, but according to my previous reasoning, this is impossible!',
      joking: 'I suspect you\'re joking! The result {feedback} for {guess} doesn\'t match my previous analysis!',
      problematic: 'This is problematic! I guessed {guess}, you gave {feedback}, but this violates logic!',
      wrong: 'Wait, this is wrong! The {feedback} for {guess} contradicts my previous guess results!'
    },
    
    // Special cases
    noPossibleNumbers: 'This is strange! Based on your feedback, I can\'t find any possible numbers. Are you sure you didn\'t make a mistake?'
  },
  
  ja: {
    // ゲームタイトルと説明
    title: '数字当てゲーム 1A2B',
    description: 'あなたとコンピュータが同時にお互いの4桁の数字を当てます！',
    rules: 'ルール：',
    rulesDetail: '紙に4桁の数字を書いて、競争を開始します',
    aExplanation: 'A：数字と位置が両方正しい個数',
    bExplanation: 'B：数字は正しいが位置が間違っている個数',
    
    // ボタン
    startGame: 'ゲーム開始',
    guess: '推測',
    submitFeedback: 'フィードバック送信',
    playAgain: 'もう一度プレイ',
    
    // ゲーム状態
    playerAttempts: 'プレイヤー試行',
    computerAttempts: 'コンピュータ試行',
    currentTurn: '現在のターン',
    player: 'プレイヤー',
    computer: 'コンピュータ',
    
    // 入力プレースホルダー
    guessPlaceholder: 'コンピュータの数字を推測...',
    feedbackHint: 'あなたの数字に基づいてAとBのフィードバックを入力してください',
    computerGuess: 'コンピュータ推測：',
    
    // フォームラベル
    aLabel: 'A（数字と位置が正しい）：',
    bLabel: 'B（数字は正しいが位置が間違っている）：',
    
    // 履歴
    playerHistory: 'プレイヤー推測履歴',
    computerHistory: 'コンピュータ推測履歴',
    
    // ゲーム終了
    gameOver: '🎉 ゲーム終了！',
    
    // エラーメッセージ
    fourDigitsRequired: '4桁の数字を入力してください！',
    digitsMustBeUnique: '4桁の数字は重複してはいけません！',
    invalidFeedback: '有効なAとBの値を入力してください（0-4、かつA+B≤4）',
    
    // 成功メッセージ
    playerWon: 'おめでとう！あなたの勝ちです！コンピュータの数字を正しく推測しました！',
    computerWon: 'コンピュータの勝ちです！コンピュータがあなたの数字を正しく推測しました！コンピュータの数字は：{computerNumber}',
    
    // ヒントメッセージ
    yourHint: 'あなたのヒント：',
    computerThinking: 'コンピュータ推測：{guess}、AとBのフィードバックを入力してください',
    
    // コンピュータの不満メッセージ
    complaints: {
      inconsistent: '待って！私は{guess}を推測し、あなたは{feedback}を与えましたが、これは私の以前の推測結果と一致しません！',
      unreasonable: 'これは不合理です！私は{guess}を推測して{feedback}を得ましたが、私の以前の推論によると、これは不可能です！',
      joking: 'あなたが冗談を言っているのではないかと疑います！{guess}の結果{feedback}は私の以前の分析と一致しません！',
      problematic: 'これは問題があります！私は{guess}を推測し、あなたは{feedback}を与えましたが、これは論理に反します！',
      wrong: '待って、これは間違っています！{guess}の{feedback}は私の以前の推測結果と矛盾します！'
    },
    
    // 特殊なケース
    noPossibleNumbers: 'これは奇妙です！あなたのフィードバックに基づいて、可能な数字が見つかりません。間違えていないか確認してください。'
  }
}

// 添加新的翻譯鍵到所有語言
export const addNewTranslations = (translations) => {
  Object.keys(translations).forEach(lang => {
    if (lang === 'zh') {
      translations[lang] = {
        ...translations[lang],
        // 導航欄
        gameTab: '遊戲',
        recordsTab: '記錄',
        
        // 遊戲記錄
        gameRecords: '遊戲記錄',
        noRecordsYet: '還沒有遊戲記錄',
        clearAllRecords: '清除所有記錄',
        totalRounds: '總回合數',
        playerWonShort: '玩家勝',
        computerWonShort: '電腦勝',
        gameIncomplete: '遊戲未完成',
        playerWonInRounds: '玩家在 {rounds} 回合獲勝',
        computerWonInRounds: '電腦在 {rounds} 回合獲勝'
      }
    } else if (lang === 'en') {
      translations[lang] = {
        ...translations[lang],
        // Navigation
        gameTab: 'Game',
        recordsTab: 'Records',
        
        // Game records
        gameRecords: 'Game Records',
        noRecordsYet: 'No game records yet',
        clearAllRecords: 'Clear All Records',
        totalRounds: 'Total Rounds',
        playerWonShort: 'Player Won',
        computerWonShort: 'Computer Won',
        gameIncomplete: 'Game Incomplete',
        playerWonInRounds: 'Player won in {rounds} rounds',
        computerWonInRounds: 'Computer won in {rounds} rounds'
      }
    } else if (lang === 'ja') {
      translations[lang] = {
        ...translations[lang],
        // ナビゲーション
        gameTab: 'ゲーム',
        recordsTab: '記録',
        
        // ゲーム記録
        gameRecords: 'ゲーム記録',
        noRecordsYet: 'ゲーム記録はまだありません',
        clearAllRecords: 'すべての記録をクリア',
        totalRounds: '総ラウンド数',
        playerWonShort: 'プレイヤー勝ち',
        computerWonShort: 'コンピュータ勝ち',
        gameIncomplete: 'ゲーム未完了',
        playerWonInRounds: 'プレイヤーが{rounds}ラウンドで勝利',
        computerWonInRounds: 'コンピュータが{rounds}ラウンドで勝利'
      }
    }
  })
  
  return translations
}
