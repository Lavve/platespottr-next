import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultFriends } from '@/constants/friends'
import type { IProviderProps } from '@/types/common'
import type { IFriendsContext } from '@/types/friends'
import type { IUser } from '@/types/user'

const FriendsContext = createContext<IFriendsContext | undefined>(undefined)

const FriendsProvider = ({ children }: IProviderProps) => {
  const [friends, setFriends] = useState<IUser[]>(defaultFriends)

  const friendRequests = useMemo(
    () => friends.filter(friend => friend.requesting).sort((a, b) => a.name.localeCompare(b.name)) || [],
    [friends]
  )
  const friendList = useMemo(
    () => friends.filter(friend => !friend.requesting).sort((a, b) => a.name.localeCompare(b.name)) || [],
    [friends]
  )

  useEffect(() => {
    const storedFriends = localStorage.getItem('PS_friends')
    if (storedFriends) {
      setFriends(JSON.parse(storedFriends))
    } else {
      setFriends(defaultFriends)
      localStorage.setItem('PS_friends', JSON.stringify(defaultFriends))
    }
  }, [])

  const addFriend = useCallback(
    (friend: IUser) => {
      const filteredFriends = friends.filter(f => f.name !== friend.name)
      const newFriends = [...filteredFriends, { ...friend, requesting: false, friendSince: Date.now() }]
      setFriends(newFriends)
      localStorage.setItem('PS_friends', JSON.stringify(newFriends))
    },
    [friends]
  )

  const removeFriend = useCallback(
    (name: string) => {
      const newFriends = friends.filter(friend => friend.name !== name)
      setFriends(newFriends)
      localStorage.setItem('PS_friends', JSON.stringify(newFriends))
    },
    [friends]
  )

  const resetFriends = useCallback(() => {
    setFriends(defaultFriends)
    localStorage.setItem('PS_friends', JSON.stringify(defaultFriends))
  }, [])

  const value = useMemo(
    () => ({ friends, friendRequests, friendList, addFriend, removeFriend, resetFriends }),
    [friends, friendRequests, friendList, addFriend, removeFriend, resetFriends]
  )

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
}

export const useFriends = () => {
  const context = useContext(FriendsContext)
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider')
  }
  return context
}

export default FriendsProvider
