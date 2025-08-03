import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import LoginDialog from '@/components/dialogs/LoginDialog'
import RegisterDialog from '@/components/dialogs/RegisterDialog'
import Logo from '@/components/Logo'
import { useQueryNavigation } from '@/hooks/useQueryNavigation'

const AuthenticationScreen = () => {
  const t = useTranslations()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const { friend, isAddFriendDialogOpen, isAddPlateDialogOpen } = useQueryNavigation()

  // Check if there are pending QR code parameters
  const hasPendingFriendRequest = friend && isAddFriendDialogOpen
  const hasPendingPlateRequest = isAddPlateDialogOpen

  const handleOpenLogin = () => {
    setIsLoginOpen(true)
    setIsRegisterOpen(false)
  }

  const handleOpenRegister = () => {
    setIsRegisterOpen(true)
    setIsLoginOpen(false)
  }

  const handleCloseLogin = () => {
    setIsLoginOpen(false)
  }

  const handleCloseRegister = () => {
    setIsRegisterOpen(false)
  }

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  return (
    <Container
      maxWidth='xs'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        py: 4,
        height: '100vh',
      }}
    >
      <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }} elevation={5}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Logo size={50} />
          <Typography component='h1' variant='h4' sx={{ fontWeight: 100, textTransform: 'uppercase' }}>
            latespottr
          </Typography>
        </Box>

        <Typography variant='body1' sx={{ mb: 3 }}>
          {t('auth.welcome_message')}
        </Typography>

        {hasPendingFriendRequest && (
          <Typography variant='body2' color='primary' sx={{ mb: 2 }}>
            {t.rich('friends.pending_friend_request', {
              slug: friend?.name ? friend?.name : friend?.slug || '',
              strong: chunks => <strong>{chunks}</strong>,
            })}
          </Typography>
        )}

        {hasPendingPlateRequest && (
          <Typography variant='body2' color='primary' sx={{ mb: 2 }}>
            {t('app.pending_plate_request')}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant='contained' color='primary' size='large' onClick={handleOpenLogin} sx={{ py: 1.5 }}>
            {t('auth.login')}
          </Button>

          <Button variant='outlined' color='primary' size='large' onClick={handleOpenRegister} sx={{ py: 1.5 }}>
            {t('auth.create_account')}
          </Button>
        </Box>
      </Paper>

      <LoginDialog open={isLoginOpen} onClose={handleCloseLogin} onSwitchToRegister={handleSwitchToRegister} />
      <RegisterDialog open={isRegisterOpen} onClose={handleCloseRegister} onSwitchToLogin={handleSwitchToLogin} />
    </Container>
  )
}

export default AuthenticationScreen
