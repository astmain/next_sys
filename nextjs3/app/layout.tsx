import type { Metadata } from 'next'
import './globals.css'
import AppContextProvider from '@/componets/common/AppContext'

export const metadata: Metadata = {
  title: 'nextjs3',
  description: '我的学习nextjs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AppContextProvider>{children}</AppContextProvider> 
      </body>
    </html>
  )
}
