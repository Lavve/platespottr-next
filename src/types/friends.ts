import type { IUser } from '@/types/user'

export interface IFriendProps {
  friend: IUser | null
  place?: number
  onAddFriend?: (friend: IUser) => void
  onRemoveFriend?: (friend: IUser) => void
}

export interface IFriendsContext {
  friendsAll: IUser[] | null
  friendRequests: IUser[]
  friendList: IUser[]
  addFriend: (friend: IUser) => void
  removeFriend: (id: string) => number
  resetFriends: () => void
}

export interface IAddFriendsDialogProps {
  friendSlug: string | null
  open: boolean
  onClose: () => void
}
