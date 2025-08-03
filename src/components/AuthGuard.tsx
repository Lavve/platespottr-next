'use client'

import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useUser } from '@/providers/userProvider'
import AuthenticationScreen from './AuthenticationScreen'
import LoadingSpinner from './common/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useUser()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || isLoading) {
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

  if (!isAuthenticated) {
    return <AuthenticationScreen />
  }

  return <>{children}</>
}

export default AuthGuard
