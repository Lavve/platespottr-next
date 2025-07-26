import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

const CompleteDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Complete</DialogTitle>
      <DialogContent>
        <DialogContentText>お支払いが完了しました。</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompleteDialog
