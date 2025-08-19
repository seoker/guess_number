import { test, expect } from '@playwright/test'

test.describe('Digit Order Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/guess_number/')
    
    // Start the game
    const startButton = page.locator('text=Start Game')
    if (await startButton.isVisible()) {
      await startButton.click()
      await page.waitForTimeout(1000)
    }
  })

  test('regression: should preserve 3rd digit when entering 1st digit afterwards', async ({ page }) => {
    // Enter 3rd digit first (index 2)
    await page.locator('#digit-2').fill('7')
    await expect(page.locator('#digit-2')).toHaveValue('7')
    
    // Now enter 1st digit (index 0)
    await page.locator('#digit-0').fill('3')
    await expect(page.locator('#digit-0')).toHaveValue('3')
    
    // Critical: 3rd digit should still be preserved
    await expect(page.locator('#digit-2')).toHaveValue('7')
    
    // Verify other positions are empty
    await expect(page.locator('#digit-1')).toHaveValue('')
    await expect(page.locator('#digit-3')).toHaveValue('')
  })

  test('regression: should preserve 4th digit when entering earlier digits', async ({ page }) => {
    // Enter last digit first
    await page.locator('#digit-3').fill('9')
    await expect(page.locator('#digit-3')).toHaveValue('9')
    
    // Enter other digits in various order
    await page.locator('#digit-0').fill('1')
    await expect(page.locator('#digit-0')).toHaveValue('1')
    await expect(page.locator('#digit-3')).toHaveValue('9') // Should persist
    
    await page.locator('#digit-1').fill('5')
    await expect(page.locator('#digit-1')).toHaveValue('5')
    await expect(page.locator('#digit-3')).toHaveValue('9') // Should persist
    
    await page.locator('#digit-2').fill('8')
    await expect(page.locator('#digit-2')).toHaveValue('8')
    await expect(page.locator('#digit-3')).toHaveValue('9') // Should persist
    
    // Final verification
    await expect(page.locator('#digit-0')).toHaveValue('1')
    await expect(page.locator('#digit-1')).toHaveValue('5')
    await expect(page.locator('#digit-2')).toHaveValue('8')
    await expect(page.locator('#digit-3')).toHaveValue('9')
  })

  test('regression: should handle complex out-of-order entry (2nd, 4th, 1st, 3rd)', async ({ page }) => {
    // Enter in specific problematic order: 2nd, 4th, 1st, 3rd
    
    // 2nd digit (index 1)
    await page.locator('#digit-1').fill('6')
    await expect(page.locator('#digit-1')).toHaveValue('6')
    
    // 4th digit (index 3)
    await page.locator('#digit-3').fill('2')
    await expect(page.locator('#digit-3')).toHaveValue('2')
    await expect(page.locator('#digit-1')).toHaveValue('6') // Should persist
    
    // 1st digit (index 0)
    await page.locator('#digit-0').fill('4')
    await expect(page.locator('#digit-0')).toHaveValue('4')
    await expect(page.locator('#digit-1')).toHaveValue('6') // Should persist
    await expect(page.locator('#digit-3')).toHaveValue('2') // Should persist
    
    // 3rd digit (index 2) - completes the sequence
    await page.locator('#digit-2').fill('8')
    await expect(page.locator('#digit-2')).toHaveValue('8')
    
    // Final verification: 4682
    await expect(page.locator('#digit-0')).toHaveValue('4')
    await expect(page.locator('#digit-1')).toHaveValue('6')
    await expect(page.locator('#digit-2')).toHaveValue('8')
    await expect(page.locator('#digit-3')).toHaveValue('2')
    
    // Button should be enabled
    const guessButton = page.locator('button:has-text("Guess")')
    await expect(guessButton).toBeEnabled()
  })

  test('regression: should not lose earlier digits when entering later positions', async ({ page }) => {
    // Build up digits gradually, testing persistence at each step
    
    await page.locator('#digit-0').fill('1')
    await expect(page.locator('#digit-0')).toHaveValue('1')
    
    await page.locator('#digit-2').fill('3')
    await expect(page.locator('#digit-0')).toHaveValue('1') // Should persist
    await expect(page.locator('#digit-2')).toHaveValue('3')
    
    await page.locator('#digit-1').fill('2')
    await expect(page.locator('#digit-0')).toHaveValue('1') // Should persist
    await expect(page.locator('#digit-1')).toHaveValue('2')
    await expect(page.locator('#digit-2')).toHaveValue('3') // Should persist
    
    await page.locator('#digit-3').fill('4')
    await expect(page.locator('#digit-0')).toHaveValue('1') // Should persist
    await expect(page.locator('#digit-1')).toHaveValue('2') // Should persist  
    await expect(page.locator('#digit-2')).toHaveValue('3') // Should persist
    await expect(page.locator('#digit-3')).toHaveValue('4')
  })

  test('regression: should handle overwriting digits without losing others', async ({ page }) => {
    // Initial setup
    await page.locator('#digit-0').fill('1')
    await page.locator('#digit-1').fill('2')
    await page.locator('#digit-2').fill('3')
    await page.locator('#digit-3').fill('4')
    
    // Overwrite middle digit
    await page.locator('#digit-1').fill('9')
    
    // Verify only the target digit changed
    await expect(page.locator('#digit-0')).toHaveValue('1')
    await expect(page.locator('#digit-1')).toHaveValue('9') // Changed
    await expect(page.locator('#digit-2')).toHaveValue('3')
    await expect(page.locator('#digit-3')).toHaveValue('4')
    
    // Overwrite first digit
    await page.locator('#digit-0').fill('7')
    
    // Verify only the target digit changed
    await expect(page.locator('#digit-0')).toHaveValue('7') // Changed
    await expect(page.locator('#digit-1')).toHaveValue('9')
    await expect(page.locator('#digit-2')).toHaveValue('3')
    await expect(page.locator('#digit-3')).toHaveValue('4')
  })
})