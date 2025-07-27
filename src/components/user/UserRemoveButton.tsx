import { Close } from '@mui/icons-material'
import { Button } from '@mui/material'
import type { IUserRemoveButton } from '@/types/user'

const UserRemoveButton = ({ friend, onRemoveFriend }: IUserRemoveButton) => (
  <Button
    variant='contained'
    color='error'
    size='small'
    sx={{ minWidth: 40, ml: 'auto' }}
    onClick={() => onRemoveFriend?.(friend)}
  >
    <Close />
  </Button>
)

export default UserRemoveButton
