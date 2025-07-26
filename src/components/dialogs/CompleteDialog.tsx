import { EmojiEvents } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useTranslations } from 'next-intl'
import Roadsign from '../Roadsign'

const CompleteDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations()
  if (!open) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Roadsign number='999' text={t('completed.title')} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          {t('completed.description')}
          <EmojiEvents sx={{ fontSize: 80, color: 'success.main' }} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompleteDialog
