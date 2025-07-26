import type { Metadata } from 'next'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Container } from '@mui/material'
import '@/style/globals.css'
import { getLocale, getMessages } from 'next-intl/server'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel='icon' href='/icons/logo.svg' sizes='any' />
      </head>
      <body style={{ background: 'var(--background-gradient)', userSelect: 'none' }}>
        <Providers messages={messages} locale={locale}>
          <Container>{children}</Container>
        </Providers>
      </body>
    </html>
  )
}
