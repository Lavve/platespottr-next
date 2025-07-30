import type { ButtonProps, IconButtonProps } from '@mui/material'

export interface IPlateProps {
  number: number
}

export interface IVibrateButtonProps extends ButtonProps {
  vibrationPattern?: number | number[]
  disableVibration?: boolean
}

export interface IVibrateIconButtonProps extends IconButtonProps {
  vibrationPattern?: number | number[]
  disableVibration?: boolean
}

export interface IRoadsignProps {
  number?: string | number
  text: string
}

export interface IConfirmDialogProps {
  open: boolean
  title: string
  content: string
  confirmText?: string
  cancelText?: string
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
export type IFriendsTabs = 'friends' | 'awaiting' | 'requests'

export interface IStatsBlockProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}
