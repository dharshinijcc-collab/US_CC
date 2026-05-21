import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import './animations.css'
import GlobalCursorGlow from '@/components/effects/GlobalCursorGlow'
import ScrollReveal from '@/components/ScrollReveal'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

// Metadata
export const metadata: Metadata = {
  title: 'US CC - Venture Studio',
  description: 'Building the next generation of digital infrastructure and ventures.',
}

export const viewport = {
  width: 1200,
  initialScale: 0.3, // Adjust initial scale to fit 1200px on small screens
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0,
        }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}








