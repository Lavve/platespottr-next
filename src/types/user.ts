export interface IUser {
  name: string
  plates: number[]
  friendSince?: number
  requesting: boolean
  slug: string
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
}
