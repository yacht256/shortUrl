import { validateCustomSlug } from '../slugs'

describe('URL validation logic (mirrors POST /api/links)', () => {
  function isValidUrl(raw: string): boolean {
    try {
      const parsed = new URL(raw.trim())
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  it('accepts https URL', () => expect(isValidUrl('https://example.com')).toBe(true))
  it('accepts http URL with path', () => expect(isValidUrl('http://example.com/a?b=1')).toBe(true))
  it('rejects non-URL string', () => expect(isValidUrl('not-a-url')).toBe(false))
  it('rejects ftp protocol', () => expect(isValidUrl('ftp://example.com')).toBe(false))
  it('rejects empty string', () => expect(isValidUrl('')).toBe(false))
  it('rejects whitespace-only', () => expect(isValidUrl('   ')).toBe(false))
})

describe('slug selection logic (mirrors POST /api/links)', () => {
  it('accepts valid custom slug', () => {
    expect(validateCustomSlug('my-link').valid).toBe(true)
  })
  it('rejects invalid custom slug', () => {
    expect(validateCustomSlug('bad slug!').valid).toBe(false)
  })
  it('rejects reserved slug', () => {
    expect(validateCustomSlug('api').valid).toBe(false)
  })
})
