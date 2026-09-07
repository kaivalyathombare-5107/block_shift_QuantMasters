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
      <head>
        <script
          id="safe-json-patch"
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  if (typeof window === 'undefined') return;
  var origStringify = JSON.stringify;
  JSON.stringify = function(value, replacer, space) {
    try {
      return origStringify(value, replacer, space);
    } catch (err) {
      if (err && (err.name === 'TypeError' || String(err).indexOf('circular') !== -1)) {
        var seen = new WeakSet();
        return origStringify(value, function(key, val) {
          if (typeof val === 'object' && val !== null) {
            if (typeof Node !== 'undefined' && val instanceof Node) {
              return '[' + (val.nodeName || 'DOM Node') + ']';
            }
            if (seen.has(val)) {
              return '[Circular]';
            }
            seen.add(val);
          }
          if (typeof replacer === 'function') {
            return replacer(key, val);
          }
          return val;
        }, space);
      }
      throw err;
    }
  };
})();
            `.trim(),
          }}
        />
      </head>
      <body className={`${inter.variable} ${space.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
