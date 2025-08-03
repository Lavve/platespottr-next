// Authentication related types
export interface AuthData {
  currentUserId: string | null
  currentUserSlug: string | null
  isAuthenticated: boolean
}

export interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export interface RegisterDialogProps {
  open: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export interface AuthGuardProps {
  children: React.ReactNode
}
