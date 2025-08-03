'use client'

import { useTranslations } from 'next-intl'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSnackbar } from '@/components/common/SnackbarProvider'
import { useCreateUser, useLogin, useLogout, useUserQuery } from '@/hooks/useApi'
import type { IProviderProps } from '@/types/common'
import type { ILoginCredentials, IUser, IUserContext } from '@/types/user'
import { type AuthData, clearAuthData, getAuthData, setAuthData } from '@/utils/security'

const UserContext = createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: IProviderProps) => {
  const t = useTranslations()
  const { showSuccess, showError } = useSnackbar()

  // Initialize auth state from localStorage
  const [authData, setAuthDataState] = useState<AuthData>(() => {
    return getAuthData()
  })

  const { currentUserId, currentUserSlug, isAuthenticated } = authData

  // Error state for authentication
  const [authError, setAuthError] = useState<string | null>(null)

  // Only query user data if we have a valid user ID and are authenticated
  const { data: userData, isLoading: isLoadingUser } = useUserQuery(
    currentUserId || undefined,
    currentUserSlug || undefined,
    true,
    !isAuthenticated || !currentUserId
  )

  // Create user mutation
  const { mutate: createUserMutation, isPending: isCreatingUser } = useCreateUser()

  // Login mutation
  const { mutate: loginMutation, isPending: isLoggingIn } = useLogin()

  // Logout mutation
  const { mutate: logoutMutation, isPending: isLoggingOut } = useLogout()

  // Update auth data in state and localStorage
  const updateAuth = useCallback((updates: Partial<AuthData>) => {
    setAuthDataState(prev => {
      const newAuthData = { ...prev, ...updates }
      setAuthData(newAuthData)
      return newAuthData
    })
  }, [])

  // Set user data when available
  useEffect(() => {
    if (userData) {
      updateAuth({
        currentUserId: userData.id || null,
        currentUserSlug: userData.slug,
      })
    }
  }, [userData, updateAuth])

  // Sync authentication state with user data
  useEffect(() => {
    if (userData?.id && isAuthenticated) {
      // If we have valid user data and are authenticated, ensure auth state is correct
      updateAuth({
        currentUserId: userData.id,
        currentUserSlug: userData.slug,
        isAuthenticated: true,
      })
    } else if (!userData && isAuthenticated && !isLoadingUser) {
      // Only clear auth state if we're not loading and have no user data
      // This prevents clearing auth state during the initial load
      updateAuth({
        currentUserId: null,
        currentUserSlug: null,
        isAuthenticated: false,
      })
    }
  }, [userData, isAuthenticated, updateAuth, isLoadingUser])

  const saveUser = useCallback(
    (user: IUser) => {
      // Update auth data immediately with the new user
      updateAuth({
        currentUserId: user.id || null,
        currentUserSlug: user.slug,
        isAuthenticated: true,
      })
    },
    [updateAuth]
  )

  const resetUser = useCallback(() => {
    console.log('UserProvider - resetUser called')

    // Clear localStorage first
    clearAuthData()

    // Reset state to defaults
    setAuthDataState({
      currentUserId: null,
      currentUserSlug: null,
      isAuthenticated: false,
    })

    console.log('resetUser completed - isAuthenticated should be false')
  }, [])

  const createUser = useCallback(
    (name: string) => {
      setAuthError(null)
      createUserMutation(name, {
        onSuccess: (data: unknown) => {
          const response = data as { success: boolean; user?: IUser; message?: string }
          if (response?.user) {
            saveUser(response.user)
            updateAuth({ isAuthenticated: true })
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
    [createUserMutation, saveUser, updateAuth, showSuccess, showError, t]
  )

  const login = useCallback(
    (credentials: ILoginCredentials) => {
      setAuthError(null) // Clear any previous errors
      loginMutation(credentials, {
        onSuccess: (data: unknown) => {
          const response = data as { success: boolean; user?: IUser; message?: string }
          if (response?.user) {
            saveUser(response.user)
            updateAuth({ isAuthenticated: true })
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
    [loginMutation, saveUser, updateAuth, showSuccess, showError, t]
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

  const clearAuthError = useCallback(() => {
    setAuthError(null)
  }, [])

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
      login,
      logout,
      isAuthenticated,
      isLoggingIn,
      isLoggingOut,
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
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserProvider
