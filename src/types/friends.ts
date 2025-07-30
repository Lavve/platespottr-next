import type { IUser } from '@/types/user'
import type { IFriendsTabs } from './common'

export interface IFriendProps {
  friend: IUser | null
  place?: number
  onAddFriend?: (friend: IUser) => void
  onRemoveFriend?: (friend: IUser) => void
}

export interface IFriendsContext {
  friendsAll: IUser[] | null
  friendRequests: IUser[]
  awaitingFriends: IUser[]
  friendList: IUser[]
  addFriend: (friend: IUser) => number
  removeFriend: (id: string, tab: IFriendsTabs) => number
  removeAllFriends: () => void
  resetFriends: () => void
}

export interface IAddFriendsDialogProps {
  friendSlug: string | null
  open: boolean
  onClose: () => void
}
