'use client'

import { Alert, Box, Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useUser } from '@/providers/userProvider'
import type { LoginDialogProps } from '@/types/auth'
import PinField from '../common/PinField'

const LoginDialog = ({ open, onClose, onSwitchToRegister }: LoginDialogProps) => {
  const t = useTranslations()
  const { login, isLoggingIn, authError, clearAuthError } = useUser()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [localError, setLocalError] = useState('')

  // Clear errors when dialog opens/closes
  useEffect(() => {
    if (open) {
      setName('')
      setPin('')
      setLocalError('')
      clearAuthError()
    }
  }, [open, clearAuthError])

  const handleLogin = useCallback(() => {
    if (!name.trim() || !pin) {
      setLocalError(t('auth.please_fill_all_fields'))
      return
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setLocalError(t('auth.pin_must_be_four_digits'))
      return
    }

    setLocalError('')
    login({ name: name.trim(), pin })
  }, [name, pin, login, t])

  const handleClose = useCallback(() => {
    setName('')
    setPin('')
    setLocalError('')
    clearAuthError()
    onClose()
  }, [onClose, clearAuthError])

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleLogin()
      }
    },
    [handleLogin]
  )

  // Show either local validation error or auth error
  const displayError = useMemo(() => localError || authError, [localError, authError])

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
      <DialogHeader title={t('auth.login')} />
      <DialogContent>
        <Typography variant='body1' sx={{ mb: 2 }}>
          {t('auth.login_description')}
        </Typography>

        {displayError && (
          <Alert severity='error' sx={{ mb: 2 }} onClose={() => setLocalError('')}>
            {displayError}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label={t('auth.name')}
            value={name}
            onChange={e => setName(e.target.value)}
            margin='normal'
            autoFocus
            disabled={isLoggingIn}
            onKeyUp={handleKeyPress}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, mb: 1 }}>
            <Typography variant='body2' sx={{ alignSelf: 'center' }}>
              {t('auth.pin')}:
            </Typography>
            <PinField disabled={isLoggingIn} onChange={pin => setPin(pin)} />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSwitchToRegister} disabled={isLoggingIn}>
          {t('auth.create_account')}
        </Button>
        <Button
          onClick={handleLogin}
          variant='contained'
          disabled={isLoggingIn || name.trim().length < 2 || !pin.length}
        >
          {t('auth.login')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginDialog
