import type { Metadata } from 'next'
import './globals.css'

import '@arco-design/web-react/dist/css/arco.css'

export const metadata: Metadata = {
  title: '我的nextjs',
  description: '学习nextjs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  )
}
