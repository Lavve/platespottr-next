'use client'

import { People } from '@mui/icons-material'
import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Roadsign from '@/components/Roadsign'
import User from '@/components/User'
import { useFriends } from '@/providers/friendsProvider'
import type { IUser } from '@/types/user'
import { vibrate } from '@/utils/vibrate'
import QrDialog from './QrDialog'

const FriendsDialog = () => {
  const t = useTranslations()
  const [friendToRemove, setFriendToRemove] = useState<IUser | null>(null)
  const { friendRequests, friendList, addFriend, removeFriend } = useFriends()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const key = useRef(0)

  const friendsLength = useMemo(() => {
    return friendList.length
  }, [friendList])

  const friendsRequestsLength = useMemo(() => {
    return friendRequests.length
  }, [friendRequests])

  const handleAddFriend = (friend: IUser) => {
    addFriend(friend)
  }

  const handleRemoveFriend = (friend: IUser) => {
    setFriendToRemove(friend)
    setConfirmOpen(true)
  }

  const handleConfirmRemoveFriend = () => {
    removeFriend(friendToRemove?.name as string)
    setConfirmOpen(false)
  }

  const handleCloseDialog = () => {
    vibrate()
    setDialogOpen(false)
  }

  return (
    <>
      <VibrateButton
        variant='contained'
        color='primary'
        size='large'
        fullWidth
        startIcon={<People />}
        disabled={friendsRequestsLength === 0}
        onClick={() => setDialogOpen(true)}
      >
        <Badge badgeContent={friendsRequestsLength} color='secondary'>
          {t('app.friends')}
        </Badge>
      </VibrateButton>
      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
            <Roadsign text={t('friends.title')} />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box mb={2}>
                <QrDialog />
              </Box>
              {friendsRequestsLength > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant='h6'>
                    <Badge badgeContent={friendsRequestsLength} color='primary'>
                      {t('friends.friends_requests')}
                    </Badge>
                  </Typography>
                  {friendRequests.map(friend => (
                    <User
                      key={`${friend.slug}-${key.current++}`}
                      friend={friend}
                      onAddFriend={() => handleAddFriend(friend)}
                      onRemoveFriend={() => handleRemoveFriend(friend)}
                    />
                  ))}
                </Box>
              )}
              {friendsRequestsLength > 0 && friendsLength > 0 && <Divider sx={{ mt: 2 }} />}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant='h6'>{t('friends.my_friends')}</Typography>
                {friendList.map(friend => (
                  <User
                    key={`${friend.slug}-${key.current++}`}
                    friend={friend}
                    onRemoveFriend={() => handleRemoveFriend(friend)}
                  />
                ))}
              </Box>
            </Box>
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
