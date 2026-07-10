import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import ActivityStatus from './ActivityStatus'

// The component derives the label from the current hour in UTC+5 (Uzbekistan
// time). It first normalises `new Date()` to UTC, then adds 5h, so the mapping
// is independent of the machine's timezone. We can therefore drive it purely by
// setting the system clock to a chosen UTC instant.

// Set the fake clock so that the resulting UTC+5 hour equals `uzHour`.
function setUzHour(uzHour) {
  const utcHour = ((uzHour - 5) % 24 + 24) % 24
  const hh = String(utcHour).padStart(2, '0')
  vi.setSystemTime(new Date(`2026-01-01T${hh}:30:00Z`))
}

const statusSpan = () =>
  screen.getByText((_, el) => el?.tagName === 'SPAN' && el.className.includes('font-martian'))

function renderAt(uzHour) {
  setUzHour(uzHour)
  render(<ActivityStatus />)
  return statusSpan()
}

describe('ActivityStatus', () => {
  // Only fake `Date` by default so React's passive-effect scheduler keeps using
  // real timers (faking the scheduler makes effects flush outside act()).
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const cases = [
    [0, 'Sleeping'],
    [3, 'Sleeping'],
    [6, 'Sleeping'],
    [7, 'Waking up'],
    [8, 'on the way to school'],
    [9, 'At School'],
    [12, 'At School'],
    [13, 'Lunch'],
    [14, 'Coding'],
    [17, 'Coding'],
    [18, "Rubik's Cube"],
    [19, 'Dinner'],
    [20, 'Listening to Music'],
    [21, 'Listening to Music'],
    [22, 'Late Night Coding'],
    [23, 'Late Night Coding'],
  ]

  it.each(cases)('at UTC+5 hour %i shows a status containing "%s"', (hour, expected) => {
    const el = renderAt(hour)
    expect(el.textContent.toLowerCase()).toContain(expected.toLowerCase())
  })

  it('re-evaluates the status when the recurring interval fires', () => {
    // Capture the interval callback so we can fire a "tick" without faking the
    // scheduler (which would stop React from flushing passive effects).
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
    setUzHour(3) // Sleeping
    render(<ActivityStatus />)
    const el = statusSpan()
    expect(el.textContent.toLowerCase()).toContain('sleeping')

    const tick = setIntervalSpy.mock.calls[0][0]
    expect(typeof tick).toBe('function')

    // Move the clock into the "Coding" window and fire the captured tick.
    setUzHour(15)
    act(() => {
      tick()
    })
    expect(el.textContent.toLowerCase()).toContain('coding')
  })

  it('clears its interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    setUzHour(10)
    const { unmount } = render(<ActivityStatus />)
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })
})
