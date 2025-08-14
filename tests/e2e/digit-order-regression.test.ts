import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { chromium, Browser, Page } from 'playwright'

describe('digit Order Regression Tests', () => {
  let browser: Browser
  let page: Page
  
  beforeEach(async () => {
    browser = await chromium.launch()
    page = await browser.newPage()
    
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('http://localhost:5173/guess_number/')
    await page.waitForLoadState('networkidle')
    
    // Start the game
    const startButton = page.locator('text=Start Game')
    if (await startButton.isVisible()) {
      await startButton.click()
      await page.waitForTimeout(1000)
    }
  })
  
  afterEach(async () => {
    await browser?.close()
  })

  test('regression: should preserve 3rd digit when entering 1st digit afterwards', async () => {
    // Clear all first
    for (let i = 0; i < 4; i++) {
      await page.locator(`#digit-${i}`).fill('')
    }
    
    // Enter 3rd digit first
    await page.locator('#digit-2').fill('8')
    const thirdDigit = await page.locator('#digit-2').inputValue()
    expect(thirdDigit).toBe('8')
    
    // Then enter 1st digit - should preserve 3rd digit
    await page.locator('#digit-0').fill('5')
    
    // Verify both digits are preserved
    const firstDigit = await page.locator('#digit-0').inputValue()
    const thirdDigitAfter = await page.locator('#digit-2').inputValue()
    
    expect(firstDigit).toBe('5')
    expect(thirdDigitAfter).toBe('8') // This was the original bug - 3rd digit would be lost
  })

  test('regression: should preserve 4th digit when entering earlier digits', async () => {
    // Clear all first
    for (let i = 0; i < 4; i++) {
      await page.locator(`#digit-${i}`).fill('')
    }
    
    // Enter 4th digit first
    await page.locator('#digit-3').fill('9')
    let fourthDigit = await page.locator('#digit-3').inputValue()
    expect(fourthDigit).toBe('9')
    
    // Enter 1st digit - should preserve 4th digit
    await page.locator('#digit-0').fill('1')
    let firstDigit = await page.locator('#digit-0').inputValue()
    fourthDigit = await page.locator('#digit-3').inputValue()
    expect(firstDigit).toBe('1')
    expect(fourthDigit).toBe('9')
    
    // Enter 2nd digit - should preserve both 1st and 4th digits
    await page.locator('#digit-1').fill('2')
    firstDigit = await page.locator('#digit-0').inputValue()
    const secondDigit = await page.locator('#digit-1').inputValue()
    fourthDigit = await page.locator('#digit-3').inputValue()
    
    expect(firstDigit).toBe('1')
    expect(secondDigit).toBe('2')
    expect(fourthDigit).toBe('9')
  })

  test('regression: should handle complex out-of-order entry (2nd, 4th, 1st, 3rd)', async () => {
    // Clear all first
    for (let i = 0; i < 4; i++) {
      await page.locator(`#digit-${i}`).fill('')
    }
    
    // Enter in order: 2nd, 4th, 1st, 3rd
    await page.locator('#digit-1').fill('7')
    await page.locator('#digit-3').fill('9')
    await page.locator('#digit-0').fill('5')
    await page.locator('#digit-2').fill('8')
    
    // Verify all digits are preserved in correct positions
    const digits = []
    for (let i = 0; i < 4; i++) {
      digits[i] = await page.locator(`#digit-${i}`).inputValue()
    }
    
    expect(digits).toStrictEqual(['5', '7', '8', '9'])
  })

  test('regression: should not lose earlier digits when entering later positions', async () => {
    // Clear all first
    for (let i = 0; i < 4; i++) {
      await page.locator(`#digit-${i}`).fill('')
    }
    
    // Enter digits with gaps: 1st, then 4th
    await page.locator('#digit-0').fill('1')
    await page.locator('#digit-3').fill('4')
    
    // Verify both are preserved
    let digits = []
    for (let i = 0; i < 4; i++) {
      digits[i] = await page.locator(`#digit-${i}`).inputValue()
    }
    expect(digits[0]).toBe('1')
    expect(digits[3]).toBe('4')
    
    // Fill the gaps
    await page.locator('#digit-1').fill('2')
    await page.locator('#digit-2').fill('3')
    
    // Verify final result
    digits = []
    for (let i = 0; i < 4; i++) {
      digits[i] = await page.locator(`#digit-${i}`).inputValue()
    }
    expect(digits).toStrictEqual(['1', '2', '3', '4'])
  })

  test('regression: should handle overwriting digits without losing others', async () => {
    // Start with some digits
    await page.locator('#digit-0').fill('1')
    await page.locator('#digit-2').fill('3')
    
    // Overwrite first digit
    await page.locator('#digit-0').fill('9')
    
    // Verify first digit changed but third digit preserved
    const firstDigit = await page.locator('#digit-0').inputValue()
    const thirdDigit = await page.locator('#digit-2').inputValue()
    
    expect(firstDigit).toBe('9')
    expect(thirdDigit).toBe('3')
  })
})