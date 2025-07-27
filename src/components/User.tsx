import { Bookmark, Check, Close, EmojiEvents, LocalFireDepartment, WorkspacePremium } from '@mui/icons-material'
import { Avatar, Box, Button, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'
import type { IUserProps } from '@/types/user'
import { relativeDays } from '@/utils/dates'

const User = ({ friend, place, onAddFriend, onRemoveFriend }: IUserProps) => {
  const t = useTranslations()
  const { user } = useUser()
  const { maxStreak } = useStatistics(friend.plates)
  const isSelf = user?.name === friend.name

  return (
    <Paper
      key={friend.name}
      sx={{
        px: { xs: 1, md: 2 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: '3px solid',
        borderColor: isSelf ? 'primary.main' : 'transparent',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '50%' }}>
        {place ? (
          <Box sx={{ display: 'flex', alignItems: 'center', width: 40, justifyContent: 'center' }}>
            {place === 1 ? (
              <EmojiEvents sx={{ fontSize: 30, color: '#eab308' }} />
            ) : place === 2 ? (
              <WorkspacePremium sx={{ fontSize: 25, color: '#9ca3af' }} />
            ) : place === 3 ? (
              <Bookmark sx={{ fontSize: 20, color: '#ec6e2c' }} />
            ) : (
              <Typography variant='body2' sx={{ fontWeight: 700, whiteSpace: 'nowrap', textAlign: 'center' }}>
                {place}
              </Typography>
            )}
          </Box>
        ) : (
          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>{friend.name.slice(0, 2)}</Avatar>
        )}
        <Box>
          <Typography variant='h6'>{isSelf ? t('toplist.you') : friend.name}</Typography>
          {!friend.requesting && !place && (
            <Typography variant='body2'>{relativeDays(new Date(friend.friendSince ?? 0))}</Typography>
          )}
        </Box>
      </Box>
      {!friend.requesting && (
        <Box sx={{ display: 'flex', width: '20%', ml: place ? 'auto' : 0 }}>
          <Box sx={{ width: '50%' }}>
            <Typography variant='body1' sx={{ fontWeight: 700, whiteSpace: 'nowrap', textAlign: 'center' }}>
              {friend.plates.length}
            </Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <LocalFireDepartment color='warning' />
              <Typography variant='body2'>{maxStreak}</Typography>
            </Box>
          </Box>
        </Box>
      )}
      {friend.requesting ? (
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
      ) : (
        !place && (
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
      )}
    </Paper>
  )
}

export default User
