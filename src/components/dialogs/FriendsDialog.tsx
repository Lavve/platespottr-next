'use client'

import { FindReplace, Groups } from '@mui/icons-material'
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import VibrateIconButton from '@/components/common/VibrateIconButton'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import DialogHeader from '@/components/dialogs/DialogHeader'
import QRScannerDialog from '@/components/dialogs/QRScannerDialog'
import User from '@/components/user/User'
import { DISABLE_REFRESH_REQUESTS_TIME } from '@/constants/app'
import { useConfirmFriendRequest } from '@/hooks/useApi'
import { useVibration } from '@/hooks/useVibration'
import { useFriends } from '@/providers/friendsProvider'
import { useSnackbar } from '@/providers/SnackbarProvider'
import { useUser } from '@/providers/userProvider'
import { ApiError } from '@/services/api'
import theme from '@/style/theme'
import type { IFriendsTabs } from '@/types/common'
import type { IUser } from '@/types/user'

const FriendsDialog = () => {
  const t = useTranslations()
  const { showSuccess, showError } = useSnackbar()
  const { handleClick } = useVibration()
  const [friendToRemove, setFriendToRemove] = useState<IUser | null>(null)
  const { friendList, friendRequests, awaitingFriends, removeFriend, isLoading } = useFriends()
  const queryClient = useQueryClient()
  const { user } = useUser()
  const confirmFriendMutation = useConfirmFriendRequest()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [friendsTab, setFriendsTab] = useState<IFriendsTabs>('friends')
  const [countDown, setCountDown] = useState(DISABLE_REFRESH_REQUESTS_TIME / 1000)
  const refreshTimer = useRef<NodeJS.Timeout | null>(null)
  const countDownTimer = useRef<NodeJS.Timeout | null>(null)
  const key = useRef(0)

  useEffect(() => {
    if (friendList.length > 0) {
      setFriendsTab('friends')
    } else if (awaitingFriends.length > 0) {
      setFriendsTab('awaiting')
    } else if (friendRequests.length > 0) {
      setFriendsTab('requests')
    }
  }, [friendList, friendRequests, awaitingFriends])

  const totalFriends = useMemo(() => {
    return friendList.length + awaitingFriends.length + friendRequests.length
  }, [friendList, awaitingFriends, friendRequests])

  const friendsLength = useMemo(() => {
    return friendList.length
  }, [friendList])

  const awaitingFriendsLength = useMemo(() => {
    return awaitingFriends.length
  }, [awaitingFriends])

  const friendsRequestsLength = useMemo(() => {
    return friendRequests.length
  }, [friendRequests])

  const userList = useMemo(() => {
    if (friendsTab === 'friends') {
      return friendList
    } else if (friendsTab === 'awaiting') {
      return awaitingFriends
    } else if (friendsTab === 'requests') {
      return friendRequests
    }
    return []
  }, [friendsTab, friendList, awaitingFriends, friendRequests])

  const badgeCount = useMemo(() => {
    if (friendsTab === 'friends') {
      return friendsLength
    } else if (friendsTab === 'awaiting') {
      return awaitingFriendsLength
    } else if (friendsTab === 'requests') {
      return friendsRequestsLength
    }
    return 0
  }, [friendsTab, friendsLength, awaitingFriendsLength, friendsRequestsLength])

  const subHeader = useMemo(() => {
    if (friendsTab === 'friends') {
      return 'friends.my_friends'
    } else if (friendsTab === 'awaiting') {
      return 'friends.awaiting_friends'
    } else if (friendsTab === 'requests') {
      return 'friends.friends_requests'
    }
    return ''
  }, [friendsTab])

  const handleAddFriend = (friend: IUser) => {
    // This should confirm an incoming request, not send a new one
    if (user?.id && friend.id) {
      confirmFriendMutation.mutate(
        { receiverId: user.id, requesterId: friend.id },
        {
          onSuccess: () => {
            showSuccess(t('friends.friend_added', { name: friend.name }))
          },
          onError: error => {
            console.error('Failed to confirm friend request:', error)
            let errorMsg = t('notifications.confirm_failed', { code: 0 })
            if (error instanceof ApiError) {
              errorMsg = t('notifications.confirm_failed', { code: error.status })
            }
            showError(errorMsg)
          },
        }
      )
    }
  }

  const handleRemoveFriend = (friend: IUser) => {
    setFriendToRemove(friend)
    setConfirmOpen(true)
  }

  const handleConfirmRemoveFriend = () => {
    const friendsLeft = removeFriend(friendToRemove?.slug as string, friendsTab)
    setConfirmOpen(false)

    if ((friendsTab === 'awaiting' && friendsLeft < 1) || (friendsTab === 'requests' && friendsLeft < 1)) {
      setFriendsTab('friends')
    } else if (friendsTab === 'friends' && friendsLeft < 1) {
      setDialogOpen(false)
    }
  }

  const handleCloseDialog = () => {
    handleClick()
    setDialogOpen(false)
  }

  const startCountDown = () => {
    countDownTimer.current = setInterval(() => {
      setCountDown(prev => {
        if (prev <= 1) {
          setIsDisabled(false)
          if (countDownTimer.current) {
            clearInterval(countDownTimer.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleRefreshFriends = () => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current)
    }
    if (countDownTimer.current) {
      clearInterval(countDownTimer.current)
    }

    setCountDown(DISABLE_REFRESH_REQUESTS_TIME)
    setIsRefreshing(true)

    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ['friends', user.id] })
      queryClient.invalidateQueries({ queryKey: ['friend-requests', 'incoming', user.id] })
      queryClient.invalidateQueries({ queryKey: ['friend-requests', 'outgoing', user.id] })
    }

    // TODO: Add loading state
    refreshTimer.current = setTimeout(() => {
      setIsRefreshing(false)
      setIsDisabled(true)
      startCountDown()
    }, 1000)
  }

  const handleTabChange = (e: React.SyntheticEvent, value: IFriendsTabs) => {
    e.preventDefault()
    setFriendsTab(value)
  }

  return (
    <>
      <VibrateButton
        variant='contained'
        color='primary'
        size='large'
        fullWidth
        disabled={isLoading}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          border: `2px solid ${theme.palette.roadsign.contrastText}`,
        }}
        onClick={() => setDialogOpen(true)}
      >
        <Badge badgeContent={friendsRequestsLength + awaitingFriendsLength} color='warning'>
          <Groups />
        </Badge>
        {t('app.friends')}
      </VibrateButton>
      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogHeader title={t('app.friends')} number={badgeCount} />

          <DialogContent>
            <QRScannerDialog />

            <Box sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <VibrateIconButton
                color='primary'
                size='small'
                onClick={handleRefreshFriends}
                disabled={isDisabled}
                loading={isRefreshing}
                sx={{ position: 'relative' }}
              >
                <FindReplace />
                {isDisabled && !isRefreshing && (
                  <CircularProgress
                    variant='determinate'
                    value={(countDown / DISABLE_REFRESH_REQUESTS_TIME) * 100}
                    thickness={4}
                    size={34}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      color: 'primary.main',
                      opacity: 0.5,
                    }}
                  />
                )}
              </VibrateIconButton>
            </Box>

            {totalFriends > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Tabs value={friendsTab} variant='fullWidth' onChange={handleTabChange} sx={{ mb: 2 }}>
                  <Tab
                    label={
                      <Badge badgeContent={friendsLength} color='success'>
                        {t('friends.my_friends')}
                      </Badge>
                    }
                    value='friends'
                    disabled={friendList.length === 0}
                  />
                  <Tab
                    label={
                      <Badge badgeContent={awaitingFriendsLength} color='warning'>
                        {t('friends.awaiting')}
                      </Badge>
                    }
                    value='awaiting'
                    disabled={awaitingFriendsLength === 0}
                  />
                  <Tab
                    label={
                      <Badge badgeContent={friendsRequestsLength} color='warning'>
                        {t('friends.requests')}
                      </Badge>
                    }
                    value='requests'
                    disabled={friendsRequestsLength === 0}
                  />
                </Tabs>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant='h6' sx={{ textAlign: 'center' }}>
                    {t(subHeader)}
                  </Typography>
                  {userList.map(friend => (
                    <User
                      key={`${friend.slug}-${key.current++}`}
                      friend={friend}
                      onRemoveFriend={() => handleRemoveFriend(friend)}
                      onAddFriend={() => handleAddFriend(friend)}
                    />
                  ))}
                </Box>
              </>
            )}
          </DialogContent>

          <DialogActions>
            <Button variant='contained' color='primary' size='large' onClick={handleCloseDialog}>
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmRemoveFriend}
        title={t('confirm.remove_title')}
        content={t('confirm.remove_content', { name: friendToRemove?.name ?? '' })}
      />
    </>
  )
}

export default FriendsDialog
