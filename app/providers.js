'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

/* ─────────────────────────────────────────────
   Provider — initialises PostHog once on mount
   ───────────────────────────────────────────── */
export function PHProvider({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: false,     // we fire $pageview manually below
      capture_pageleave: true,
      persistence: 'localStorage',
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug()
      },
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

/* ─────────────────────────────────────────────
   PostHogPageView — tracks SPA navigation and
   identifies the signed-in Clerk user.
   Must be wrapped in <Suspense> in the layout
   because useSearchParams() requires it.
   ───────────────────────────────────────────── */
export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()

  // Identify / reset user whenever auth state changes
  useEffect(() => {
    if (!isLoaded) return
    if (user) {
      posthog.identify(user.id, {
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      })
    } else {
      posthog.reset()
    }
  }, [isLoaded, user])

  // Capture $pageview on every route change
  useEffect(() => {
    if (!pathname) return
    const qs = searchParams.toString()
    const url = window.origin + pathname + (qs ? `?${qs}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}
