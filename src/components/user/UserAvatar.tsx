import { Avatar } from '@mui/material'
import type { IUserAvatar } from '@/types/user'

const UserAvatar = ({ friend }: IUserAvatar) => (
  <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>{friend.name.slice(0, 2)}</Avatar>
)

export default UserAvatar
