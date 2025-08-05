'use client'

import { QrCode } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import VibrateButton from '@/components/common/VibrateButton'
import VibrateIconButton from '@/components/common/VibrateIconButton'
import { useScreenWakeLock } from '@/hooks/useScreenWakeLock'
import { useVibration } from '@/hooks/useVibration'
import { useUser } from '@/providers/userProvider'

const QrDialog = ({ showText = true }: { showText?: boolean }) => {
  const t = useTranslations()
  const { handleClick } = useVibration()
  const { user } = useUser()
  const [qrOpen, setQrOpen] = useState(false)
  const { isSupported, isActive, requestWakeLock, releaseWakeLock } = useScreenWakeLock()

  const userSlugValue = useMemo(() => {
    if (!user || !user.slug) return ''
    return `${process.env.NEXT_PUBLIC_SLUG_URL}/?add-friend=${encodeURIComponent(user.slug)}&name=${encodeURIComponent(user.name)}`
  }, [user])

  useEffect(() => {
    if (qrOpen && isSupported) {
      requestWakeLock()
    } else if (!qrOpen && isSupported) {
      releaseWakeLock()
    }

    return () => {
      if (isSupported && isActive) {
        releaseWakeLock()
      }
    }
  }, [qrOpen, isSupported, isActive, requestWakeLock, releaseWakeLock])

  const handleCloseDialog = () => {
    handleClick()
    setQrOpen(false)
  }

  return (
    <>
      {showText ? (
        <VibrateButton
          variant='contained'
          fullWidth
          color='primary'
          size='large'
          disabled={!userSlugValue || !user}
          startIcon={<QrCode sx={{ fontSize: '1.5rem' }} />}
          onClick={() => setQrOpen(true)}
          sx={{ fontSize: '1.5rem' }}
        >
          {showText && t('app.show_my_qr')}
        </VibrateButton>
      ) : (
        <VibrateIconButton color='primary' disabled={!userSlugValue || !user} onClick={() => setQrOpen(true)}>
          <QrCode />
        </VibrateIconButton>
      )}
      {qrOpen && userSlugValue && user && (
        <Dialog fullWidth maxWidth='sm' open={qrOpen} onClose={handleCloseDialog}>
          <DialogContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: 1,
                p: 2,
                backgroundColor: 'white',
                borderRadius: 1,
              }}
            >
              <QRCode size={250} value={userSlugValue} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
            </Box>
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                mt: 2,
                p: 1,
              }}
            >
              <Box sx={{ textAlign: 'center', display: 'flex', gap: 0.5 }}>
                <Typography variant='body2'>{t('app.your_platespottr_name')}:</Typography>
                <Typography variant='body2' sx={{ fontWeight: 700 }}>
                  {user.name}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', display: 'flex', gap: 0.5 }}>
                <Typography variant='body2'>{t('app.your_platespottr_code')}:</Typography>
                <Typography variant='body2' sx={{ fontWeight: 700 }}>
                  {user.slug.toUpperCase()}
                </Typography>
              </Box>
            </Paper>
          </DialogContent>

          <DialogActions>
            <Button variant='contained' color='primary' size='large' onClick={handleCloseDialog}>
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default QrDialog
