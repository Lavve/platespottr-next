'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import type { AbstractIntlMessages } from 'next-intl'
import type { ReactNode } from 'react'
import FriendsProvider from '@/providers/friendsProvider'
import SettingsProvider from '@/providers/settingsProvider'
import UserProvider from '@/providers/userProvider'
import { darkTheme } from '@/style/theme'
import { I18nClientProvider } from './I18nClientProvider'

type IProvidersProps = {
  messages: AbstractIntlMessages
  locale: string
  children: ReactNode
}

const Providers = ({ messages, locale, children }: IProvidersProps) => {
  return (
    <I18nClientProvider messages={messages} locale={locale}>
      <MuiThemeProvider theme={darkTheme}>
        <SettingsProvider>
          <UserProvider>
            <FriendsProvider>{children}</FriendsProvider>
          </UserProvider>
        </SettingsProvider>
      </MuiThemeProvider>
    </I18nClientProvider>
  )
}

export default Providers
