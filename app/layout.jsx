import { ClerkProvider } from '@clerk/nextjs'
import { Suspense } from 'react'
import './globals.css'
import ThemeToggleWidget from '../components/global/ThemeToggleWidget'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { PHProvider, PostHogPageView } from './providers'

export const metadata = {
  title: 'SpeakScore - Pronunciation Practice',
  description: 'AI-powered English pronunciation coaching',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light" className='scroll-smooth'>
        <body suppressHydrationWarning>
          <PHProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            <ThemeToggleWidget />
            <SubscriptionProvider>
              {children}
            </SubscriptionProvider>
          </PHProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}