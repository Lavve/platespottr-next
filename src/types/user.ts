export interface IUser {
  id?: string // Optional for backward compatibility
  name: string
  slug: string
  member_since?: string
  numbers?: string[] // API returns timestamps as strings
  friendSince?: number
  requesting?: boolean
  awaiting?: boolean
  requested_at?: string
}

export interface IUserProps {
  friend: IUser
  place?: number
  onAddFriend?: (friend: IUser) => void
  onRemoveFriend?: (friend: IUser) => void
}

export interface IUserContext {
  user: IUser | null
  saveUser: (user: IUser) => void
  resetUser: () => void
  isLoading: boolean
  createUser: (name: string, pin: string) => void
  isCreatingUser: boolean
  addNumberToUser: (newTimestamp: string) => void
  removeLastNumberFromUser: () => void
  removeAllNumbersFromUser: () => void
  updateUserNumbersArray: (newNumbers: string[]) => void
  // Authentication methods
  login: (credentials: ILoginCredentials) => void
  logout: () => void
  isAuthenticated: boolean
  isLoggingIn: boolean
  isLoggingOut: boolean
  // Error handling
  authError: string | null
  clearAuthError: () => void
}

export interface IUserInfo {
  friend: IUserProps['friend']
  isSelf: boolean
}

export interface IUserPlaceDisplay {
  place: number
}

export interface IUserAvatar {
  friend: IUserProps['friend']
}

export interface IUserStatsDisplay {
  friend: IUserProps['friend']
  maxStreak: number
  findsPerDay: { days: number; perday: number }
  scale: number
  place?: number
}

export interface IRequestActions {
  friend: IUserProps['friend']
  onAddFriend?: (friend: IUserProps['friend']) => void
  onRemoveFriend?: (friend: IUserProps['friend']) => void
}

export interface ILoginCredentials {
  name: string
  pin: string
}

export interface ILoginResponse {
  success: boolean
  user?: IUser
  message?: string
}

export interface ILogoutResponse {
  success: boolean
  message?: string
}
