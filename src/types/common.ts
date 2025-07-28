import type { ButtonProps } from '@mui/material'

export interface IPlateProps {
  letters: string
  number: number
}

export interface IVibrateButtonProps extends ButtonProps {
  vibrationPattern?: number | number[]
  disableVibration?: boolean
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

export interface IHashNavigationState {
  friendSlug: string | null
  isAddFriendDialogOpen: boolean
  isAddPlateDialogOpen: boolean
}

export interface IVibrationOptions {
  pattern?: number | number[]
  enabled?: boolean
}

export type ISortBy = 'plates' | 'streak' | 'percentage'
