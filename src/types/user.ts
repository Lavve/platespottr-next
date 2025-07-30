export interface IUser {
  name: string
  plates: number[]
  friendSince?: number
  requesting?: boolean
  awaiting?: boolean
  slug?: string
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
