'use client'

import { Engineering, History, PersonOutline, Settings } from '@mui/icons-material'
import { Box, Collapse, Dialog, DialogActions, DialogContent, Tab, Tabs } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import DialogHeader from '@/components/dialogs/DialogHeader'
import ResetBlock from '@/components/dialogs/settings/ResetBlock'
import SettingsBlock from '@/components/dialogs/settings/SettingsBlock'
import UserBlock from '@/components/dialogs/settings/UserBlock'
import { useVibration } from '@/hooks/useVibration'
import { useUser } from '@/providers/userProvider'
import type { ISettingsTabs } from '@/types/common'

const SettingsDialog = () => {
  const t = useTranslations()
  const { isAuthenticated } = useUser()
  const { handleClick } = useVibration()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<ISettingsTabs>('reset')

  const handleCloseDialog = () => {
    handleClick()
    setDialogOpen(false)
    setSettingsTab('reset')
  }

  if (!isAuthenticated) {
    return null
  }

  const tabs = [
    { label: <History />, value: 'reset' },
    { label: <Settings />, value: 'settings' },
    { label: <PersonOutline />, value: 'user' },
  ]

  return (
    <>
      <VibrateButton
        variant='outlined'
        color='primary'
        size='large'
        fullWidth
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, px: 1 }}
        startIcon={<Engineering />}
        onClick={() => setDialogOpen(true)}
      >
        {t('app.settings')}
      </VibrateButton>
      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogHeader title={t('app.settings')} />

          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Tabs value={settingsTab} variant='fullWidth' onChange={(_, value) => setSettingsTab(value)} sx={{ mb: 2 }}>
              {tabs.map(tab => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>

            <Box>
              <Collapse in={settingsTab === 'reset'} timeout={230}>
                <ResetBlock />
              </Collapse>
              <Collapse in={settingsTab === 'settings'} timeout={230}>
                <SettingsBlock />
              </Collapse>
              <Collapse in={settingsTab === 'user'} timeout={230}>
                <UserBlock setDialogOpen={handleCloseDialog} />
              </Collapse>
            </Box>
          </DialogContent>

          <DialogActions>
            <VibrateButton variant='outlined' color='primary' size='large' onClick={handleCloseDialog}>
              {t('common.close')}
            </VibrateButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default SettingsDialog
