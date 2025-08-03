'use client'

import { Box, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useQueryNavigation } from '@/hooks/useQueryNavigation'
import { useUser } from '@/providers/userProvider'
import AddFriendDialog from '../dialogs/AddFriendDialog'
import AddNumberDialog from '../dialogs/AddNumberDialog'
import CompleteDialog from '../dialogs/CompleteDialog'
import InstallPromptDialog from '../dialogs/InstallPromptDialog'
import FindPlate from '../FindPlate'
import Logo from '../Logo'
import PageActionButtons from '../PageActionButtons'
import Streak from '../Streak'

const Page = () => {
  const { user, isAuthenticated } = useUser()
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const { friend, isAddFriendDialogOpen, isAddPlateDialogOpen } = useQueryNavigation()

  useEffect(() => {
    if (user?.numbers?.length === 999) {
      setIsCompleteDialogOpen(true)
    }
  }, [user])

  // Handle post-authentication QR code parameters
  useEffect(() => {
    // If user just authenticated and there are pending QR parameters,
    // the dialogs will automatically show due to useQueryNavigation
    if (isAuthenticated && ((friend && isAddFriendDialogOpen) || isAddPlateDialogOpen)) {
      // The dialogs will show automatically, no additional action needed
      // The useQueryNavigation hook handles the URL parameters
    }
  }, [isAuthenticated, friend, isAddFriendDialogOpen, isAddPlateDialogOpen])

  return (
    <>
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
          {user?.slug.toUpperCase()}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FindPlate />
        <Streak />
      </Box>

      <PageActionButtons />

      <AddNumberDialog />
      <AddFriendDialog />

      <InstallPromptDialog />
      <CompleteDialog open={isCompleteDialogOpen} onClose={() => setIsCompleteDialogOpen(false)} />
    </>
  )
}

export default Page
