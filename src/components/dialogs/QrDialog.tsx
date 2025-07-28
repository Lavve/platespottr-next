'use client'

import { QrCode } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import QRCode from 'react-qr-code'
import { useUser } from '@/providers/userProvider'
import { vibrate } from '@/utils/vibrate'

const QrDialog = () => {
  const t = useTranslations()
  const { user } = useUser()
  const [qrOpen, setQrOpen] = useState(false)

  if (!user) return null

  return (
    <>
      <Button
        variant='contained'
        fullWidth
        color='primary'
        size='large'
        startIcon={<QrCode />}
        onClick={() => {
          vibrate()
          setQrOpen(!qrOpen)
        }}
      >
        {t('friends.show_my_qr')}
      </Button>
      {qrOpen && (
        <Dialog fullWidth maxWidth='sm' open={qrOpen} onClose={() => setQrOpen(false)}>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: 1,
                p: 3,
                backgroundColor: 'white',
                borderRadius: 1,
              }}
            >
              <QRCode
                size={250}
                value={`${process.env.NEXT_PUBLIC_SLUG_URL}/#add-friend=${user.slug}`}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              />
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
            <Button variant='contained' color='primary' size='large' onClick={() => setQrOpen(false)}>
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default QrDialog
