export interface IPlateProps {
  letters: string
  number: number
  scale?: number
}

export interface IRoadsignProps {
  number?: string
  text: string
}

export interface IConfirmDialogProps {
  open: boolean
  title: string
  content: string
  onClose: () => void
  onConfirm: () => void
}
