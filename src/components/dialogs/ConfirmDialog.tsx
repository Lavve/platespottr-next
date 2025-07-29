import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import VibrateButton from '@/components/common/VibrateButton'
import Roadsign from '@/components/Roadsign'
import type { IConfirmDialogProps } from '@/types/common'

const ConfirmDialog = ({ open, title, content, confirmText, cancelText, onClose, onConfirm }: IConfirmDialogProps) => {
  const t = useTranslations()

  if (!open) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={open}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Roadsign text={title} />
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Typography variant='body1'>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <VibrateButton onClick={onClose}>{cancelText || t('common.cancel')}</VibrateButton>
        <VibrateButton onClick={onConfirm} color='primary' variant='contained' autoFocus>
          {confirmText || t('confirm.confirm')}
        </VibrateButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
