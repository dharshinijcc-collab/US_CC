import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import './animations.css'
import './global-styles.css'
import './responsive.css'
import GlobalCursorGlow from '@/components/effects/GlobalCursorGlow'
import ScrollReveal from '@/components/ScrollReveal'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

// Metadata
export const metadata: Metadata = {
  title: 'US CC - Venture Studio',
  description: 'Building the next generation of digital infrastructure and ventures.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={`${inter.variable} ${manrope.variable} antialiased`}
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
        }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}








