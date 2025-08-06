'use client'

import { Paper, Typography } from '@mui/material'
import type { IStatsBlockProps } from '@/types/common'

const StatsBlock = ({ title, icon, children }: IStatsBlockProps) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 1,
        p: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon} {title}
      </Typography>
      <Typography variant='body1'>{children}</Typography>
    </Paper>
  )
}

export default StatsBlock
