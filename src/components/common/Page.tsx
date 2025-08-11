'use client'

import { Box, Container, Paper, Typography } from '@mui/material'
import Logo from '@/components/common/Logo'
import AddFriendDialog from '@/components/dialogs/AddFriendDialog'
import AddNumberDialog from '@/components/dialogs/AddNumberDialog'
import CompleteDialog from '@/components/dialogs/CompleteDialog'
import InstallPromptDialog from '@/components/dialogs/InstallPromptDialog'
import FindPlate from '@/components/FindPlate'
import PageActionButtons from '@/components/PageActionButtons'
import Streak from '@/components/Streak'
import { useUser } from '@/providers/userProvider'

const Page = ({ isTwaApp }: { isTwaApp: boolean }) => {
  const { user } = useUser()

  return (
    <>
      <AddNumberDialog />
      <AddFriendDialog />
      <InstallPromptDialog isTwaApp={isTwaApp} />
      <CompleteDialog user={user} />

      <Container maxWidth='sm' sx={{ my: 2 }}>
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
          <Typography sx={{ textAlign: 'center', fontWeight: 700 }}>{user?.slug.toUpperCase()}</Typography>
        </Paper>
      </Container>

      <Container maxWidth='md'>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FindPlate />
          <Container maxWidth='sm' sx={{ p: 0 }}>
            <Streak />
          </Container>
        </Box>
      </Container>

      <Container maxWidth='sm' sx={{ my: 2 }}>
        <PageActionButtons />
      </Container>
    </>
  )
}

export default Page
