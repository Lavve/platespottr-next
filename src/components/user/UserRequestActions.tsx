'use client'

import { Check, Close } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useTranslations } from 'next-intl'
import VibrateButton from '@/components/common/VibrateButton'
import type { IRequestActions } from '@/types/user'

const UserRequestActions = ({ friend, onAddFriend, onRemoveFriend }: IRequestActions) => {
  const t = useTranslations()

  return (
    <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
      {friend.awaiting && (
        <VibrateButton
          variant='contained'
          color='success'
          size='small'
          sx={{ minWidth: 40, backgroundColor: 'success.dark', color: 'success.contrastText' }}
          onClick={() => onAddFriend?.(friend)}
          title={t('friends.accept_request')}
        >
          <Check />
        </VibrateButton>
      )}
      <VibrateButton
        variant='contained'
        color='error'
        size='small'
        sx={{ minWidth: 40 }}
        onClick={() => onRemoveFriend?.(friend)}
        title={t('friends.decline_request')}
      >
        <Close />
      </VibrateButton>
    </Box>
  )
}

export default UserRequestActions
