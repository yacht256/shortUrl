import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { links } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'
import { generateSlug, validateCustomSlug } from '@/lib/slugs'
import { getSession } from '@/lib/session'
import { env } from '@/lib/env'

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db.select().from(links).orderBy(desc(links.createdAt))
  return NextResponse.json({ links: rows })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body.url !== 'string' || !body.url.trim()) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  let targetUrl: string
  try {
    const parsed = new URL(body.url.trim())
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'url must use http or https' }, { status: 400 })
    }
    targetUrl = parsed.toString()
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  let slug: string
  if (body.slug) {
    const validation = validateCustomSlug(body.slug)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    slug = body.slug
  } else {
    slug = generateSlug()
    const existing = await db.select().from(links).where(eq(links.slug, slug))
    if (existing.length > 0) {
      slug = generateSlug()
    }
  }

  try {
    const [created] = await db.insert(links).values({ slug, targetUrl }).returning()
    return NextResponse.json(
      { link: created, shortUrl: `${env.BASE_URL}/${created.slug}` },
      { status: 201 }
    )
  } catch (err: unknown) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: `Slug "${slug}" is already taken` }, { status: 409 })
    }
    console.error('Failed to create link:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === '23505'
  )
}
