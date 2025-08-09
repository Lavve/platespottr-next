'use client'

import { CalendarMonth, LocalFireDepartment, Percent, Timeline } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import StatsListBlock from '@/components/common/StatsListBlock'
import { useStatistics } from '@/hooks/useStatistics'
import type { IUser } from '@/types/user'
import { relativeDays } from '@/utils/dates'

const StatsBlock = ({ user }: { user: IUser }) => {
  const t = useTranslations()
  const { latestFinding, maxStreak, findsPerDay, maxWeek, findingsByWeek } = useStatistics(user?.numbers)

  const sortedFindingsByWeek = useMemo(() => {
    const sorted = Array.from(findingsByWeek.entries()).sort((a, b) => a[0] - b[0])

    return sorted.slice(sorted.length - 10, sorted.length)
  }, [findingsByWeek])

  return (
    <>
      {/* Latest found number */}
      {latestFinding && (
        <StatsListBlock
          title={t('statistics.latest_found_number')}
          icon={<CalendarMonth sx={{ color: 'primary.light' }} />}
        >
          {relativeDays(new Date(latestFinding.found_at), t)}
        </StatsListBlock>
      )}

      {/* Current streak */}
      {maxStreak > 1 && (
        <StatsListBlock
          title={t('statistics.current_streak')}
          icon={<LocalFireDepartment sx={{ color: 'warning.light' }} />}
        >
          {t('statistics.streaks_days_in_a_row', { streak: maxStreak })}
        </StatsListBlock>
      )}

      {/* Finds per day */}
      {findsPerDay.days > 0 && findsPerDay.perday > 0 && (
        <StatsListBlock title={t('statistics.finds_per_day')} icon={<Percent sx={{ color: 'accent.light' }} />}>
          {findsPerDay.perday}/dag
        </StatsListBlock>
      )}

      {/* Numbers per week */}
      {sortedFindingsByWeek.length > 1 && user?.numbers?.length && user.numbers.length > 1 && (
        <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline sx={{ color: 'success.light' }} /> {t('statistics.numbers_per_week')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {sortedFindingsByWeek.map(([week, count]: [number, number]) => {
              return (
                <Box key={`w${week}`} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Typography variant='caption' color='text.secondary'>
                    V{week}
                  </Typography>
                  <Box sx={{ flexGrow: 1, width: '100%', height: 15 }}>
                    <Box
                      sx={{
                        width: `${(count / maxWeek) * 100}%`,
                        height: '100%',
                        backgroundColor: count === maxWeek ? 'primary.light' : 'primary.dark',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Typography sx={{ textAlign: 'right' }}>{count}</Typography>
                </Box>
              )
            })}
          </Box>
        </Paper>
      )}
    </>
  )
}

export default StatsBlock
