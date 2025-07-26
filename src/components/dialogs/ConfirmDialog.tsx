import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import type { IConfirmDialogProps } from '@/types/common'

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }: IConfirmDialogProps) => {
  if (!open) return null

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Avbryt</Button>
        <Button onClick={onConfirm} color='primary' variant='contained'>
          Bekräfta
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
