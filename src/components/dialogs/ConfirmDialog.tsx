import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import VibrateButton from '@/components/common/VibrateButton'
import DialogHeader from '@/components/dialogs/DialogHeader'
import type { IConfirmDialogProps } from '@/types/common'

const ConfirmDialog = ({ open, title, content, confirmText, cancelText, onClose, onConfirm }: IConfirmDialogProps) => {
  const t = useTranslations()

  if (!open) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={open}>
      <DialogHeader title={title} />

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
        <VibrateButton size='large' variant='outlined' onClick={onClose}>
          {cancelText || t('common.cancel')}
        </VibrateButton>
        <VibrateButton size='large' onClick={onConfirm} color='primary' variant='contained' autoFocus>
          {confirmText || t('confirm.confirm')}
        </VibrateButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
