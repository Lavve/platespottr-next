'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import type { AbstractIntlMessages } from 'next-intl'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import FriendsProvider from '@/providers/friendsProvider'
import SettingsProvider, { useSettings } from '@/providers/settingsProvider'
import UserProvider from '@/providers/userProvider'
import theme, { darkTheme } from '@/style/theme'
import { I18nClientProvider } from './I18nClientProvider'

type IProvidersProps = {
  messages: AbstractIntlMessages
  locale: string
  children: ReactNode
}

const Providers = ({ messages, locale, children }: IProvidersProps) => {
  return (
    <I18nClientProvider messages={messages} locale={locale}>
      <SettingsProvider>
        <ThemeWrapper>{children}</ThemeWrapper>
      </SettingsProvider>
    </I18nClientProvider>
  )
}

const ThemeWrapper = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings()
  const currentTheme = useMemo(() => (settings.theme === 'dark' ? darkTheme : theme), [settings.theme])

  return (
    <UserProvider>
      <FriendsProvider>
        <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
      </FriendsProvider>
    </UserProvider>
  )
}

export default Providers
