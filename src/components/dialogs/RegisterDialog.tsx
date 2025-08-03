import { Alert, Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useUser } from '@/providers/userProvider'
import type { RegisterDialogProps } from '@/types/auth'

const RegisterDialog = ({ open, onClose, onSwitchToLogin }: RegisterDialogProps) => {
  const t = useTranslations()
  const { createUser, isCreatingUser, authError, clearAuthError } = useUser()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [localError, setLocalError] = useState('')

  // Clear errors when dialog opens/closes
  useEffect(() => {
    if (open) {
      setLocalError('')
      clearAuthError()
    }
  }, [open, clearAuthError])

  const handleRegister = useCallback(() => {
    if (!name.trim() || !pin.trim() || !confirmPin.trim()) {
      setLocalError(t('auth.please_fill_all_fields'))
      return
    }

    if (name.trim().length < 2) {
      setLocalError(t('auth.name_too_short'))
      return
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setLocalError(t('auth.pin_must_be_four_digits'))
      return
    }

    if (pin !== confirmPin) {
      setLocalError(t('auth.pins_dont_match'))
      return
    }

    setLocalError('')
    createUser(name.trim(), pin.trim())
  }, [name, pin, confirmPin, createUser, t])

  const handleClose = useCallback(() => {
    setName('')
    setPin('')
    setConfirmPin('')
    setLocalError('')
    clearAuthError()
    onClose()
  }, [onClose, clearAuthError])

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleRegister()
      }
    },
    [handleRegister]
  )

  // Show either local validation error or auth error
  const displayError = localError || authError

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
      <DialogHeader title={t('auth.create_account')} />
      <DialogContent>
        <Typography variant='body1' sx={{ mb: 2 }}>
          {t('auth.register_description')}
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
          disabled={isCreatingUser}
          onKeyPress={handleKeyPress}
          helperText={t('auth.name_help')}
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
              inputMode: 'numeric',
              autoComplete: 'off',
            },
          }}
          disabled={isCreatingUser}
          onKeyUp={handleKeyPress}
          helperText={t('auth.pin_help')}
        />

        <TextField
          fullWidth
          label={t('auth.confirm_pin')}
          type='password'
          value={confirmPin}
          onChange={e => setConfirmPin(e.target.value)}
          margin='normal'
          slotProps={{
            htmlInput: {
              maxLength: 4,
              pattern: '[0-9]*',
              inputMode: 'numeric',
              autoComplete: 'off',
            },
          }}
          disabled={isCreatingUser}
          onKeyUp={handleKeyPress}
          helperText={t('auth.confirm_pin_help')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSwitchToLogin} disabled={isCreatingUser}>
          {t('auth.already_have_account')}
        </Button>
        <Button onClick={handleRegister} variant='contained' disabled={isCreatingUser}>
          {t('auth.create_account')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RegisterDialog
