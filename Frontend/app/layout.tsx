import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
export const metadata: Metadata = { title: 'Your Name — AI Systems Engineer', description: 'A digital engineering lab for useful software, intelligent systems, and clear thinking.' }
export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#08090c' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="bg-background"><body className={`${inter.variable} ${space.variable} antialiased`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
