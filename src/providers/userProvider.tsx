'use client'

import { useTranslations } from 'next-intl'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useCreateUser, useLogin, useLogout, useUserQuery } from '@/hooks/useApi'
import { useSnackbar } from '@/providers/SnackbarProvider'
import { ApiError } from '@/services/api'
import type { AuthData } from '@/types/auth'
import type { IProviderProps } from '@/types/common'
import type { ILoginCredentials, IUser, IUserContext } from '@/types/user'
import { clearAuthData, getAuthData, setAuthData } from '@/utils/security'

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
      updateAuth({
        currentUserId: user.id || null,
        currentUserSlug: user.slug,
        isAuthenticated: true,
      })
    },
    [updateAuth]
  )

  const resetUser = useCallback(() => {
    clearAuthData()

    setAuthDataState({
      currentUserId: null,
      currentUserSlug: null,
      isAuthenticated: false,
    })
  }, [])

  const createUser = useCallback(
    (name: string, pin: string) => {
      setAuthError(null)
      createUserMutation(
        { name, pin },
        {
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
            let errorMsg = t('notifications.login_failed', { code: 'CU' })
            if (error instanceof ApiError) {
              errorMsg = t('notifications.login_failed', { code: error.status })
            }
            setAuthError(errorMsg)
            showError(errorMsg)
          },
        }
      )
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
          } else {
            const errorMsg = response?.message || t('notifications.invalid_credentials')
            setAuthError(errorMsg)
          }
        },
        onError: error => {
          console.error('UserProvider - login error:', error)
          let errorMsg = t('notifications.login_failed', { code: 'LI' })
          if (error instanceof ApiError) {
            errorMsg = t('notifications.login_failed', { code: error.status })
          }
          setAuthError(errorMsg)
        },
      })
    },
    [loginMutation, saveUser, updateAuth, t]
  )

  const logout = useCallback(() => {
    setAuthError(null)

    resetUser()

    if (currentUserId) {
      logoutMutation(currentUserId, {
        onError: error => {
          console.warn('UserProvider - logout API failed, but user already logged out locally:', error)
          let errorMsg = t('notifications.logout_failed', { code: 'LO' })
          if (error instanceof ApiError) {
            errorMsg = t('notifications.logout_failed', { code: error.status })
          }
          setAuthError(errorMsg)
          showError(errorMsg)
        },
      })
    }
  }, [logoutMutation, currentUserId, resetUser, showError, t])

  const user = userData || null

  const updateUserNumbersArray = useCallback(
    (newNumbers: string[]) => {
      if (user) {
        const updatedUser = {
          ...user,
          numbers: newNumbers.map(number => ({ found_at: number, lat: null, lng: null })),
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
          numbers: [...(user.numbers || []), { found_at: newTimestamp, lat: null, lng: null }],
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
      isLoading: isLoadingUser,
      isCreatingUser,
      isAuthenticated,
      isLoggingIn,
      isLoggingOut,
      authError,
      saveUser,
      resetUser,
      createUser,
      addNumberToUser,
      removeLastNumberFromUser,
      removeAllNumbersFromUser,
      updateUserNumbersArray,
      login,
      logout,
      clearAuthError,
    }),
    [
      user,
      isLoadingUser,
      isCreatingUser,
      isAuthenticated,
      isLoggingIn,
      isLoggingOut,
      authError,
      saveUser,
      resetUser,
      createUser,
      addNumberToUser,
      removeLastNumberFromUser,
      removeAllNumbersFromUser,
      updateUserNumbersArray,
      login,
      logout,
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
