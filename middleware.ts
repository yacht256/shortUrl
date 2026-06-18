import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'short-url-session'

export function middleware(request: NextRequest) {
  const session = request.cookies.get(COOKIE_NAME)
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/api/links', '/api/links/:path*'],
}
