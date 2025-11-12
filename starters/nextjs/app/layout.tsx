import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppKitProvider } from '@/lib/context'
import { Header } from '@/components/ui/header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'x402 Protocol on Avalanche - Payment-Gated Content',
  description: 'Production-ready x402 payment protocol implementation on Avalanche C-Chain. Monetize APIs and content with on-chain verification.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <AppKitProvider>
          <Header />
          {children}
        </AppKitProvider>
      </body>
    </html>
  )
}
