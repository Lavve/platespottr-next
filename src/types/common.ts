export interface IPlateProps {
  letters: string
  number: number
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

export interface IProviderProps {
  children: React.ReactNode
}

export interface IBeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}
