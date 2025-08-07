'use client'

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import type { IUserInfo } from '@/types/user'
import { relativeDays } from '@/utils/dates'

const UserInfo = ({ friend, place }: IUserInfo) => {
  const t = useTranslations()

  return (
    <Box>
      <Typography
        variant='body2'
        sx={{
          fontWeight: 700,
        }}
        title={relativeDays(new Date(friend.friendSince ?? 0), t)}
      >
        {friend.slug.toUpperCase()}
      </Typography>
      {friend.requested_at && !place && (
        <Typography variant='body2'>
          {t('friends.requested_at', { date: relativeDays(new Date(friend.requested_at), t) })}
        </Typography>
      )}
    </Box>
  )
}

export default UserInfo
