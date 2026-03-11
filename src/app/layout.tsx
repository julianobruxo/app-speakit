import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpeakUP - English A1',
  description: 'Learn to introduce yourself in English!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <div className="flex w-full min-h-screen">
          <Sidebar />
          <main className="flex-1 md:pl-64 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
