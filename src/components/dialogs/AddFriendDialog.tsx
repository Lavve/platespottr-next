'use client'

import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useQueryNavigation } from '@/hooks/useQueryNavigation'
import { useFriends } from '@/providers/friendsProvider'

const AddFriendDialog = () => {
  const t = useTranslations()
  const { friend, isAddFriendDialogOpen, clearQuery } = useQueryNavigation()
  const { addFriend, friendsAll } = useFriends()

  const foundFriend = useMemo(() => {
    return friendsAll?.find(f => f.slug === friend?.slug) || null
  }, [friendsAll, friend?.slug])

  const handleAddFriend = useCallback(
    (friendSlug: string) => {
      if (!friendSlug) return // TODO: Show snackbar, no slug
      if (foundFriend) return // TODO: Show snackbar, friend already in list
      addFriend(friendSlug)
      clearQuery()
    },
    [foundFriend, addFriend, clearQuery]
  )

  if (!friend || !isAddFriendDialogOpen) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={isAddFriendDialogOpen} onClose={clearQuery}>
      <DialogHeader title={t('app.add_friend')} />
      <DialogContent>
        <Typography variant='body1'>
          {t.rich('friends.send_friend_request_description', {
            slug: friend?.name ? friend?.name : friend?.slug.toUpperCase() || '',
            strong: chunks => <strong>{chunks}</strong>,
          })}
        </Typography>
        <Typography variant='body1'>{friend?.name ? friend?.slug.toUpperCase() : ''}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='primary' size='large' onClick={clearQuery}>
          {t('common.close')}
        </Button>
        <Button variant='contained' color='primary' size='large' onClick={() => handleAddFriend(friend?.slug || '')}>
          {t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFriendDialog
