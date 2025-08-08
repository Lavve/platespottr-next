'use client'

import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import AuthenticationScreen from '@/components/auth/AuthenticationScreen'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useUser } from '@/providers/userProvider'
import type { AuthGuardProps } from '@/types/auth'

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
