// app/layout.tsx
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Day of Week Quiz',
  description: '曜日計算練習アプリ（タイムアタック形式）',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        <header className="text-center p-4 text-xl font-bold bg-gray-800">
          曜日計算クイズ
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
