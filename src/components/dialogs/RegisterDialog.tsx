'use client'

import { Alert, Box, Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import PinField from '@/components/common/PinField'
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
    <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
      <DialogHeader title={t('auth.create_account')} />
      <DialogContent>
        <Typography sx={{ mb: 2 }}>{t('auth.register_description')}</Typography>

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
          onKeyUp={handleKeyPress}
          helperText={t('auth.name_help')}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, mb: 1 }}>
          <Typography variant='body2' sx={{ alignSelf: 'center' }}>
            {t('auth.choose_pin')}:
          </Typography>
          <PinField disabled={isCreatingUser} onChange={pin => setPin(pin)} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, mb: 1 }}>
          <Typography variant='body2' sx={{ alignSelf: 'center' }}>
            {t('auth.confirm_pin')}:
          </Typography>
          <PinField disabled={isCreatingUser} onChange={pin => setConfirmPin(pin)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='primary' size='large' onClick={onSwitchToLogin} disabled={isCreatingUser}>
          {t('auth.already_have_account')}
        </Button>
        <Button
          size='large'
          color='primary'
          onClick={handleRegister}
          variant='contained'
          disabled={isCreatingUser || !name.trim() || !pin.trim() || !confirmPin.trim()}
        >
          {t('auth.create_account')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RegisterDialog
