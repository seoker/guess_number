import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { FeedbackCorrectionPanel } from '../../src/components/FeedbackCorrectionPanel'
import { GameRecord } from '../../src/types'

describe('FeedbackCorrectionPanel', () => {
  const mockCorrectHistoryFeedback = vi.fn()
  const mockCancelFeedbackCorrection = vi.fn()
  const mockT = vi.fn((key: string, options?: any) => 
    options ? `${key}_${options.guess}` : key
  )

  const history: GameRecord[] = [
    { guess: '1234', result: '2A1B', isCorrect: false },
    { guess: '5678', result: '1A3B', isCorrect: false }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correction title and hint', () => {
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    expect(mockT).toHaveBeenCalledWith('correctFeedback')
    expect(mockT).toHaveBeenCalledWith('selectCorrection')
  })

  it('should render history records', () => {
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    expect(screen.getByText('1234')).toBeInTheDocument()
    expect(screen.getByText('2A1B')).toBeInTheDocument()
    expect(screen.getByText('5678')).toBeInTheDocument()
    expect(screen.getByText('1A3B')).toBeInTheDocument()

    const ordinals = screen.getAllByText(/^[12]$/)
    expect(ordinals).toHaveLength(2)
  })

  it('should select record when clicked', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    const firstRecord = screen.getByText('1234').closest('.correction-item')
    await user.click(firstRecord!)

    expect(firstRecord).toHaveClass('selected')
    expect(mockT).toHaveBeenCalledWith('correctFeedbackFor', { guess: '1234' })
  })

  it('should show correction editor when record is selected', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    const firstRecord = screen.getByText('1234').closest('.correction-item')
    await user.click(firstRecord!)

    expect(document.querySelector('.correction-editor')).toBeInTheDocument()
    expect(document.querySelector('.correction-inputs')).toBeInTheDocument()
    expect(document.querySelector('.correction-actions')).toBeInTheDocument()
  })

  it('should parse existing feedback values when record is selected', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    const firstRecord = screen.getByText('1234').closest('.correction-item')
    await user.click(firstRecord!)

    const feedbackButtons = screen.getAllByRole('button')
    const aButton = feedbackButtons.find(btn => btn.textContent === '2')
    const bButton = feedbackButtons.find(btn => btn.textContent === '1')

    expect(aButton).toBeInTheDocument()
    expect(bButton).toBeInTheDocument()
  })

  it('should handle feedback value changes', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    const firstRecord = screen.getByText('1234').closest('.correction-item')
    await user.click(firstRecord!)

    const buttons = screen.getAllByRole('button')
    const aButton = buttons.find(btn => btn.textContent === '2' && btn.className.includes('clickable'))
    await user.click(aButton!)

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should cycle feedback values from 4 to 0', async () => {
    const user = userEvent.setup()
    const historyWith4 = [{ guess: '1234', result: '4A4B', isCorrect: false }]
    
    render(
      <FeedbackCorrectionPanel
        history={historyWith4}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    const firstRecord = screen.getByText('1234').closest('.correction-item')
    await user.click(firstRecord!)

    const buttons = screen.getAllByRole('button')
    const aButton = buttons.find(btn => btn.textContent === '4' && btn.className.includes('clickable'))
    await user.click(aButton!)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should confirm correction', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    const firstRecord = screen.getByText('1234').closest('.correction-item')
    await user.click(firstRecord!)

    const confirmButton = screen.getByRole('button', { name: 'confirmCorrection' })
    await user.click(confirmButton)

    expect(mockCorrectHistoryFeedback).toHaveBeenCalledWith(0, 2, 1)
  })

  it('should cancel correction', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    // First select a record to show the cancel button
    const firstRecord = screen.getByText('1234').closest('.correction-item')
    await user.click(firstRecord!)

    const cancelButton = screen.getByRole('button', { name: 'cancelCorrection' })
    await user.click(cancelButton)

    expect(mockCancelFeedbackCorrection).toHaveBeenCalled()
  })

  it('should have proper CSS classes', () => {
    render(
      <FeedbackCorrectionPanel
        history={history}
        correctHistoryFeedback={mockCorrectHistoryFeedback}
        cancelFeedbackCorrection={mockCancelFeedbackCorrection}
        t={mockT}
      />
    )

    expect(document.querySelector('.correction-panel')).toBeInTheDocument()
    expect(document.querySelector('.correction-title')).toBeInTheDocument()
    expect(document.querySelector('.correction-hint')).toBeInTheDocument()
    expect(document.querySelector('.correction-history')).toBeInTheDocument()

    const correctionItems = document.querySelectorAll('.correction-item')
    correctionItems.forEach(item => {
      expect(item).toHaveClass('item-base')
      expect(item.querySelector('.ordinal-base')).toBeInTheDocument()
      expect(item.querySelector('.correction-ordinal')).toBeInTheDocument()
      expect(item.querySelector('.content-base')).toBeInTheDocument()
      expect(item.querySelector('.correction-content')).toBeInTheDocument()
    })
  })
})