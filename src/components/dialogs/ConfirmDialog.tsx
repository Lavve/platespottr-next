import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslations } from 'next-intl'
import type { IConfirmDialogProps } from '@/types/common'

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }: IConfirmDialogProps) => {
  const t = useTranslations()

  if (!open) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={onConfirm} color='primary' variant='contained' autoFocus>
          {t('confirm.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
