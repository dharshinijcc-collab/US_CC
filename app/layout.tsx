import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import './animations.css'
import GlobalCursorGlow from '@/components/effects/GlobalCursorGlow'
import ScrollReveal from '@/components/ScrollReveal'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

// Metadata
export const metadata: Metadata = {
  title: 'US CC - Venture Studio',
  description: 'Building the next generation of digital infrastructure and ventures.',
}

import { Providers } from '@/components/Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}








