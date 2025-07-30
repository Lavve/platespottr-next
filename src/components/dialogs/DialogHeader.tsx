import { DialogTitle } from '@mui/material'
import Roadsign from '@/components/Roadsign'

const DialogHeader = ({ title, number }: { title: string; number?: number }) => {
  return (
    <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
      <Roadsign text={title} number={number} />
    </DialogTitle>
  )
}

export default DialogHeader
