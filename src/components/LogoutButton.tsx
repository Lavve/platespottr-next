import { Logout, Person } from '@mui/icons-material'
import { Avatar, Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useUser } from '@/providers/userProvider'

const LogoutButton = () => {
  const t = useTranslations()
  const { user, logout, isLoggingOut } = useUser()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleLogout = useCallback(() => {
    handleClose()
    logout()
  }, [logout, handleClose])

  if (!user) return null

  return (
    <>
      <Button
        variant='outlined'
        color='primary'
        onClick={handleClick}
        disabled={isLoggingOut}
        startIcon={<Person />}
        sx={{ minWidth: 'auto', px: 2 }}
      >
        <Typography variant='body2' noWrap>
          {user.name}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>{user.name.charAt(0).toUpperCase()}</Avatar>
          </ListItemIcon>
          <ListItemText
            primary={user.name}
            secondary={user.slug}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </MenuItem>
        <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          <ListItemText>{isLoggingOut ? t('auth.logging_out') : t('auth.logout')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default LogoutButton
