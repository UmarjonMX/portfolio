import { describe, it, expect } from 'vitest'
import translations from './translations'

// Recursively collect the "shape" of an object as a sorted list of dotted key
// paths. Arrays are represented by their length + the shape of each element so
// that structural parity between locales is enforced, not just key names.
function shapeOf(value, prefix = '') {
  if (Array.isArray(value)) {
    return [
      `${prefix}[]:len=${value.length}`,
      ...value.flatMap((item, i) => shapeOf(item, `${prefix}[${i}]`)),
    ]
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .flatMap((key) => shapeOf(value[key], prefix ? `${prefix}.${key}` : key))
  }
  return [`${prefix}:${typeof value}`]
}

function collectStrings(value, path = '') {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => collectStrings(item, `${path}[${i}]`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      collectStrings(v, path ? `${path}.${k}` : k),
    )
  }
  if (typeof value === 'string') {
    return [[path, value]]
  }
  return []
}

const LOCALES = ['en', 'uz']

describe('translations', () => {
  it('exposes exactly the expected locales', () => {
    expect(Object.keys(translations).sort()).toEqual([...LOCALES].sort())
  })

  it('has identical structure across en and uz', () => {
    const en = shapeOf(translations.en)
    const uz = shapeOf(translations.uz)
    expect(uz).toEqual(en)
  })

  it('has the same top-level sections in every locale', () => {
    const expected = Object.keys(translations.en).sort()
    for (const locale of LOCALES) {
      expect(Object.keys(translations[locale]).sort()).toEqual(expected)
    }
  })

  it('keeps projects and resume item counts in sync across locales', () => {
    expect(translations.uz.projects.items).toHaveLength(
      translations.en.projects.items.length,
    )
    expect(translations.uz.resume.items).toHaveLength(
      translations.en.resume.items.length,
    )
  })

  describe.each(LOCALES)('locale "%s"', (locale) => {
    const strings = collectStrings(translations[locale])

    it('contains no empty or whitespace-only strings', () => {
      const empties = strings.filter(([, v]) => v.trim() === '')
      expect(empties).toEqual([])
    })

    it('every project item has a title, description and non-empty tech list', () => {
      for (const item of translations[locale].projects.items) {
        expect(item.title.trim()).not.toBe('')
        expect(item.description.trim()).not.toBe('')
        expect(Array.isArray(item.tech)).toBe(true)
        expect(item.tech.length).toBeGreaterThan(0)
      }
    })

    it('every resume item has type/title/company/date/desc', () => {
      for (const item of translations[locale].resume.items) {
        for (const field of ['type', 'title', 'company', 'date', 'desc']) {
          expect(typeof item[field]).toBe('string')
          expect(item[field].trim()).not.toBe('')
        }
      }
    })
  })

  it('shares locale-independent contact values across locales', () => {
    expect(translations.uz.contact.emailValue).toBe(
      translations.en.contact.emailValue,
    )
    expect(translations.uz.contact.phoneValue).toBe(
      translations.en.contact.phoneValue,
    )
  })
})
