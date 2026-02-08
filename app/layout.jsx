import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import ThemeToggleWidget from '../components/global/ThemeToggleWidget'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
// import { PHProvider } from './providers'

export const metadata = {
  title: 'YourSaaS - Build Faster',
  description: 'Production-ready SaaS template',
}

export default function RootLayout({ children }) {

  return (
    <ClerkProvider>
      <html lang="en" data-theme="light" className='scroll-smooth'>
        <body suppressHydrationWarning >
          {/* <PHProvider> */}
            <ThemeToggleWidget />
            <SubscriptionProvider>
              {children}
            </SubscriptionProvider>
          {/* </PHProvider> */}
        </body>
      </html>
    </ClerkProvider>
  )
}