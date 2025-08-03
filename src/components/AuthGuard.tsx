'use client'

import { Box } from '@mui/material'
import { useUser } from '@/providers/userProvider'
import AuthenticationScreen from './AuthenticationScreen'
import LoadingSpinner from './common/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useUser()

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <LoadingSpinner />
      </Box>
    )
  }

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <AuthenticationScreen />
  }

  // Show main app content if authenticated
  return <>{children}</>
}

export default AuthGuard
