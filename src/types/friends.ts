import type { IUser } from '@/types/user'

export interface IFriendProps {
  friend: IUser
  place?: number
  onAddFriend?: (friend: IUser) => void
  onRemoveFriend?: (friend: IUser) => void
}

export interface IFriendsContext {
  friends: IUser[]
  friendRequests: IUser[]
  friendList: IUser[]
  addFriend: (friend: IUser) => void
  removeFriend: (id: string) => void
  resetFriends: () => void
}

export interface IAddFriendsDialogProps {
  friendSlug: string | null
  open: boolean
  onClose: () => void
}
