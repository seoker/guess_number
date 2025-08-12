# Number Guessing Game Manual Test Checklist

## 1. Game Initialization Testing

### ✅ Basic Functionality Check
- [ ] Game shows start screen when launched
- [ ] Clicking "Start Game" button enters the game
- [ ] After game starts, displays player and computer attempt counts
- [ ] Initial turn is computer turn

### ✅ Language Switching Function
- [ ] Language selector displays correctly
- [ ] Interface text updates correctly after switching language
- [ ] All text has corresponding translations

## 2. Player Guessing Function Testing

### ✅ Input Validation
- [ ] Only numbers can be input (letters are filtered)
- [ ] Maximum of 4 digits can be input
- [ ] Duplicate digits are rejected
- [ ] Empty input is rejected
- [ ] Guess button is disabled when less than 4 digits

### ✅ Guess Results
- [ ] Shows "Congratulations! You won!" for correct guess
- [ ] Shows correct A and B values for incorrect guess
- [ ] Guess record is correctly added to history
- [ ] Turn switches to computer after guess

### ✅ Button States
- [ ] Guess button disabled when game not started
- [ ] Guess button disabled during computer turn
- [ ] Guess button disabled when game ends
- [ ] Guess button disabled when input incomplete

## 3. Computer Guessing Function Testing

### ✅ Computer Guess Process
- [ ] Shows "Computer thinking..." during computer turn
- [ ] Computer generates reasonable guess numbers
- [ ] Displays computer's guess result
- [ ] Feedback form appears for player to input A and B values

### ✅ Feedback Form
- [ ] A and B value buttons work correctly
- [ ] Selected values display correctly
- [ ] Submit button enables after both values are selected
- [ ] Turn switches to player after submission

### ✅ Computer AI Logic
- [ ] Computer correctly narrows possible range based on feedback
- [ ] Computer doesn't repeat guesses
- [ ] Game ends when computer guesses correctly
- [ ] Computer guess records are correctly added to history

## 4. Game End Condition Testing

### ✅ Victory Conditions
- [ ] Game ends when player guesses correctly
- [ ] Game ends when computer guesses correctly
- [ ] Correct victory message displays when game ends
- [ ] "Play Again" button shows when game ends

### ✅ Restart
- [ ] Game resets after clicking "Play Again" button
- [ ] History records are cleared
- [ ] Attempt counts are reset
- [ ] Returns to start screen

## 5. Feedback Validation Testing

### ✅ Feedback Reasonableness Check
- [ ] Shows complaint message when unreasonable A and B values are input
- [ ] Complaint message includes guess number and feedback values
- [ ] Reasonable feedback is accepted
- [ ] Feedback validation logic is correct

### ✅ Feedback Correction Feature
- [ ] Fix and Reset buttons appear when computer complains
- [ ] Clicking Fix button shows correction panel
- [ ] Can select and modify previous feedback in correction panel
- [ ] Correction updates game state correctly
- [ ] Reset button restarts the game properly

### ✅ Feedback Boundary Cases
- [ ] A value range: 0-4
- [ ] B value range: 0-4
- [ ] A+B cannot exceed 4
- [ ] Negative numbers are rejected

## 6. History Records Testing

### ✅ Record Display
- [ ] Player history records display correctly with ordinal numbers
- [ ] Computer history records display correctly with ordinal numbers
- [ ] Correct guess records have special marking
- [ ] History records auto-scroll to latest
- [ ] Left and right history items have consistent height

### ✅ Record Format
- [ ] Guess number format is correct
- [ ] Result format is "XA YB"
- [ ] Records are arranged in chronological order
- [ ] Ordinal numbers (1, 2, 3, 4...) display correctly

## 7. User Experience Testing

### ✅ Interface Responsiveness
- [ ] Button clicks have visual feedback
- [ ] Input field auto-focuses
- [ ] Loading animations display correctly
- [ ] Error messages display clearly

### ✅ Keyboard Operations
- [ ] Enter key can submit guesses
- [ ] Number keypad works correctly
- [ ] Backspace key works correctly

### ✅ Responsive Design
- [ ] Displays correctly on different screen sizes
- [ ] Can operate normally on mobile devices
- [ ] Text doesn't overflow containers

## 8. Game Records Feature Testing

### ✅ Records Storage
- [ ] Game records are saved to localStorage
- [ ] Records persist after page refresh
- [ ] Records include timestamp, winner, and attempt counts
- [ ] Records display in reverse chronological order

### ✅ Records Management
- [ ] "Records" tab navigation works
- [ ] "Clear All Records" button functions correctly
- [ ] Empty state shows appropriate message
- [ ] All record labels are properly translated

## 9. Performance Testing

### ✅ Loading Speed
- [ ] Game startup time is reasonable
- [ ] Language switching responds quickly
- [ ] Button clicks respond promptly

### ✅ Memory Usage
- [ ] Extended gameplay doesn't cause memory leaks
- [ ] Game state resets correctly after restart

## 10. Error Handling Testing

### ✅ Exception Situations
- [ ] Game works normally when network is interrupted
- [ ] Game state is correct after page refresh
- [ ] Good browser compatibility

### ✅ Input Errors
- [ ] Invalid input is handled correctly
- [ ] Error messages are clear and understandable
- [ ] Can continue playing after errors

## 11. Game Logic Integrity Testing

### ✅ Game Rules
- [ ] 4 unique digits rule is correctly enforced
- [ ] A and B calculation logic is correct
- [ ] Turn switching logic is correct
- [ ] Victory condition judgment is correct

### ✅ Computer AI
- [ ] Computer guessing strategy is reasonable
- [ ] Computer doesn't make impossible guesses
- [ ] Computer can guess correctly within reasonable attempts

## 12. Internationalization Testing

### ✅ Multi-language Support
- [ ] All UI text is properly translated in Chinese
- [ ] All UI text is properly translated in English
- [ ] All UI text is properly translated in Japanese
- [ ] Language switching preserves game state
- [ ] No missing translation keys (like correctFeedbackFor)

## Test Results Record

### Test Date: _____________
### Tester: _____________
### Test Environment: _____________
- Browser: _____________
- Operating System: _____________
- Screen Resolution: _____________

### Test Results:
- Total Check Items: _____ items
- Passed: _____ items
- Failed: _____ items
- Success Rate: _____ %

### Issues Found:
1. ________________________________
2. ________________________________
3. ________________________________

### Improvement Suggestions:
1. ________________________________
2. ________________________________
3. ________________________________

### Additional Notes:
- Game deployed at: https://seoker.tw/guess_number
- All automated tests passing: 46/46 test cases
- CSS refactored for consistent history item heights
- Feedback correction system implemented
- Ordinal numbering added to all history items