// Security utilities for better data handling

// Auth data interface
interface AuthData {
  currentUserId: string | null
  currentUserSlug: string | null
  isAuthenticated: boolean
}

// Default auth data
const DEFAULT_AUTH_DATA: AuthData = {
  currentUserId: null,
  currentUserSlug: null,
  isAuthenticated: false,
}

// Constants for localStorage keys
const AUTH_STORAGE_KEY = 'PS_auth'
const LEGACY_AUTH_KEYS = {
  CURRENT_USER_ID: 'currentUserId',
  CURRENT_USER_SLUG: 'currentUserSlug',
  IS_AUTHENTICATED: 'isAuthenticated',
} as const

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
    const authDataString = localStorage.getItem(AUTH_STORAGE_KEY)
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
    console.error('Failed to retrieve auth data from localStorage:', error)
    return DEFAULT_AUTH_DATA
  }
}

/**
 * Sets the complete auth data object in localStorage
 */
export const setAuthData = (authData: AuthData): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to store auth data in localStorage:', error)
    return false
  }
}

/**
 * Updates specific auth data fields
 */
export const updateAuthData = (updates: Partial<AuthData>): boolean => {
  const currentData = getAuthData()
  const updatedData = { ...currentData, ...updates }
  return setAuthData(updatedData)
}

/**
 * Clears all authentication-related data from localStorage
 */
export const clearAuthData = (): void => {
  // Clear new consolidated auth object
  safeLocalStorageRemove(AUTH_STORAGE_KEY)

  // Clear legacy keys
  Object.values(LEGACY_AUTH_KEYS).forEach(key => {
    safeLocalStorageRemove(key)
  })
}

/**
 * Validates PIN format (4 digits)
 */
export const validatePin = (pin: string): boolean => {
  return /^\d{4}$/.test(pin)
}

/**
 * Validates name format (letters, spaces, hyphens, Swedish characters)
 */
export const validateName = (name: string): boolean => {
  return /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/.test(name.trim())
}

// Export types for use in other files
export type { AuthData }
