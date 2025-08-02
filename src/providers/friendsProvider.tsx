import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultFriends } from '@/constants/friends'
import type { IFriendsTabs, IProviderProps } from '@/types/common'
import type { IFriendsContext } from '@/types/friends'
import type { IUser } from '@/types/user'

const FriendsContext = createContext<IFriendsContext | undefined>(undefined)

const FriendsProvider = ({ children }: IProviderProps) => {
  const [friendsAll, setFriendsAll] = useState<IUser[] | null>(null)

  useEffect(() => {
    const storedFriends = localStorage.getItem('PS_friends')
    if (storedFriends) {
      setFriendsAll(JSON.parse(storedFriends))
    } else {
      setFriendsAll(defaultFriends)
      localStorage.setItem('PS_friends', JSON.stringify(defaultFriends))
    }
  }, [])

  const awaitingFriends = useMemo(
    () => friendsAll?.filter(friend => friend.awaiting).sort((a, b) => a.name.localeCompare(b.name)) || [],
    [friendsAll]
  )

  const friendRequests = useMemo(
    () => friendsAll?.filter(friend => friend.requesting).sort((a, b) => a.name.localeCompare(b.name)) || [],
    [friendsAll]
  )

  const friendList = useMemo(
    () =>
      friendsAll
        ?.filter(friend => !friend.requesting && !friend.awaiting)
        .sort((a, b) => a.name.localeCompare(b.name)) || [],
    [friendsAll]
  )

  useEffect(() => {
    const storedFriends = localStorage.getItem('PS_friends')
    if (storedFriends) {
      setFriendsAll(JSON.parse(storedFriends))
    } else {
      setFriendsAll(defaultFriends)
      localStorage.setItem('PS_friends', JSON.stringify(defaultFriends))
    }
  }, [])

  const addFriend = useCallback(
    (friend: IUser) => {
      const filteredFriends = friendsAll?.filter(f => f.name !== friend.name) || []
      const newFriends = [...filteredFriends, { ...friend, requesting: false, friendSince: Date.now() }]
      setFriendsAll(newFriends)
      localStorage.setItem('PS_friends', JSON.stringify(newFriends))

      return newFriends.filter(friend => friend.requesting).length
    },
    [friendsAll]
  )

  const removeFriend = useCallback(
    (name: string, tab: IFriendsTabs): number => {
      const newFriends = friendsAll?.filter(friend => friend.name !== name) || []
      setFriendsAll(newFriends)
      localStorage.setItem('PS_friends', JSON.stringify(newFriends))

      if (tab === 'awaiting') {
        return newFriends.filter(friend => friend.awaiting).length
      } else if (tab === 'requests') {
        return newFriends.filter(friend => friend.requesting).length
      }
      return newFriends.filter(friend => !friend.awaiting && !friend.requesting).length
    },
    [friendsAll]
  )

  const removeAllFriends = useCallback(() => {
    setFriendsAll([])
    localStorage.removeItem('PS_friends')
  }, [])

  const resetFriends = useCallback(() => {
    setFriendsAll(defaultFriends)
    localStorage.setItem('PS_friends', JSON.stringify(defaultFriends))
  }, [])

  const value = useMemo(
    () => ({
      friendsAll,
      friendRequests,
      awaitingFriends,
      friendList,
      addFriend,
      removeFriend,
      removeAllFriends,
      resetFriends,
    }),
    [friendsAll, friendRequests, awaitingFriends, friendList, addFriend, removeFriend, removeAllFriends, resetFriends]
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
