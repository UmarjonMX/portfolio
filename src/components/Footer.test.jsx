import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'
import { LanguageProvider } from '../context/LanguageContext'
import translations from '../translations'

function renderFooter() {
  return render(
    <LanguageProvider>
      <Footer />
    </LanguageProvider>,
  )
}

describe('Footer', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders translated quick-link labels from the language context', () => {
    renderFooter()
    expect(
      screen.getByRole('link', { name: translations.en.nav.about }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: translations.en.nav.projects }),
    ).toBeInTheDocument()
  })

  it('links quick-links to the correct in-page anchors', () => {
    renderFooter()
    expect(
      screen.getByRole('link', { name: translations.en.nav.about }),
    ).toHaveAttribute('href', '#about')
    expect(
      screen.getByRole('link', { name: translations.en.nav.projects }),
    ).toHaveAttribute('href', '#projects')
  })

  it('renders external social links with safe rel attributes', () => {
    renderFooter()
    const github = screen.getByRole('link', { name: /github/i })
    expect(github).toHaveAttribute('href', 'https://github.com/UmarjonMX')
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('renders the email contact link', () => {
    renderFooter()
    expect(
      screen.getByRole('link', { name: /hi@umarjonmx\.com/i }),
    ).toHaveAttribute('href', 'mailto:hi@umarjonmx.com')
  })
})
