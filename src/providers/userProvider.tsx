import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultUser } from '@/constants/user'
import type { IProviderProps } from '@/types/common'
import type { IUser, IUserContext } from '@/types/user'
import { generateSlug } from '@/utils/generateSlug'

const UserContext = createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: IProviderProps) => {
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

  const resetUser = useCallback(() => {
    const newUser = { ...defaultUser, slug: generateSlug() }
    setUser(newUser)
    localStorage.setItem('PS_user', JSON.stringify(newUser))
  }, [])

  const value = useMemo(() => ({ user, saveUser, resetUser }), [user, saveUser, resetUser])

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
