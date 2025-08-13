'use client'

import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import VibrateButton from '@/components/common/VibrateButton'
import DialogHeader from '@/components/dialogs/DialogHeader'
import type { IConfirmDialogProps } from '@/types/common'

const ConfirmDialog = ({
  open,
  title,
  content,
  confirmText,
  cancelText,
  onClose,
  onConfirm,
  loading,
}: IConfirmDialogProps) => {
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
        <Typography>{content}</Typography>
      </DialogContent>

      <DialogActions>
        <VibrateButton size='large' variant='outlined' color='primary' onClick={onClose} disabled={loading}>
          {cancelText || t('common.cancel')}
        </VibrateButton>
        <VibrateButton size='large' color='primary' variant='contained' onClick={onConfirm} autoFocus loading={loading}>
          {confirmText || t('confirm.confirm')}
        </VibrateButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
