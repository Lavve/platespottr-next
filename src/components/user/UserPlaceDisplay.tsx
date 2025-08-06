'use client'

import { Bookmark, EmojiEvents, WorkspacePremium } from '@mui/icons-material'
import { Typography } from '@mui/material'
import type { IUserPlaceDisplay } from '@/types/user'

const UserPlaceDisplay = ({ place }: IUserPlaceDisplay) => {
  if (place === 1) {
    return <EmojiEvents sx={{ fontSize: 30, color: '#eab308' }} />
  }
  if (place === 2) {
    return <WorkspacePremium sx={{ fontSize: 25, color: '#9ca3af' }} />
  }
  if (place === 3) {
    return <Bookmark sx={{ fontSize: 20, color: '#ec6e2c' }} />
  }
  return (
    <Typography variant='body2' sx={{ fontWeight: 700, whiteSpace: 'nowrap', textAlign: 'center' }}>
      {place}
    </Typography>
  )
}

export default UserPlaceDisplay
