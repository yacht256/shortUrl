import bcrypt from 'bcryptjs'

describe('password verification (mirrors POST /api/auth)', () => {
  // Hash of 'correct-password' — known test vector, not the production hash
  const HASH = '$2b$10$m1lipXyZeXW77DOFzWgKvOfOIYHyr7Dke1yzwfYwhdSgYfnHBITEq'

  it('accepts correct password', async () => {
    expect(await bcrypt.compare('correct-password', HASH)).toBe(true)
  })

  it('rejects wrong password', async () => {
    expect(await bcrypt.compare('wrong-password', HASH)).toBe(false)
  })

  it('rejects empty string', async () => {
    expect(await bcrypt.compare('', HASH)).toBe(false)
  })
})
