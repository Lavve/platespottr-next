import type { Metadata } from 'next'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Container } from '@mui/material'
import '@/style/globals.css'
import Providers from '@/providers'

export const metadata: Metadata = {
  title: 'Plate spottr',
  description: 'Kan du hitta alla registreringsnummer?',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Plate spottr',
    startupImage: '/icons/logo_x512.png',
  },
  icons: {
    icon: '/icons/logo_x192.png',
    apple: '/icons/logo_x192.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='sv'>
      <head>
        <link rel='icon' href='/icons/logo.svg' sizes='any' />
      </head>
      <body style={{ background: 'var(--background-gradient)' }}>
        <Providers>
          <Container>{children}</Container>
        </Providers>
      </body>
    </html>
  )
}
