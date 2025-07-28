import { Check, Close } from '@mui/icons-material'
import { Box } from '@mui/material'
import VibrateButton from '@/components/common/VibrateButton'
import type { IRequestActions } from '@/types/user'

const UserRequestActions = ({ friend, onAddFriend, onRemoveFriend }: IRequestActions) => (
  <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
    <VibrateButton
      variant='contained'
      color='success'
      size='small'
      sx={{ minWidth: 40 }}
      onClick={() => onAddFriend?.(friend)}
    >
      <Check />
    </VibrateButton>
    <VibrateButton
      variant='contained'
      color='error'
      size='small'
      sx={{ minWidth: 40 }}
      onClick={() => onRemoveFriend?.(friend)}
    >
      <Close />
    </VibrateButton>
  </Box>
)

export default UserRequestActions
