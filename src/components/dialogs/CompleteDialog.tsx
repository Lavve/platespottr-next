import { EmojiEvents } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import { useTranslations } from 'next-intl'
import { vibrate } from '@/utils/vibrate'
import DialogHeader from './DialogHeader'

const CompleteDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations()

  if (!open) return null

  const handleClose = () => {
    vibrate()
    onClose()
  }

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
      <DialogHeader title={t('completed.title')} />

      <DialogContent>
        <DialogContentText
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          {t('completed.description')}
          <EmojiEvents sx={{ fontSize: 80, color: 'success.main' }} />
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button size='large' variant='contained' onClick={handleClose}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompleteDialog
