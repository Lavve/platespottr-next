'use client'

import { Box, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
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
  const { user } = useUser()
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)

  useEffect(() => {
    if (user?.numbers?.length === 999) {
      setIsCompleteDialogOpen(true)
    }
  }, [user])

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
