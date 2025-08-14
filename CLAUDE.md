# Claude Code Configuration

## Mandatory Rules

### Always Test and Lint
- **ALWAYS** run tests after modifying any code: `npm test`
- **ALWAYS** run linter after modifying any code: `npm run lint`
- Fix any test failures or lint errors before marking tasks complete
- Only mark tasks as done after both tests pass and linting is clean

### Code Quality Standards
- Follow existing code patterns and conventions in the codebase
- Use existing libraries and utilities already present
- No comments unless explicitly requested by the user
- **Always use English in comments** - never use Chinese, Japanese, or other languages in code comments
- **Use TypeScript** - all new files should be .ts/.tsx with proper type annotations
- Maintain responsive design across all screen sizes
- Support all existing languages (English, Chinese, Japanese)

## Project Context

This is a **1A2B Number Guessing Game** built with React + Vite + TypeScript:
- Players and computer try to guess each other's 4-digit numbers
- A = correct digit in correct position
- B = correct digit in wrong position
- Supports multiple languages via i18n
- Has game records and history tracking

## Key Architecture

### Core Files
- `src/components/GameUI.tsx` - Main game interface with 4-digit input system
- `src/hooks/useGameLogic.ts` - Game state management and AI logic
- `src/hooks/useGameRecords.ts` - Game history persistence
- `src/types/index.ts` - TypeScript type definitions
- `src/i18n/` - Internationalization files

### Testing Structure
- `tests/unit/` - Component unit tests (TypeScript)
- `tests/integration/` - Full app integration tests (TypeScript)
- `tests/e2e/` - End-to-end browser tests with Playwright (TypeScript)

## Testing Commands

```bash
# All tests
npm test

# Specific test types
npm test -- tests/unit/
npm test -- tests/integration/  
npm test -- tests/e2e/

# Lint
npm run lint

# Development server
npm run dev

# Build
npm run build
```

## Game Logic Rules

### Win Conditions
- Player wins: Guesses computer's number first
- Computer wins: Guesses player's number first
- **Draw**: Both guess correctly in the same round (implement this)

### Input System
- 4 separate digit input boxes (not single input field)
- Must support out-of-order digit entry
- Validate numeric input only
- Button disabled until all 4 digits entered

## Development Guidelines

### When Making Changes
1. Understand existing patterns first
2. Make minimal, targeted changes
3. **Run tests immediately**: `npm test`
4. **Run linter immediately**: `npm run lint`
5. Fix any failures before proceeding
6. Verify functionality works in browser

### Testing Requirements
- Add unit tests for new components/functions
- Add integration tests for user flows
- Add e2e regression tests for bug fixes
- Ensure all existing tests still pass

## TypeScript Configuration

### Compiler Settings
- `tsconfig.json` - Main TypeScript configuration with strict type checking
- `tsconfig.node.json` - Node.js specific TypeScript configuration for build tools
- `vite.config.ts` - Vite configuration with TypeScript support

### Type Definitions
- `src/types/index.ts` - Centralized type definitions for:
  - Game state and logic types
  - Component prop interfaces  
  - API response types
  - Hook return types

### Best Practices
- Use React.FC for functional components
- Add return type annotations to all functions
- Use proper TypeScript generics for hooks (useState, useRef, etc.)
- Import types from centralized types file

## Recent Important Changes

### TypeScript Migration (Completed)
- Converted entire codebase from JavaScript to TypeScript
- Added comprehensive type definitions for all components and hooks
- Updated test files to TypeScript with proper typing
- All builds and core functionality verified working

### Digit Input System (Fixed)
- Bug: Couldn't enter digits out of order (e.g., 3rd then 1st)
- Fix: Proper handling of sparse input state in React controlled inputs
- Tests: Comprehensive regression tests in `tests/e2e/digit-order-regression.test.js`

### Areas Needing Attention
- [ ] Implement draw condition when both players succeed in same round
- [ ] Ensure all UI states handle the draw condition properly
- [ ] Add proper draw record labeling in game history

## Debugging Commands

```bash
# Check dev server port
lsof -i :5173

# Debug browser tests
node debug-script.js

# Check test coverage (if configured)
npm run test:coverage
```

## Notes

- Always use existing i18n keys for text
- Maintain glass morphism design system
- Keep mobile-first responsive approach
- Follow React hooks patterns already established
- Use Vitest for testing, Playwright for e2e