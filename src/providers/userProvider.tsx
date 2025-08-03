'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSnackbar } from '@/components/common/SnackbarProvider'
import { defaultUser } from '@/constants/user'
import { useCreateUser, useLogin, useLogout, useUserQuery } from '@/hooks/useApi'
import type { IProviderProps } from '@/types/common'
import type { ILoginCredentials, IUser, IUserContext } from '@/types/user'
import { clearAuthData, safeLocalStorageGet, safeLocalStorageSet } from '@/utils/security'

const UserContext = createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: IProviderProps) => {
  const t = useTranslations()
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return safeLocalStorageGet('currentUserId')
  })

  const [currentUserSlug, setCurrentUserSlug] = useState<string | null>(() => {
    return safeLocalStorageGet('currentUserSlug')
  })

  // Authentication state - initialize from localStorage but ensure it's cleared on logout
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuth = safeLocalStorageGet('isAuthenticated')
    console.log('Initializing isAuthenticated from localStorage:', storedAuth)
    return storedAuth === 'true'
  })

  // Error state for authentication
  const [authError, setAuthError] = useState<string | null>(null)

  // Use default user if no localStorage data exists
  const userId = currentUserId || defaultUser.id
  const slug = currentUserSlug || defaultUser.slug

  // Query user data
  const { data: userData, isLoading: isLoadingUser } = useUserQuery(userId, slug, true)

  // Create user mutation
  const { mutate: createUserMutation, isPending: isCreatingUser } = useCreateUser()

  // Login mutation
  const { mutate: loginMutation, isPending: isLoggingIn } = useLogin()

  // Logout mutation
  const { mutate: logoutMutation, isPending: isLoggingOut } = useLogout()

  // Set user data when available
  useEffect(() => {
    if (userData) {
      setCurrentUserId(userData.id || null)
      setCurrentUserSlug(userData.slug)

      if (userData.id) {
        safeLocalStorageSet('currentUserId', userData.id)
      }
      safeLocalStorageSet('currentUserSlug', userData.slug)
    }
  }, [userData])

  // Sync authentication state with user data
  useEffect(() => {
    if (userData?.id) {
      // If we have valid user data, ensure we're authenticated
      if (!isAuthenticated) {
        setIsAuthenticated(true)
        safeLocalStorageSet('isAuthenticated', 'true')
      }
    } else if (!userData && isAuthenticated) {
      // If no user data but we think we're authenticated, clear auth state
      setIsAuthenticated(false)
      safeLocalStorageSet('isAuthenticated', 'false')
    }
  }, [userData, isAuthenticated])

  const saveUser = useCallback((user: IUser) => {
    setCurrentUserId(user.id || null)
    setCurrentUserSlug(user.slug)

    if (user.id) {
      safeLocalStorageSet('currentUserId', user.id)
    }
    safeLocalStorageSet('currentUserSlug', user.slug)
  }, [])

  const resetUser = useCallback(() => {
    console.log('resetUser called')

    // Clear localStorage first
    clearAuthData()

    // Then reset state
    setCurrentUserId(null)
    setCurrentUserSlug(null)
    setIsAuthenticated(false)
    setAuthError(null)

    // Clear all user-related queries from cache
    queryClient.removeQueries({ queryKey: ['user'] })
    queryClient.removeQueries({ queryKey: ['friends'] })
    queryClient.removeQueries({ queryKey: ['incomingRequests'] })
    queryClient.removeQueries({ queryKey: ['outgoingRequests'] })

    console.log('resetUser completed - isAuthenticated should be false')
  }, [queryClient])

  const clearAuthError = useCallback(() => {
    setAuthError(null)
  }, [])

  const createUser = useCallback(
    (name: string) => {
      setAuthError(null) // Clear any previous errors
      createUserMutation(name, {
        onSuccess: (data: unknown) => {
          const response = data as { success: boolean; user?: IUser; message?: string }
          if (response?.user) {
            saveUser(response.user)
            setIsAuthenticated(true)
            if (typeof window !== 'undefined') {
              localStorage.setItem('isAuthenticated', 'true')
            }
            showSuccess(t('notifications.account_created'))
          } else {
            const errorMsg = response?.message || t('notifications.account_creation_failed')
            setAuthError(errorMsg)
            showError(errorMsg)
          }
        },
        onError: error => {
          console.error('UserProvider - createUser error:', error)
          const errorMsg = t('notifications.account_creation_failed')
          setAuthError(errorMsg)
          showError(errorMsg)
        },
      })
    },
    [createUserMutation, saveUser, showSuccess, showError, t]
  )

  const login = useCallback(
    (credentials: ILoginCredentials) => {
      setAuthError(null) // Clear any previous errors
      loginMutation(credentials, {
        onSuccess: (data: unknown) => {
          const response = data as { success: boolean; user?: IUser; message?: string }
          if (response?.user) {
            saveUser(response.user)
            setIsAuthenticated(true)
            if (typeof window !== 'undefined') {
              localStorage.setItem('isAuthenticated', 'true')
            }
            showSuccess(t('notifications.login_success'))
          } else {
            const errorMsg = response?.message || t('notifications.invalid_credentials')
            setAuthError(errorMsg)
            showError(errorMsg)
          }
        },
        onError: error => {
          console.error('UserProvider - login error:', error)
          const errorMsg = t('notifications.login_failed')
          setAuthError(errorMsg)
          showError(errorMsg)
        },
      })
    },
    [loginMutation, saveUser, showSuccess, showError, t]
  )

  const logout = useCallback(() => {
    console.log('UserProvider - logout called')
    console.log('Before logout - isAuthenticated:', isAuthenticated)
    console.log('Before logout - currentUserId:', currentUserId)

    setAuthError(null) // Clear any previous errors

    // Always reset user data immediately for better UX
    resetUser()

    console.log('After resetUser - isAuthenticated:', isAuthenticated)
    console.log('After resetUser - currentUserId:', currentUserId)

    showSuccess(t('notifications.logout_success'))

    // Try to call the logout API, but don't block on it
    if (currentUserId) {
      logoutMutation(currentUserId, {
        onSuccess: () => {
          console.log('UserProvider - logout API success')
        },
        onError: error => {
          console.warn('UserProvider - logout API failed, but user already logged out locally:', error)
          // User is already logged out locally, so this is not a problem
        },
      })
    }
  }, [logoutMutation, currentUserId, resetUser, showSuccess, t, isAuthenticated])

  const user = userData || null

  const updateUserNumbersArray = useCallback(
    (newNumbers: string[]) => {
      if (user) {
        const updatedUser = {
          ...user,
          numbers: newNumbers,
        }
        saveUser(updatedUser)
      }
    },
    [user, saveUser]
  )

  const addNumberToUser = useCallback(
    (newTimestamp: string) => {
      if (user) {
        const updatedUser = {
          ...user,
          numbers: [...(user.numbers || []), newTimestamp],
        }
        saveUser(updatedUser)
      }
    },
    [user, saveUser]
  )

  const removeLastNumberFromUser = useCallback(() => {
    if (user?.numbers && user.numbers.length > 0) {
      const updatedUser = {
        ...user,
        numbers: user.numbers.slice(0, -1),
      }
      saveUser(updatedUser)
    }
  }, [user, saveUser])

  const removeAllNumbersFromUser = useCallback(() => {
    if (user) {
      const updatedUser = {
        ...user,
        numbers: [],
      }
      saveUser(updatedUser)
    }
  }, [user, saveUser])

  const value = useMemo(
    () => ({
      user,
      saveUser,
      resetUser,
      isLoading: isLoadingUser,
      createUser,
      isCreatingUser,
      addNumberToUser,
      removeLastNumberFromUser,
      removeAllNumbersFromUser,
      updateUserNumbersArray,
      // Authentication methods
      login,
      logout,
      isAuthenticated,
      isLoggingIn,
      isLoggingOut,
      // Error handling
      authError,
      clearAuthError,
    }),
    [
      user,
      saveUser,
      resetUser,
      isLoadingUser,
      createUser,
      isCreatingUser,
      addNumberToUser,
      removeLastNumberFromUser,
      removeAllNumbersFromUser,
      updateUserNumbersArray,
      login,
      logout,
      isAuthenticated,
      isLoggingIn,
      isLoggingOut,
      authError,
      clearAuthError,
    ]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserProvider
