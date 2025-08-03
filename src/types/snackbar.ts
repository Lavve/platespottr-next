// Snackbar related types
export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarMessage {
  message: string
  severity: SnackbarSeverity
  duration?: number
}

export interface SnackbarContextType {
  showSnackbar: (message: string, severity?: SnackbarSeverity, duration?: number) => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
}

export interface SnackbarProviderProps {
  children: React.ReactNode
}
