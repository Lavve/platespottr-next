import { Check, Close } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import type { IRequestActions } from '@/types/user'

const UserRequestActions = ({ friend, onAddFriend, onRemoveFriend }: IRequestActions) => (
  <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
    <Button
      variant='contained'
      color='success'
      size='small'
      sx={{ minWidth: 40 }}
      onClick={() => onAddFriend?.(friend)}
    >
      <Check />
    </Button>
    <Button
      variant='contained'
      color='error'
      size='small'
      sx={{ minWidth: 40 }}
      onClick={() => onRemoveFriend?.(friend)}
    >
      <Close />
    </Button>
  </Box>
)

export default UserRequestActions
