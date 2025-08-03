'use client'

import { createContext, useCallback, useContext, useMemo } from 'react'
import {
  useAddFriendRequest,
  useConfirmFriendRequest,
  useFriendsQuery,
  useIncomingFriendRequestsQuery,
  useOutgoingFriendRequestsQuery,
  useRemoveFriend,
} from '@/hooks/useApi'
import type { IFriendsTabs, IProviderProps } from '@/types/common'
import type { IFriendsContext } from '@/types/friends'
import type { IUser } from '@/types/user'
import { useUser } from './userProvider'

const FriendsContext = createContext<IFriendsContext | undefined>(undefined)

const FriendsProvider = ({ children }: IProviderProps) => {
  const { user } = useUser()

  const { data: friendsAll = [], isLoading: friendsLoading } = useFriendsQuery(user?.id || '')
  const { data: incomingRequests = [], isLoading: incomingLoading } = useIncomingFriendRequestsQuery(user?.id || '')
  const { data: outgoingRequests = [], isLoading: outgoingLoading } = useOutgoingFriendRequestsQuery(user?.id || '')

  const addFriendMutation = useAddFriendRequest()
  const confirmFriendMutation = useConfirmFriendRequest()
  const removeFriendMutation = useRemoveFriend()

  const awaitingFriends = useMemo(
    () => incomingRequests.sort((a: IUser, b: IUser) => a.name.localeCompare(b.name)),
    [incomingRequests]
  )

  const friendRequests = useMemo(
    () => outgoingRequests.sort((a: IUser, b: IUser) => a.name.localeCompare(b.name)),
    [outgoingRequests]
  )

  const friendList = useMemo(() => friendsAll.sort((a: IUser, b: IUser) => a.name.localeCompare(b.name)), [friendsAll])

  const addFriend = useCallback(
    (friendSlug: string) => {
      if (user?.id) {
        addFriendMutation.mutate({ requesterId: user.id, receiverSlug: friendSlug })
      }
      return friendRequests.length
    },
    [user?.id, addFriendMutation, friendRequests.length]
  )

  const removeFriend = useCallback(
    (friendSlug: string, tab: IFriendsTabs): number => {
      if (user?.id) {
        removeFriendMutation.mutate({ userId: user.id, otherUserSlug: friendSlug })
      }

      if (tab === 'awaiting') {
        return awaitingFriends.length - 1
      } else if (tab === 'requests') {
        return friendRequests.length - 1
      }
      return friendList.length - 1
    },
    [user?.id, removeFriendMutation, awaitingFriends.length, friendRequests.length, friendList.length]
  )

  const removeAllFriends = useCallback(() => {
    // This would need to be implemented as a bulk operation if the API supports it
    console.log('Remove all friends - not implemented')
  }, [])

  const resetFriends = useCallback(() => {
    // This would clear the cache
    console.log('Reset friends - not implemented')
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
      isLoading: friendsLoading || incomingLoading || outgoingLoading,
      confirmFriendRequest: confirmFriendMutation.mutate,
      isConfirmingFriend: confirmFriendMutation.isPending,
    }),
    [
      friendsAll,
      friendRequests,
      awaitingFriends,
      friendList,
      addFriend,
      removeFriend,
      removeAllFriends,
      resetFriends,
      friendsLoading,
      incomingLoading,
      outgoingLoading,
      confirmFriendMutation,
    ]
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
