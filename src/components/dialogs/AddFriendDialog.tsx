'use client'

import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useQueryNavigation } from '@/hooks/useQueryNavigation'
import { useFriends } from '@/providers/friendsProvider'
import { useSnackbar } from '@/providers/SnackbarProvider'

const AddFriendDialog = () => {
  const t = useTranslations()
  const { showError } = useSnackbar()
  const { friend, isAddFriendDialogOpen, clearQuery } = useQueryNavigation()
  const { addFriend, friendsAll, isLoading } = useFriends()

  const foundFriend = useMemo(() => {
    return friendsAll?.find(f => f.slug === friend?.slug) || null
  }, [friendsAll, friend?.slug])

  const handleAddFriend = useCallback(
    async (friendSlug: string) => {
      if (!friendSlug) {
        showError(t('notifications.add_friend_failed_no_friend_slug', { code: 'AFE' }))
        return
      }
      if (foundFriend) {
        showError(t('notifications.add_friend_failed_already_added', { code: 'AFAA' }))
        return
      }
      await addFriend(friendSlug)
      clearQuery()
    },
    [foundFriend, addFriend, clearQuery, showError, t]
  )

  if (!friend || !isAddFriendDialogOpen) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={isAddFriendDialogOpen}>
      <DialogHeader title={t('app.add_friend')} />
      <DialogContent>
        <Typography>
          {t.rich('friends.send_friend_request_description', {
            friendName: friend?.name ? friend?.name : friend?.slug.toUpperCase() || '',
            strong: chunks => <strong>{chunks}</strong>,
          })}
        </Typography>
        <Typography>{friend?.name ? friend?.slug.toUpperCase() : ''}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='primary' size='large' onClick={clearQuery} disabled={isLoading}>
          {t('common.close')}
        </Button>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={() => handleAddFriend(friend?.slug.toLowerCase() || '')}
          loading={isLoading}
        >
          {t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFriendDialog
