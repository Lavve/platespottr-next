// Security utilities for better data handling

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
 * Clears all authentication-related data from localStorage
 */
export const clearAuthData = (): void => {
  const authKeys = ['currentUserId', 'currentUserSlug', 'isAuthenticated']
  authKeys.forEach(key => safeLocalStorageRemove(key))
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
