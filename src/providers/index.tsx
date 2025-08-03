'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { SnackbarProvider } from '@/components/common/SnackbarProvider'
import theme, { darkTheme } from '@/style/theme'
import FriendsProvider from './friendsProvider'
import SettingsProvider, { useSettings } from './settingsProvider'
import UserProvider from './userProvider'

interface ProvidersProps {
  children: React.ReactNode
  messages: Record<string, unknown>
  locale: string
}

const ThemeWrapper = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings()
  const currentTheme = useMemo(() => (settings.theme === 'dark' ? darkTheme : theme), [settings.theme])

  return <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
}

const Providers = ({ children, messages, locale }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <UserProvider>
            <SettingsProvider>
              <ThemeWrapper>
                <FriendsProvider>{children}</FriendsProvider>
              </ThemeWrapper>
            </SettingsProvider>
          </UserProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}

export default Providers
