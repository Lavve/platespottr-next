import { AUTH_KEY, DEFAULT_AUTH_DATA, LEGACY_AUTH_KEYS, SETTINGS_KEY } from '@/constants/app'
import type { AuthData } from '@/types/auth'

/**
 * Safely stores data in localStorage with error handling
 */
export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to store data in localStorage:', error)
    return false
  }
}

/**
 * Safely retrieves data from localStorage with error handling
 */
export const safeLocalStorageGet = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  } catch (error) {
    console.error('Failed to retrieve data from localStorage:', error)
    return null
  }
}

/**
 * Safely removes data from localStorage with error handling
 */
export const safeLocalStorageRemove = (key: string): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to remove data from localStorage:', error)
    return false
  }
}

/**
 * Gets the complete auth data object from localStorage
 */
export const getAuthData = (): AuthData => {
  try {
    if (typeof window === 'undefined') {
      return DEFAULT_AUTH_DATA
    }

    // Try to get the new consolidated auth object
    const authDataString = localStorage.getItem(AUTH_KEY)
    if (authDataString) {
      const parsedData = JSON.parse(authDataString)
      return { ...DEFAULT_AUTH_DATA, ...parsedData }
    }

    // Fall back to legacy individual keys and migrate them
    const legacyData: Partial<AuthData> = {}
    let hasLegacyData = false

    // Check for legacy keys
    const legacyUserId = localStorage.getItem(LEGACY_AUTH_KEYS.CURRENT_USER_ID)
    const legacyUserSlug = localStorage.getItem(LEGACY_AUTH_KEYS.CURRENT_USER_SLUG)
    const legacyIsAuthenticated = localStorage.getItem(LEGACY_AUTH_KEYS.IS_AUTHENTICATED)

    if (legacyUserId) {
      legacyData.currentUserId = legacyUserId
      hasLegacyData = true
    }

    if (legacyUserSlug) {
      legacyData.currentUserSlug = legacyUserSlug
      hasLegacyData = true
    }

    if (legacyIsAuthenticated) {
      legacyData.isAuthenticated = legacyIsAuthenticated === 'true'
      hasLegacyData = true
    }

    // If we found legacy data, migrate it to the new format
    if (hasLegacyData) {
      const migratedData = { ...DEFAULT_AUTH_DATA, ...legacyData }
      setAuthData(migratedData)

      // Clean up legacy keys
      Object.values(LEGACY_AUTH_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })

      return migratedData
    }

    return DEFAULT_AUTH_DATA
  } catch (error) {
    console.error('Failed to get auth data:', error)
    return DEFAULT_AUTH_DATA
  }
}

/**
 * Sets the complete auth data object in localStorage
 */
export const setAuthData = (authData: AuthData): boolean => {
  try {
    return safeLocalStorageSet(AUTH_KEY, JSON.stringify(authData))
  } catch (error) {
    console.error('Failed to set auth data:', error)
    return false
  }
}

/**
 * Updates specific fields in the auth data
 */
export const updateAuthData = (updates: Partial<AuthData>): boolean => {
  try {
    const currentData = getAuthData()
    const updatedData = { ...currentData, ...updates }
    return setAuthData(updatedData)
  } catch (error) {
    console.error('Failed to update auth data:', error)
    return false
  }
}

/**
 * Clears all auth data from localStorage
 */
export const clearAuthData = (): void => {
  try {
    safeLocalStorageRemove(AUTH_KEY)
    safeLocalStorageRemove(SETTINGS_KEY)

    // Also clean up any legacy keys that might still exist
    Object.values(LEGACY_AUTH_KEYS).forEach(key => {
      safeLocalStorageRemove(key)
    })
  } catch (error) {
    console.error('Failed to clear auth data:', error)
  }
}

/**
 * Validates PIN format
 */
export const validatePin = (pin: string): boolean => {
  return /^\d{4}$/.test(pin)
}

/**
 * Validates name format
 */
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50
}
