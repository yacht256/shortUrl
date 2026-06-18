import { randomBytes } from 'node:crypto'

const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const RESERVED = new Set(['api', 'login', '_next', 'favicon', 'robots', 'sitemap'])
const SLUG_REGEX = /^[a-zA-Z0-9_-]{3,32}$/

export function generateSlug(): string {
  const bytes = randomBytes(8)
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += BASE62[bytes[i] % BASE62.length]
  }
  return result
}

export function validateCustomSlug(slug: string): { valid: boolean; error?: string } {
  if (!SLUG_REGEX.test(slug)) {
    return { valid: false, error: 'Slug must be 3-32 chars: letters, numbers, _ or -' }
  }
  if (RESERVED.has(slug.toLowerCase())) {
    return { valid: false, error: `"${slug}" is a reserved word` }
  }
  return { valid: true }
}
