import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import type { IConfirmDialogProps } from '@/types/common'
import Roadsign from '../Roadsign'

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }: IConfirmDialogProps) => {
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
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={onConfirm} color='primary' variant='contained' autoFocus>
          {t('confirm.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
