import { Alert, Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useUser } from '@/providers/userProvider'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

const LoginDialog = ({ open, onClose, onSwitchToRegister }: LoginDialogProps) => {
  const t = useTranslations()
  const { login, isLoggingIn, authError, clearAuthError } = useUser()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [localError, setLocalError] = useState('')

  // Clear errors when dialog opens/closes
  useEffect(() => {
    if (open) {
      setLocalError('')
      clearAuthError()
    }
  }, [open, clearAuthError])

  const handleLogin = useCallback(() => {
    if (!name.trim() || !pin.trim()) {
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
  const displayError = localError || authError

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
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

        <TextField
          fullWidth
          label={t('auth.pin')}
          type='password'
          value={pin}
          onChange={e => setPin(e.target.value)}
          margin='normal'
          slotProps={{
            htmlInput: {
              maxLength: 4,
              pattern: '[0-9]*',
            },
          }}
          disabled={isLoggingIn}
          onKeyUp={handleKeyPress}
          helperText={t('auth.pin_help')}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='primary' size='large' onClick={handleClose} disabled={isLoggingIn}>
          {t('common.cancel')}
        </Button>
        <Button variant='text' color='primary' size='large' onClick={onSwitchToRegister} disabled={isLoggingIn}>
          {t('auth.create_account')}
        </Button>
        <Button variant='contained' color='primary' size='large' onClick={handleLogin} disabled={isLoggingIn}>
          {isLoggingIn ? t('auth.logging_in') : t('auth.login')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginDialog
