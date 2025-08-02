'use client'

import { Box, Container, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import AddFriendDialog from '@/components/dialogs/AddFriendDialog'
import AddNumberDialog from '@/components/dialogs/AddNumberDialog'
import CompleteDialog from '@/components/dialogs/CompleteDialog'
import InstallPromptDialog from '@/components/dialogs/InstallPromptDialog'
import FindPlate from '@/components/FindPlate'
import Logo from '@/components/Logo'
import PageActionButtons from '@/components/PageActionButtons'
import Streak from '@/components/Streak'
import { useUser } from '@/providers/userProvider'

export default function HomePage() {
  const { user } = useUser()
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)

  useEffect(() => {
    if (user?.plates.length === 999) {
      setIsCompleteDialogOpen(true)
    }
  }, [user?.plates])

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
      <AddFriendDialog />

      <InstallPromptDialog />
      <CompleteDialog open={isCompleteDialogOpen} onClose={() => setIsCompleteDialogOpen(false)} />
    </Container>
  )
}
