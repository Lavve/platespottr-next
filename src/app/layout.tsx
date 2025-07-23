import type { Metadata } from 'next'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Container } from '@mui/material'
import { ThemeProvider } from '@/providers/ThemeProvider'
import '@/style/globals.css'

export const metadata: Metadata = {
  title: 'Platespottr',
  description: 'Hitta alla registreringsnummer!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Platespottr',
    startupImage: '/assets/icon_x512.png',
  },
  icons: {
    icon: '/assets/icon_x192.png',
    apple: '/assets/icon_x192.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='sv'>
      <body style={{ background: 'var(--background-gradient)' }}>
        <Container>
          <ThemeProvider>{children}</ThemeProvider>
        </Container>
      </body>
    </html>
  )
}
