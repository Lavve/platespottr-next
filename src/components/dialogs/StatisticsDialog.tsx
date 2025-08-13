'use client'

import { AccountBalanceWallet, BarChart, FormatListNumbered, Map as MapIcon } from '@mui/icons-material'
import { Button, Collapse, Dialog, DialogActions, DialogContent, Tab, Tabs } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import DialogHeader from '@/components/dialogs/DialogHeader'
import ListBlock from '@/components/dialogs/statistics/ListBlock'
import MapBlock from '@/components/dialogs/statistics/MapBlock'
import Stats from '@/components/dialogs/statistics/StatsBlock'
import { useVibration } from '@/hooks/useVibration'
import { MapProvider } from '@/providers/MapProvider'
import { useUser } from '@/providers/userProvider'
import theme from '@/style/theme'
import type { IStatisticsTabs } from '@/types/common'

const StatisticsDialog = () => {
  const t = useTranslations()
  const { vibrate } = useVibration()
  const { user } = useUser()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<IStatisticsTabs>('stats')
  const [shouldResetMapZoom, setShouldResetMapZoom] = useState(true)
  const [pendingZoom, setPendingZoom] = useState<{ lat: number; lng: number } | null>(null)

  const handleCloseDialog = () => {
    vibrate()
    setDialogOpen(false)
    setSettingsTab('stats')
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: IStatisticsTabs) => {
    vibrate()

    if (newValue === 'map') {
      setShouldResetMapZoom(true)
      setPendingZoom(null)
    }

    setSettingsTab(newValue)
  }

  const switchToMapTab = (lat?: number, lng?: number) => {
    setSettingsTab('map')
    setShouldResetMapZoom(false)

    if (lat !== undefined && lng !== undefined) {
      setPendingZoom({ lat, lng })
    }
  }

  useEffect(() => {
    if (settingsTab !== 'map') {
      setShouldResetMapZoom(true)
      setPendingZoom(null)
    }
  }, [settingsTab])

  if (!user) {
    return null
  }

  return (
    <>
      <VibrateButton
        variant='contained'
        color='primary'
        size='large'
        fullWidth
        disabled={!user || user?.numbers?.length === 0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          border: `1px solid ${theme.palette.roadsign.contrastText}`,
        }}
        onClick={() => setDialogOpen(true)}
      >
        <AccountBalanceWallet />
        {t('app.statistics')}
      </VibrateButton>

      {dialogOpen && (
        <Dialog fullWidth maxWidth={settingsTab === 'map' ? 'xl' : 'sm'} open={dialogOpen} onClose={handleCloseDialog}>
          <DialogHeader title={t('app.statistics')} number={user?.numbers?.length} />

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Tabs value={settingsTab} variant='fullWidth' onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label={<BarChart />} value='stats' />
              <Tab label={<FormatListNumbered />} value='list' disabled={!user || user?.numbers?.length === 0} />
              <Tab label={<MapIcon />} value='map' disabled={!user || user?.numbers?.length === 0} />
            </Tabs>

            <MapProvider>
              <Collapse in={settingsTab === 'stats'} timeout={230}>
                <Stats user={user} />
              </Collapse>
              <Collapse in={settingsTab === 'list'} timeout={230}>
                <ListBlock user={user} onShowOnMap={switchToMapTab} />
              </Collapse>
              {settingsTab === 'map' && user?.numbers && user?.numbers.length > 0 && (
                <MapBlock
                  user={user}
                  resetZoom={shouldResetMapZoom}
                  pendingZoom={pendingZoom}
                  onZoomComplete={() => setPendingZoom(null)}
                />
              )}
            </MapProvider>
          </DialogContent>

          <DialogActions>
            <Button variant='outlined' size='large' color='primary' onClick={handleCloseDialog}>
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default StatisticsDialog
