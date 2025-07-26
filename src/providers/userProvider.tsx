import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultUser } from '@/constants/user'
import type { IUser, IUserContext } from '@/types/user'

const UserContext = createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('PS_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      localStorage.setItem('PS_user', JSON.stringify(defaultUser))
      setUser(defaultUser)
    }
  }, [])

  const saveUser = useCallback((user: IUser) => {
    setUser(user)
    localStorage.setItem('PS_user', JSON.stringify(user))
  }, [])

  const value = useMemo(() => ({ user, saveUser }), [user, saveUser])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserProvider
