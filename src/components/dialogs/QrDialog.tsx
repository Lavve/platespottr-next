'use client'

import { Box, Button, Dialog, DialogActions, DialogContent, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import QRCode from 'react-qr-code'
import { useUser } from '@/providers/userProvider'

const QrDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations()
  const { user } = useUser()

  if (!open) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
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
            value={`${process.env.NEXT_PUBLIC_SLUG_URL}${user?.slug}`}
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
          <Typography variant='body1' sx={{ textAlign: 'center', color: 'secondary.light' }} fontWeight='bold'>
            {user?.slug}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='primary' size='large' onClick={onClose}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default QrDialog
