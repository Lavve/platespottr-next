import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import type { IUserInfo } from '@/types/user'
import { relativeDays } from '@/utils/dates'

const UserInfo = ({ friend, isSelf, place }: IUserInfo) => {
  const t = useTranslations()

  return (
    <Box>
      <Typography variant='h6'>{isSelf ? t('toplist.you') : friend.name}</Typography>
      {!place && (
        <Typography
          variant='body2'
          sx={{
            fontSize: 12,
          }}
          title={relativeDays(new Date(friend.friendSince ?? 0))}
        >
          {friend.slug}
        </Typography>
      )}
    </Box>
  )
}

export default UserInfo
