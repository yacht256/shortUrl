import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { links } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const [link] = await db.select().from(links).where(eq(links.slug, slug))

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.redirect(link.targetUrl, { status: 302 })
}
