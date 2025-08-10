import type { AuthData } from '@/types/auth'

export const HOLD_DURATION_SECONDS = 1
export const SUPPRESS_INSTALL_DURATION_DAYS = 7
export const DISABLE_REFRESH_REQUESTS_SECONDS = 30

// Vibrate patterns
export const VIBRATES = {
  SUBTILE: 3,
  SUCCESS: 100,
  ALERT: [20, 100, 200],
  MAX_MULTIPLIER: 10,
}

// Local storage keys
export const SETTINGS_KEY = 'PS_settings'
export const AUTH_KEY = 'PS_auth'
export const NUMBERS_KEY = 'PS_numbers'

export const DEFAULT_AUTH_DATA: AuthData = {
  currentUserId: null,
  currentUserSlug: null,
  isAuthenticated: false,
}

// Constants for localStorage keys
export const LEGACY_AUTH_KEYS = {
  CURRENT_USER_ID: 'currentUserId',
  CURRENT_USER_SLUG: 'currentUserSlug',
  IS_AUTHENTICATED: 'isAuthenticated',
} as const

// App store URLs
export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=app.vercel.platespottr.twa'
