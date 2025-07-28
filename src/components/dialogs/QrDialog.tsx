'use client'

import { QrCode } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import VibrateButton from '@/components/common/VibrateButton'
import { useScreenWakeLock } from '@/hooks/useScreenWakeLock'
import { useUser } from '@/providers/userProvider'
import { vibrate } from '@/utils/vibrate'

const QrDialog = () => {
  const t = useTranslations()
  const { user } = useUser()
  const [qrOpen, setQrOpen] = useState(false)
  const { isSupported, isActive, requestWakeLock, releaseWakeLock } = useScreenWakeLock()

  const userSlugValue = useMemo(() => {
    if (!user) return ''
    return `${process.env.NEXT_PUBLIC_SLUG_URL}/#add-friend=${user.slug}`
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
    vibrate()
    setQrOpen(false)
  }

  return (
    <>
      <VibrateButton
        variant='contained'
        fullWidth
        color='primary'
        size='large'
        disabled={!userSlugValue || !user}
        startIcon={<QrCode />}
        onClick={() => setQrOpen(true)}
      >
        {t('friends.show_my_qr')}
      </VibrateButton>

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
              <Typography variant='body2' sx={{ textAlign: 'center' }}>
                {t('friends.your_platespottr_code')}
              </Typography>
              <Typography variant='body1' sx={{ textAlign: 'center', color: 'secondary.light' }}>
                {user.slug}
              </Typography>
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
