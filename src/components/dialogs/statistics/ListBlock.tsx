'use client'

import { ChevronRight } from '@mui/icons-material'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'
import type { IUser, IUserNumber } from '@/types/user'
import { relativeDays } from '@/utils/dates'

const ListBlock = ({ user, onShowOnMap }: { user: IUser; onShowOnMap: (lat?: number, lng?: number) => void }) => {
  const t = useTranslations()

  const sortDesc = (a: IUserNumber, b: IUserNumber) => {
    return new Date(b.found_at).getTime() - new Date(a.found_at).getTime()
  }

  const handleShowOnMap = (number: IUserNumber, hasLocation: boolean) => {
    if (hasLocation && number.lat && number.lng) {
      const lat = Number(number.lat)
      const lng = Number(number.lng)
      onShowOnMap(lat, lng)
    }
  }

  return (
    <>
      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {t('statistics.latest_found_number')}
      </Typography>
      <List component='nav' sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {user.numbers?.sort(sortDesc).map((number, index) => {
          const hasLocation = number.lat !== null && number.lng !== null

          return (
            <ListItem
              component='div'
              disablePadding
              key={number.found_at}
              sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            >
              <ListItemButtonWrapper hasLocation={hasLocation} onClick={() => handleShowOnMap(number, hasLocation)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent', border: '2px solid', borderColor: 'primary.main' }}>
                    <Logo size={24} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {((user.numbers?.length || 0) - index).toString().padStart(3, '0')}
                    </Typography>
                  }
                  secondary={relativeDays(new Date(number.found_at), t)}
                  sx={{ m: 0 }}
                />
                {hasLocation && <ChevronRight />}
              </ListItemButtonWrapper>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

const ListItemButtonWrapper = ({
  children,
  hasLocation,
  onClick,
}: {
  children: React.ReactNode
  hasLocation: boolean
  onClick?: () => void
}) => {
  const t = useTranslations()

  return hasLocation && onClick ? (
    <ListItemButton onClick={onClick} title={t('statistics.show_on_map')}>
      {children}
    </ListItemButton>
  ) : (
    <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>{children}</Box>
  )
}

export default ListBlock
