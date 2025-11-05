import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tomato Eating Animation',
  description: 'A 3D animated tomato eating itself',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
