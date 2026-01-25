import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import ThemeToggleWidget from '../components/global/ThemeToggleWidget'
// import { PHProvider } from './providers'

export const metadata = {
  title: 'YourSaaS - Build Faster',
  description: 'Production-ready SaaS template',
}

export default function RootLayout({ children }) {

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* <PHProvider> */}
            <ThemeToggleWidget />
            {children}
          {/* </PHProvider> */}
        </body>
      </html>
    </ClerkProvider>
  )
}