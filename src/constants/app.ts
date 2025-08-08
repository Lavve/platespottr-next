import type { AuthData } from '@/types/auth'

export const SUPPRESS_INSTALL_DURATION_DAYS = 7
export const HOLD_DURATION = 1000
export const VIBRATE_SUBTILE = 3
export const VIBRATE_SUCCESS = 100
export const VIBRATE_ALERT = [20, 100, 200]
export const VIBRATE_MAX_MULTIPLYER = 10
export const DISABLE_REFRESH_REQUESTS_TIME = 30

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
