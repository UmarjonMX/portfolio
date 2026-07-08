import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider, useLanguage } from './LanguageContext'
import translations from '../translations'

// A small consumer that surfaces the context values into the DOM so we can
// assert on them without reaching into React internals.
function Consumer({ query = 'nav.home' }) {
  const { lang, toggleLanguage, t } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="translated">{t(query)}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </div>
  )
}

function renderWithProvider(ui) {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('initial language', () => {
    it('defaults to "en" when nothing is stored', () => {
      renderWithProvider(<Consumer />)
      expect(screen.getByTestId('lang')).toHaveTextContent('en')
    })

    it('reads the persisted language from localStorage', () => {
      localStorage.setItem('language', 'uz')
      renderWithProvider(<Consumer />)
      expect(screen.getByTestId('lang')).toHaveTextContent('uz')
    })
  })

  describe('persistence side effects', () => {
    it('writes the current language to localStorage on mount', () => {
      renderWithProvider(<Consumer />)
      expect(localStorage.getItem('language')).toBe('en')
    })

    it('sets document.documentElement.lang to the active language', () => {
      localStorage.setItem('language', 'uz')
      renderWithProvider(<Consumer />)
      expect(document.documentElement.lang).toBe('uz')
    })
  })

  describe('toggleLanguage', () => {
    it('switches en -> uz and persists it', async () => {
      const user = userEvent.setup()
      renderWithProvider(<Consumer />)
      expect(screen.getByTestId('lang')).toHaveTextContent('en')

      await user.click(screen.getByRole('button', { name: 'toggle' }))

      expect(screen.getByTestId('lang')).toHaveTextContent('uz')
      expect(localStorage.getItem('language')).toBe('uz')
      expect(document.documentElement.lang).toBe('uz')
    })

    it('switches uz -> en when toggled again', async () => {
      const user = userEvent.setup()
      localStorage.setItem('language', 'uz')
      renderWithProvider(<Consumer />)

      await user.click(screen.getByRole('button', { name: 'toggle' }))

      expect(screen.getByTestId('lang')).toHaveTextContent('en')
      expect(localStorage.getItem('language')).toBe('en')
    })
  })

  describe('t() translation resolver', () => {
    it('resolves a nested key path in English', () => {
      renderWithProvider(<Consumer query="nav.about" />)
      expect(screen.getByTestId('translated')).toHaveTextContent(
        translations.en.nav.about,
      )
    })

    it('resolves the same key path in Uzbek after toggling', async () => {
      const user = userEvent.setup()
      renderWithProvider(<Consumer query="nav.about" />)
      await user.click(screen.getByRole('button', { name: 'toggle' }))
      expect(screen.getByTestId('translated')).toHaveTextContent(
        translations.uz.nav.about,
      )
    })

    it('returns the raw path when a key is missing', () => {
      renderWithProvider(<Consumer query="nav.doesNotExist" />)
      expect(screen.getByTestId('translated')).toHaveTextContent(
        'nav.doesNotExist',
      )
    })

    it('returns the raw path when an intermediate segment is missing', () => {
      renderWithProvider(<Consumer query="totally.unknown.path" />)
      expect(screen.getByTestId('translated')).toHaveTextContent(
        'totally.unknown.path',
      )
    })

    it('resolves a single top-level-then-nested value', () => {
      renderWithProvider(<Consumer query="hero.title" />)
      expect(screen.getByTestId('translated')).toHaveTextContent(
        translations.en.hero.title,
      )
    })
  })

  describe('useLanguage outside of a provider', () => {
    it('returns undefined when no provider wraps the consumer', () => {
      const onValue = vi.fn()
      function Bare() {
        onValue(useLanguage())
        return null
      }
      render(<Bare />)
      expect(onValue).toHaveBeenCalledWith(undefined)
    })
  })
})
