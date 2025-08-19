import { test, expect, Page } from '@playwright/test'

test.describe('Digit Input System E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/guess_number/')
    
    // Start the game
    const startButton = page.locator('text=Start Game')
    if (await startButton.isVisible()) {
      await startButton.click()
      await page.waitForTimeout(1000)
    }
  })

  test('should display 4 digit input boxes', async ({ page }) => {
    // Check all 4 digit inputs are present
    for (let i = 0; i < 4; i++) {
      const input = page.locator(`#digit-${i}`)
      await expect(input).toBeVisible()
      await expect(input).toHaveAttribute('maxlength', '1')
      await expect(input).toHaveAttribute('inputmode', 'numeric')
    }
  })

  test('should handle sequential digit input (1234)', async ({ page }) => {
    // Enter digits sequentially
    for (let i = 0; i < 4; i++) {
      await page.locator(`#digit-${i}`).fill((i + 1).toString())
    }
    
    // Verify all digits are entered correctly
    for (let i = 0; i < 4; i++) {
      await expect(page.locator(`#digit-${i}`)).toHaveValue((i + 1).toString())
    }
    
    // Check that guess button is enabled
    const guessButton = page.locator('button:has-text("Guess")')
    await expect(guessButton).toBeEnabled()
  })

  test('should handle out-of-order digit input', async ({ page }) => {
    // Enter 3rd digit first
    await page.locator('#digit-2').fill('7')
    await expect(page.locator('#digit-2')).toHaveValue('7')
    
    // Enter 1st digit
    await page.locator('#digit-0').fill('3')
    await expect(page.locator('#digit-0')).toHaveValue('3')
    await expect(page.locator('#digit-2')).toHaveValue('7') // Should preserve 3rd digit
    
    // Fill remaining digits
    await page.locator('#digit-1').fill('5')
    await page.locator('#digit-3').fill('9')
    
    // Verify final state
    await expect(page.locator('#digit-0')).toHaveValue('3')
    await expect(page.locator('#digit-1')).toHaveValue('5')
    await expect(page.locator('#digit-2')).toHaveValue('7')
    await expect(page.locator('#digit-3')).toHaveValue('9')
    
    // Button should be enabled
    const guessButton = page.locator('button:has-text("Guess")')
    await expect(guessButton).toBeEnabled()
  })

  test('should handle sparse input (gaps between digits)', async ({ page }) => {
    // Enter digits with gaps: _2_4
    await page.locator('#digit-1').fill('2')
    await page.locator('#digit-3').fill('4')
    
    await expect(page.locator('#digit-1')).toHaveValue('2')
    await expect(page.locator('#digit-3')).toHaveValue('4')
    
    // Button should be disabled with incomplete input
    const guessButton = page.locator('button:has-text("Guess")')
    await expect(guessButton).toBeDisabled()
    
    // Fill remaining digits
    await page.locator('#digit-0').fill('1')
    await page.locator('#digit-2').fill('3')
    
    // Now button should be enabled
    await expect(guessButton).toBeEnabled()
  })

  test('should handle digit overwriting', async ({ page }) => {
    // Enter initial digits
    await page.locator('#digit-0').fill('1')
    await page.locator('#digit-1').fill('2')
    
    // Overwrite first digit
    await page.locator('#digit-0').fill('9')
    
    await expect(page.locator('#digit-0')).toHaveValue('9')
    await expect(page.locator('#digit-1')).toHaveValue('2')
  })

  test('should only accept numeric digits', async ({ page }) => {
    const input = page.locator('#digit-0')
    
    // Try to enter non-numeric characters
    await input.fill('a')
    await expect(input).toHaveValue('')
    
    await input.fill('!')
    await expect(input).toHaveValue('')
    
    // Valid digit should work
    await input.fill('5')
    await expect(input).toHaveValue('5')
  })

  test('should manage guess button state correctly', async ({ page }) => {
    const guessButton = page.locator('button:has-text("Guess")')
    
    // Initially disabled
    await expect(guessButton).toBeDisabled()
    
    // Still disabled with incomplete input
    await page.locator('#digit-0').fill('1')
    await page.locator('#digit-1').fill('2')
    await page.locator('#digit-2').fill('3')
    await expect(guessButton).toBeDisabled()
    
    // Enabled with complete input
    await page.locator('#digit-3').fill('4')
    await expect(guessButton).toBeEnabled()
    
    // Disabled again when clearing a digit
    await page.locator('#digit-2').fill('')
    await expect(guessButton).toBeDisabled()
  })

  test('should clear all digits and re-enter', async ({ page }) => {
    // Fill all digits
    await page.locator('#digit-0').fill('1')
    await page.locator('#digit-1').fill('2')
    await page.locator('#digit-2').fill('3')
    await page.locator('#digit-3').fill('4')
    
    // Clear all
    for (let i = 0; i < 4; i++) {
      await page.locator(`#digit-${i}`).fill('')
    }
    
    // Re-enter new digits
    await page.locator('#digit-0').fill('9')
    await page.locator('#digit-1').fill('8')
    await page.locator('#digit-2').fill('7')
    await page.locator('#digit-3').fill('6')
    
    // Verify
    await expect(page.locator('#digit-0')).toHaveValue('9')
    await expect(page.locator('#digit-1')).toHaveValue('8')
    await expect(page.locator('#digit-2')).toHaveValue('7')
    await expect(page.locator('#digit-3')).toHaveValue('6')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus first input
    await page.locator('#digit-0').focus()
    
    // Enter digit and check automatic focus move
    await page.keyboard.type('1')
    await expect(page.locator('#digit-0')).toHaveValue('1')
    
    // Continue with automatic navigation
    await page.keyboard.type('2')
    await expect(page.locator('#digit-1')).toHaveValue('2')
    
    await page.keyboard.type('3')
    await expect(page.locator('#digit-2')).toHaveValue('3')
    
    await page.keyboard.type('4')
    await expect(page.locator('#digit-3')).toHaveValue('4')
  })

  test('should handle backspace navigation', async ({ page }) => {
    // Fill some digits
    await page.locator('#digit-0').fill('1')
    await page.locator('#digit-1').fill('2')
    await page.locator('#digit-2').fill('3')
    
    // Focus third input and backspace
    await page.locator('#digit-2').focus()
    await page.keyboard.press('Backspace')
    
    // Should clear current digit
    await expect(page.locator('#digit-2')).toHaveValue('')
    
    // Another backspace should move to previous digit
    await page.keyboard.press('Backspace')
    await expect(page.locator('#digit-1')).toHaveValue('')
  })
})