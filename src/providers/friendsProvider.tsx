'use client'

import { useTranslations } from 'next-intl'
import { createContext, useCallback, useContext, useMemo } from 'react'
import {
  useAddFriendRequest,
  useConfirmFriendRequest,
  useFriendsQuery,
  useIncomingFriendRequestsQuery,
  useOutgoingFriendRequestsQuery,
  useRemoveFriend,
} from '@/hooks/useApi'
import { useSnackbar } from '@/providers/SnackbarProvider'
import { useUser } from '@/providers/userProvider'
import { ApiError } from '@/services/api'
import type { IFriendsTabs, IProviderProps } from '@/types/common'
import type { IFriendsContext } from '@/types/friends'
import type { IUser } from '@/types/user'

const FriendsContext = createContext<IFriendsContext | undefined>(undefined)

const FriendsProvider = ({ children }: IProviderProps) => {
  const { user } = useUser()
  const { showSuccess, showError } = useSnackbar()
  const t = useTranslations()

  const userId = useMemo(() => user?.id || null, [user?.id])

  const { data: friendsAll = [], isLoading: friendsLoading } = useFriendsQuery(userId || '')
  const { data: incomingRequests = [], isLoading: incomingLoading } = useIncomingFriendRequestsQuery(userId || '')
  const { data: outgoingRequests = [], isLoading: outgoingLoading } = useOutgoingFriendRequestsQuery(userId || '')

  const addFriendMutation = useAddFriendRequest()
  const confirmFriendMutation = useConfirmFriendRequest()
  const removeFriendMutation = useRemoveFriend()

  const incomingFriendRequests = useMemo(
    () => incomingRequests.sort((a: IUser, b: IUser) => a.name.localeCompare(b.name)),
    [incomingRequests]
  )

  const outgoingFriendRequests = useMemo(() => {
    return outgoingRequests.sort((a: IUser, b: IUser) => a.name.localeCompare(b.name))
  }, [outgoingRequests])

  const friendList = useMemo(() => friendsAll.sort((a: IUser, b: IUser) => a.name.localeCompare(b.name)), [friendsAll])

  const addFriend = useCallback(
    (friendSlug: string) => {
      if (userId) {
        addFriendMutation.mutate(
          { requesterId: userId, receiverSlug: friendSlug },
          {
            onSuccess: () => {
              showSuccess(t('friends.request_sent'))
            },
            onError: error => {
              console.error('Failed to add friend:', error)
              let errorMsg = t('notifications.request_failed', { code: 'AF' })
              if (error instanceof ApiError) {
                errorMsg = t('notifications.request_failed', { code: error.status })
              }
              showError(errorMsg)
            },
          }
        )
      }
      return outgoingFriendRequests.length + 1
    },
    [userId, addFriendMutation, outgoingFriendRequests.length, showSuccess, showError, t]
  )

  const removeFriend = useCallback(
    (friendSlug: string, tab: IFriendsTabs): number => {
      if (userId) {
        removeFriendMutation.mutate(
          { userId, otherUserSlug: friendSlug },
          {
            onSuccess: () => {
              showSuccess(t('friends.friend_removed'))
            },
            onError: error => {
              console.error('Failed to remove friend:', error)
              let errorMsg = t('notifications.remove_failed', { code: 'RF' })
              if (error instanceof ApiError) {
                errorMsg = t('notifications.remove_failed', { code: error.status })
              }
              showError(errorMsg)
            },
          }
        )
      }

      if (tab === 'awaiting') {
        return incomingFriendRequests.length - 1
      } else if (tab === 'requests') {
        return outgoingFriendRequests.length - 1
      }
      return friendList.length - 1
    },
    [
      userId,
      removeFriendMutation,
      incomingFriendRequests.length,
      outgoingFriendRequests.length,
      friendList.length,
      showSuccess,
      showError,
      t,
    ]
  )

  const value = useMemo(
    () => ({
      friendsAll,
      friendRequests: outgoingFriendRequests,
      awaitingFriends: incomingFriendRequests,
      friendList,
      addFriend,
      removeFriend,
      isLoading: friendsLoading || incomingLoading || outgoingLoading,
      confirmFriendRequest: confirmFriendMutation.mutate,
      isConfirmingFriend: confirmFriendMutation.isPending,
    }),
    [
      friendsAll,
      outgoingFriendRequests,
      incomingFriendRequests,
      friendList,
      addFriend,
      removeFriend,
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
