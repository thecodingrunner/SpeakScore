import { ClerkProvider } from '@clerk/nextjs'
import { Suspense } from 'react'
import './globals.css'
import ThemeToggleWidget from '../components/global/ThemeToggleWidget'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { PHProvider, PostHogPageView } from './providers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export const metadata = {
  title: 'SpeakScore - Pronunciation Practice',
  description: 'AI-powered English pronunciation coaching',
}

export default async function RootLayout({ children }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <ClerkProvider>
      <html lang={locale} data-theme="light" className='scroll-smooth'>
        <body suppressHydrationWarning>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <PHProvider>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>
              <ThemeToggleWidget />
              <SubscriptionProvider>
                {children}
              </SubscriptionProvider>
            </PHProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
