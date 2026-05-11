import './globals.css'
export const metadata = { 
  title: 'BongoGPT Beta 🕌', 
  description: '155 আউলিয়া + 500 মাদ্রাসা Free' 
}
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="bn">
      <body className="bg-green-50">{children}</body>
    </html>
  )
}
