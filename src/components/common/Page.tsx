'use client'

import { Box, Paper, Typography } from '@mui/material'
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
        <Typography variant='body1' sx={{ textAlign: 'center', fontWeight: 700 }}>
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
      <CompleteDialog user={user} />
    </>
  )
}

export default Page
