'use client'

import FriendsProvider from '@/providers/friendsProvider'
import SettingsProvider from '@/providers/settingsProvider'
import UserProvider from '@/providers/userProvider'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SettingsProvider>
      <UserProvider>
        <FriendsProvider>{children}</FriendsProvider>
      </UserProvider>
    </SettingsProvider>
  )
}

export default Providers
