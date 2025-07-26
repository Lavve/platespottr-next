'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import FriendsProvider from '@/providers/friendsProvider'
import SettingsProvider from '@/providers/settingsProvider'
import UserProvider from '@/providers/userProvider'
import { darkTheme } from '@/style/theme'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <SettingsProvider>
        <UserProvider>
          <FriendsProvider>{children}</FriendsProvider>
        </UserProvider>
      </SettingsProvider>
    </MuiThemeProvider>
  )
}

export default Providers
