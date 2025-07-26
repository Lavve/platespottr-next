import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { IFriendsContext } from '@/types/friends'
import type { IUser } from '@/types/user'
import { generateSlug } from '@/utils/generateSlug'

const defaultFriends: IUser[] = [
  {
    name: 'John',
    plates: [Date.now(), Date.now() - 1000 * 60 * 60 * 24 * 5, Date.now() - 1000 * 60 * 60 * 24 * 22],
    requesting: true,
    slug: generateSlug(),
  },
  {
    name: 'Jane',
    plates: [Date.now(), Date.now() - 1000 * 60 * 60 * 24, Date.now() - 1000 * 60 * 60 * 24 * 2],
    requesting: true,
    slug: generateSlug(),
  },
  {
    name: 'Evan',
    plates: [
      Date.now(),
      Date.now() - 1000 * 60 * 60 * 24,
      Date.now() - 1000 * 60 * 60 * 24 * 3,
      Date.now() - 1000 * 60 * 60 * 24 * 9,
      Date.now() - 1000 * 60 * 60 * 24 * 27,
      Date.now() - 1000 * 60 * 60 * 24 * 28,
      Date.now() - 1000 * 60 * 60 * 24 * 30,
      Date.now() - 1000 * 60 * 60 * 24 * 31,
      Date.now() - 1000 * 60 * 60 * 24 * 32,
      Date.now() - 1000 * 60 * 60 * 24 * 56,
    ],
    friendSince: Date.now() - 1000 * 60 * 60 * 24 * 24,
    requesting: false,
    slug: generateSlug(),
  },
  {
    name: 'Boris',
    plates: [Date.now() - 1000 * 60 * 60 * 24 * 4, Date.now() - 1000 * 60 * 60 * 24 * 22],
    friendSince: Date.now() - 1000 * 60 * 60 * 24 * 10,
    requesting: false,
    slug: generateSlug(),
  },
  {
    name: 'Roland',
    plates: [Date.now() - 1000 * 60 * 60 * 24 * 2, Date.now() - 1000 * 60 * 60 * 24 * 3],
    requesting: true,
    slug: generateSlug(),
  },
]

const FriendsContext = createContext<IFriendsContext | undefined>(undefined)

const FriendsProvider = ({ children }: { children: React.ReactNode }) => {
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
      console.log('removeFriend', newFriends)
      setFriends(newFriends)
      localStorage.setItem('PS_friends', JSON.stringify(newFriends))
    },
    [friends]
  )

  const value = useMemo(
    () => ({ friends, friendRequests, friendList, addFriend, removeFriend }),
    [friends, friendRequests, friendList, addFriend, removeFriend]
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
