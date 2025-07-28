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
import { useState } from 'react'
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

  const handleAddFriend = (friend: IUser) => {
    vibrate()
    addFriend(friend)
  }

  const handleRemoveFriend = (friend: IUser) => {
    vibrate()
    setFriendToRemove(friend)
    setConfirmOpen(true)
  }

  const handleConfirmRemoveFriend = () => {
    vibrate()
    removeFriend(friendToRemove?.name as string)
    setConfirmOpen(false)
  }

  return (
    <>
      <Button
        variant='contained'
        color='primary'
        size='large'
        fullWidth
        startIcon={<People />}
        disabled={friendList.length + friendRequests.length === 0}
        onClick={() => {
          vibrate()
          setDialogOpen(true)
        }}
      >
        <Badge badgeContent={friendRequests.length} color='secondary'>
          {t('app.friends')}
        </Badge>
      </Button>
      <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
          <Roadsign text={t('friends.title')} />
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box mb={2}>
              <QrDialog />
            </Box>
            {friendRequests.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant='h6'>
                  <Badge badgeContent={friendRequests.length} color='primary'>
                    {t('friends.friends_requests')}
                  </Badge>
                </Typography>
                {friendRequests.map(friend => (
                  <User
                    key={friend.name}
                    friend={friend}
                    onAddFriend={() => handleAddFriend(friend)}
                    onRemoveFriend={() => handleRemoveFriend(friend)}
                  />
                ))}
              </Box>
            )}
            {friendRequests.length > 0 && friendList.length > 0 && <Divider sx={{ mt: 2 }} />}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant='h6'>{t('friends.my_friends')}</Typography>
              {friendList.map(friend => (
                <User key={friend.name} friend={friend} onRemoveFriend={() => handleRemoveFriend(friend)} />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' size='large' onClick={() => setDialogOpen(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          vibrate()
          setConfirmOpen(false)
        }}
        onConfirm={handleConfirmRemoveFriend}
        title={t('confirm.remove_title')}
        content={t('confirm.remove_content', { name: friendToRemove?.name ?? '' })}
      />
    </>
  )
}

export default FriendsDialog
