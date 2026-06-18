import { generateSlug, validateCustomSlug } from '../slugs'

describe('generateSlug', () => {
  it('returns a 6-char string', () => {
    expect(generateSlug()).toHaveLength(6)
  })

  it('only contains base62 chars', () => {
    expect(generateSlug()).toMatch(/^[a-zA-Z0-9]{6}$/)
  })

  it('generates unique slugs', () => {
    const slugs = new Set(Array.from({ length: 100 }, generateSlug))
    expect(slugs.size).toBe(100)
  })
})

describe('validateCustomSlug', () => {
  it('accepts valid slug', () => {
    expect(validateCustomSlug('my-blog').valid).toBe(true)
  })

  it('accepts 3-char minimum', () => {
    expect(validateCustomSlug('abc').valid).toBe(true)
  })

  it('accepts 32-char maximum', () => {
    expect(validateCustomSlug('a'.repeat(32)).valid).toBe(true)
  })

  it('rejects 2-char (too short)', () => {
    expect(validateCustomSlug('ab').valid).toBe(false)
  })

  it('rejects 33-char (too long)', () => {
    expect(validateCustomSlug('a'.repeat(33)).valid).toBe(false)
  })

  it('rejects spaces', () => {
    expect(validateCustomSlug('hello world').valid).toBe(false)
  })

  it('rejects slashes', () => {
    expect(validateCustomSlug('a/b').valid).toBe(false)
  })

  it('rejects reserved word: api', () => {
    expect(validateCustomSlug('api').valid).toBe(false)
  })

  it('rejects reserved word: login', () => {
    expect(validateCustomSlug('login').valid).toBe(false)
  })
})
