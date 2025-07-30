'use client'

import { Box, Container, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AddNumberDialog from '@/components/dialogs/AddNumberDialog'
import CompleteDialog from '@/components/dialogs/CompleteDialog'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import InstallPromptDialog from '@/components/dialogs/InstallPromptDialog'
import FindPlate from '@/components/FindPlate'
import Logo from '@/components/Logo'
import PageActionButtons from '@/components/PageActionButtons'
import Streak from '@/components/Streak'
import { useHashNavigation } from '@/hooks/useHashNavigation'
import { useFriends } from '@/providers/friendsProvider'
import { useUser } from '@/providers/userProvider'

export default function HomePage() {
  const t = useTranslations()
  const { user } = useUser()
  const { friendsAll, addFriend } = useFriends()
  const { friendSlug, isAddFriendDialogOpen, clearHash } = useHashNavigation()
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)

  useEffect(() => {
    if (user?.plates.length === 999) {
      setIsCompleteDialogOpen(true)
    }
  }, [user?.plates])

  const foundFriend = useMemo(() => {
    return friendsAll?.find(f => f.slug === friendSlug) || null
  }, [friendsAll, friendSlug])

  const addFriendContent = useMemo(() => {
    return t('app.add_friend_description', { friendSlug: friendSlug || '' })
  }, [friendSlug, t])

  const handleAddFriend = useCallback(
    (friendSlug: string) => {
      clearHash()
      if (!friendSlug) return // TODO: Show snackbar, no slug
      if (foundFriend) return // TODO: Show snackbar, friend already in list
      addFriend({ name: 'Stina', slug: friendSlug, plates: [Date.now() - 1000 * 60 * 60 * 24 * 27] })
    },
    [clearHash, foundFriend, addFriend]
  )

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 2,
        py: 2,
        height: '100vh',
      }}
    >
      <Paper sx={{ p: 2, borderRadius: 2 }} elevation={5}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          <Logo size={50} />
          <Typography
            component='h1'
            variant='h4'
            sx={{ textAlign: 'center', m: 0, p: 0, fontWeight: 100, textTransform: 'uppercase' }}
          >
            latespottr
          </Typography>
        </Box>
        <Typography variant='body1' sx={{ textAlign: 'center' }}>
          {user?.slug}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FindPlate />
        <Streak />
      </Box>

      <PageActionButtons />

      <AddNumberDialog />
      <ConfirmDialog
        title={t('app.add_friend')}
        content={addFriendContent}
        onConfirm={() => handleAddFriend(friendSlug || '')}
        open={isAddFriendDialogOpen}
        onClose={() => clearHash()}
      />

      <InstallPromptDialog />
      <CompleteDialog open={isCompleteDialogOpen} onClose={() => setIsCompleteDialogOpen(false)} />
    </Container>
  )
}
