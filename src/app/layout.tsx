import type { Metadata } from 'next'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Container, CssBaseline } from '@mui/material'
import '@/style/globals.css'
import { getLocale, getMessages } from 'next-intl/server'
import ServiceWorkerRegistration from '@/components/common/ServiceWorkerRegistration'
import Providers from '@/providers'

export const metadata: Metadata = {
  title: 'Plate spottr',
  description: 'Kan du hitta alla registreringsnummer?',
  keywords: 'platespotting,plate,spott,spotting',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Plate spottr',
    startupImage: '/icons/logo_x512.png',
  },
  icons: {
    icon: '/icons/logo_x192.png',
    apple: '/icons/logo_x192.png',
  },
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} style={{ userSelect: 'none', overscrollBehavior: 'none' }}>
      <head>
        <link rel='icon' href='/icons/logo.svg' sizes='any' />
      </head>
      <body
        style={{
          background: 'var(--background-gradient)',
          userSelect: 'none',
          overscrollBehavior: 'none',
          textWrap: 'pretty',
        }}
      >
        <Providers messages={messages} locale={locale}>
          <CssBaseline />
          <Container sx={{ px: { xs: 0, md: 2 } }}>{children}</Container>
          <ServiceWorkerRegistration />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
