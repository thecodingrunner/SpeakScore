import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const VALID_LOCALES = ['en', 'ja']

export default clerkMiddleware(async (auth, request) => {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  // Only auto-detect if no valid locale cookie is set yet
  if (!cookieLocale || !VALID_LOCALES.includes(cookieLocale)) {
    const acceptLanguage = request.headers.get('accept-language') ?? ''
    const locale = acceptLanguage.toLowerCase().includes('ja') ? 'ja' : 'en'
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
    return response
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
