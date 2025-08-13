'use client'

import { Alert, Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useDeleteUser } from '@/hooks/useApi'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import type { IDeleteAccountDialogProps } from '@/types/common'

const DeleteAccountDialog = ({ open, onClose }: IDeleteAccountDialogProps) => {
  const t = useTranslations()
  const { user, resetUser } = useUser()
  const { removeSettings } = useSettings()
  const deleteUserMutation = useDeleteUser()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleDeleteAccount = useCallback(() => {
    if (!pin.trim()) {
      setError(t('auth.please_fill_all_fields'))
      return
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError(t('auth.pin_must_be_four_digits'))
      return
    }

    if (!user?.id) {
      setError(t('auth.invalid_credentials'))
      return
    }

    setError('')
    deleteUserMutation.mutate(
      { userId: user.id, pin },
      {
        onSuccess: () => {
          removeSettings()
          resetUser()
          onClose()
        },
        onError: () => {
          setError(t('auth.invalid_credentials'))
        },
      }
    )
  }, [pin, user?.id, deleteUserMutation, onClose, t, resetUser, removeSettings])

  const handleClose = useCallback(() => {
    setPin('')
    setError('')
    onClose()
  }, [onClose])

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleDeleteAccount()
      }
    },
    [handleDeleteAccount]
  )

  return (
    <Dialog fullWidth maxWidth='sm' open={open}>
      <DialogHeader title={t('settings.delete_account')} />
      <DialogContent>
        <Typography sx={{ mb: 2 }}>{t('settings.delete_account_description')}</Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

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
          disabled={deleteUserMutation.isPending}
          onKeyUp={handleKeyPress}
          helperText={t('auth.pin_help')}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant='outlined'
          color='primary'
          size='large'
          onClick={handleClose}
          disabled={deleteUserMutation.isPending}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeleteAccount}
          loading={deleteUserMutation.isPending}
        >
          {deleteUserMutation.isPending ? t('settings.deleting_account') : t('settings.delete_account')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteAccountDialog
