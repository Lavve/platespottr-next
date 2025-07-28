'use client'

import { Box, Container, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { generateSlug } from '@/utils/generateSlug'

export default function HomePage() {
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const { friends, friendList, addFriend } = useFriends()
  const { friendSlug, isAddFriendDialogOpen, isAddPlateDialogOpen, clearHash } = useHashNavigation()
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)

  useEffect(() => {
    if (user?.plates.length === 999) {
      setIsCompleteDialogOpen(true)
    }
  }, [user?.plates])

  const foundFriend = useMemo(() => {
    return friends?.find(f => f.slug === friendSlug) || null
  }, [friends, friendSlug])

  const addPlateContent = useMemo(() => {
    return friendList.length > 0 ? t('app.add_plate_description') : t('app.add_plate_description_no_friends')
  }, [friendList.length, t])

  const addFriendContent = useMemo(() => {
    return t('app.add_friend_description', { friendSlug: friendSlug || '' })
  }, [friendSlug, t])

  const handleAddPlate = useCallback(() => {
    clearHash()
    if (!user) return
    saveUser({ ...user, plates: [...user.plates, Date.now()] })
  }, [clearHash, user, saveUser])

  const handleAddFriend = useCallback(() => {
    clearHash()
    if (!friendSlug) return // TODO: Show snackbar
    if (foundFriend) return // TODO: Show snackbar
    addFriend({ name: 'Stina', slug: generateSlug(), plates: [Date.now() - 1000 * 60 * 60 * 24 * 27] })
  }, [clearHash, friendSlug, foundFriend, addFriend])

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
      <Paper
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, p: 2, borderRadius: 2 }}
        elevation={5}
      >
        <Logo size={50} />
        <Typography
          component='h1'
          variant='h4'
          sx={{ textAlign: 'center', m: 0, p: 0, fontWeight: 100, textTransform: 'uppercase' }}
        >
          latespottr
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FindPlate />
        <Streak />
      </Box>

      <PageActionButtons />

      <ConfirmDialog
        title={t('app.add_plate')}
        content={addPlateContent}
        onConfirm={handleAddPlate}
        open={isAddPlateDialogOpen}
        onClose={() => clearHash()}
      />
      <ConfirmDialog
        title={t('app.add_friend')}
        content={addFriendContent}
        onConfirm={handleAddFriend}
        open={isAddFriendDialogOpen}
        onClose={() => clearHash()}
      />

      <InstallPromptDialog />
      <CompleteDialog open={isCompleteDialogOpen} onClose={() => setIsCompleteDialogOpen(false)} />
    </Container>
  )
}
