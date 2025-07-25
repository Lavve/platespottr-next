import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('middleware', request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
