import type { IUser } from '@/types/user'
import type { IFriendsTabs } from './common'

export interface IFriendProps {
  friend: IUser | null
  place?: number
  onAddFriend?: (friend: IUser) => void
  onRemoveFriend?: (friend: IUser) => void
}

export interface IFriendsContext {
  friendsAll: IUser[]
  friendRequests: IUser[]
  awaitingFriends: IUser[]
  friendList: IUser[]
  addFriend: (friendSlug: string) => number
  removeFriend: (friendId: string, tab: IFriendsTabs) => number
  removeAllFriends: () => void
  resetFriends: () => void
  isLoading: boolean
  confirmFriendRequest: (params: { receiverId: string; requesterId: string }) => void
  isConfirmingFriend: boolean
}

export interface IAddFriendsDialogProps {
  friend: { name: string; slug: string } | null
  isAddFriendDialogOpen: boolean
  onClose: () => void
}
