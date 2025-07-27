'use client'

import { QrCode } from '@mui/icons-material'
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
import QrDialog from '@/components/dialogs/QrDialog'
import Roadsign from '@/components/Roadsign'
import User from '@/components/User'
import { useFriends } from '@/providers/friendsProvider'
import type { IUser } from '@/types/user'

const FriendsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations()
  const [friendToRemove, setFriendToRemove] = useState<IUser | null>(null)
  const { friendRequests, friendList, addFriend, removeFriend } = useFriends()
  const [qrOpen, setQrOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

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

  if (!open) return null

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
          <Roadsign text={t('friends.title')} />
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Button
                variant='outlined'
                fullWidth
                color='primary'
                size='large'
                startIcon={<QrCode />}
                onClick={() => setQrOpen(!qrOpen)}
              >
                {t('friends.show_my_qr')}
              </Button>
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
              <Typography variant='h6'>
                <Badge badgeContent={friendList.length} color='primary'>
                  {t('friends.my_friends')}
                </Badge>
              </Typography>
              {friendList.map(friend => (
                <User key={friend.name} friend={friend} onRemoveFriend={() => handleRemoveFriend(friend)} />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' size='large' onClick={onClose}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      <QrDialog open={qrOpen} onClose={() => setQrOpen(false)} />

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
