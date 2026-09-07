import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
export const metadata: Metadata = {
  title: 'Block Shift QuantMasters — AI Systems Engineer',
  description: 'A digital engineering portfolio and lab for useful software, intelligent systems, and AI systems engineering.',
  openGraph: {
    title: 'Block Shift QuantMasters — AI Systems Engineer',
    description: 'A digital engineering portfolio and lab for useful software, intelligent systems, and AI systems engineering.',
  },
}
export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#08090c' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${space.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
