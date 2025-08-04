import { Alert, Box, Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useUser } from '@/providers/userProvider'
import type { LoginDialogProps } from '@/types/auth'

const LoginDialog = ({ open, onClose, onSwitchToRegister }: LoginDialogProps) => {
  const t = useTranslations()
  const { login, isLoggingIn, authError, clearAuthError } = useUser()
  const [name, setName] = useState('')
  const [pinDigits, setPinDigits] = useState(['', '', '', ''])
  const [localError, setLocalError] = useState('')
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  // Clear errors when dialog opens/closes
  useEffect(() => {
    if (open) {
      setLocalError('')
      clearAuthError()
      setPinDigits(['', '', '', ''])
    }
  }, [open, clearAuthError])

  const handlePinKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent) => {
      // Handle backspace to go to previous field
      if (event.key === 'Backspace' && !pinDigits[index] && index > 0) {
        pinRefs.current[index - 1]?.focus()
      }
    },
    [pinDigits]
  )

  const handlePinChange = useCallback(
    (index: number, value: string) => {
      // Only allow single digits
      if (value.length > 1) {
        value = value.slice(-1)
      }

      // Only allow numbers
      if (!/^\d*$/.test(value)) {
        return
      }

      const newPinDigits = [...pinDigits]
      newPinDigits[index] = value
      setPinDigits(newPinDigits)

      // Auto-advance to next field if a digit was entered
      if (value && index < 3) {
        pinRefs.current[index + 1]?.focus()
      } else if (!value && index > 0) {
        pinRefs.current[index - 1]?.focus()
      }
    },
    [pinDigits]
  )

  const handleLogin = useCallback(() => {
    if (!name.trim() || pinDigits.some(digit => !digit)) {
      setLocalError(t('auth.please_fill_all_fields'))
      return
    }

    const pin = pinDigits.join('')
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setLocalError(t('auth.pin_must_be_four_digits'))
      return
    }

    setLocalError('')
    login({ name: name.trim(), pin })
  }, [name, pinDigits, login, t])

  const handleClose = useCallback(() => {
    setName('')
    setPinDigits(['', '', '', ''])
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
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
            {pinDigits.map((digit, idx) => (
              <TextField
                key={`${idx}-${digit}`}
                inputRef={el => {
                  pinRefs.current[idx] = el
                }}
                value={digit}
                onChange={e => handlePinChange(idx, e.target.value)}
                onKeyDown={e => handlePinKeyDown(idx, e)}
                onKeyUp={handleKeyPress}
                disabled={isLoggingIn}
                slotProps={{
                  htmlInput: {
                    maxLength: 1,
                    pattern: '[0-9]*',
                    inputMode: 'numeric',
                    autoComplete: 'off',
                    style: { textAlign: 'center' },
                  },
                }}
                sx={{
                  width: '60px',
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSwitchToRegister} disabled={isLoggingIn}>
          {t('auth.create_account')}
        </Button>
        <Button
          onClick={handleLogin}
          variant='contained'
          disabled={isLoggingIn || !name.trim() || pinDigits.some(digit => !digit)}
        >
          {t('auth.login')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginDialog
