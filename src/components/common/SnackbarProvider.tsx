'use client'

import { Alert, Snackbar } from '@mui/material'
import { createContext, useCallback, useContext, useState } from 'react'

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info'

interface SnackbarMessage {
  message: string
  severity: SnackbarSeverity
  duration?: number
}

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: SnackbarSeverity, duration?: number) => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

interface SnackbarProviderProps {
  children: React.ReactNode
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null)

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = 'info', duration = 4000) => {
    setSnackbar({ message, severity, duration })
  }, [])

  const showSuccess = useCallback(
    (message: string, duration = 4000) => {
      showSnackbar(message, 'success', duration)
    },
    [showSnackbar]
  )

  const showError = useCallback(
    (message: string, duration = 6000) => {
      showSnackbar(message, 'error', duration)
    },
    [showSnackbar]
  )

  const showWarning = useCallback(
    (message: string, duration = 5000) => {
      showSnackbar(message, 'warning', duration)
    },
    [showSnackbar]
  )

  const showInfo = useCallback(
    (message: string, duration = 4000) => {
      showSnackbar(message, 'info', duration)
    },
    [showSnackbar]
  )

  const handleClose = () => {
    setSnackbar(null)
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={snackbar?.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snackbar?.severity || 'info'} sx={{ width: '100%' }}>
          {snackbar?.message || ''}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
