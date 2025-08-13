'use client'

import {
  AutoMode,
  DarkMode,
  EdgesensorHigh,
  LightMode,
  LocationOff,
  LocationOn,
  MobileOff,
  Vibration,
} from '@mui/icons-material'
import { Box, ButtonGroup, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import { countries, languages } from '@/constants/settings'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import type { Country, Language, LatLang, ThemeMode, Vibrate } from '@/types/settings'
import type { IUser } from '@/types/user'
import { setUserLocale } from '@/utils/locale'

const SettingsBlock = () => {
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const { settings, saveSettings, setTheme } = useSettings()
  const [country, setCountry] = useState<Country>(settings.country)
  const [confirmChangeCountryDialogOpen, setConfirmChangeCountryDialogOpen] = useState(false)
  const hasGeolocationDefined = typeof navigator !== 'undefined' && 'geolocation' in navigator

  const handleChangeTheme = (themeChoice: ThemeMode) => {
    if (settings.themeChoice !== themeChoice) {
      setTheme(themeChoice)
    }
  }

  const handleChangeVibrate = (vibrate: Vibrate) => {
    if (settings.vibrate !== vibrate) {
      saveSettings({ ...settings, vibrate })
    }
  }

  const handleChangeLatLang = async (latlang: LatLang) => {
    if (latlang === 'on') {
      try {
        if (!hasGeolocationDefined || settings.latlang !== 'off') {
          saveSettings({ ...settings, latlang: 'off' })
          return
        }

        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName })

        if (permissionStatus.state === 'granted') {
          saveSettings({ ...settings, latlang: 'on' })
        } else if (permissionStatus.state === 'denied') {
          saveSettings({ ...settings, latlang: 'off' })
        } else if (permissionStatus.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            () => {
              if (settings.latlang !== latlang) {
                saveSettings({ ...settings, latlang })
              }
            },
            () => {
              saveSettings({ ...settings, latlang: 'off' })
            },
            { timeout: 10000, enableHighAccuracy: false }
          )
        }
      } catch {
        saveSettings({ ...settings, latlang: 'off' })
      }
    } else {
      if (settings.latlang !== latlang) {
        saveSettings({ ...settings, latlang })
      }
    }
  }

  const handleChangeLanguage = (language: Language) => {
    if (settings.language !== language) {
      saveSettings({ ...settings, language })
    }
    setUserLocale(language as Language)
  }

  const handleChangeCountry = (country: Country) => {
    setCountry(country)
    setConfirmChangeCountryDialogOpen(true)
  }

  const handleConfirmChangeCountry = (country: Country) => {
    if (settings.country !== country) {
      saveSettings({ ...settings, country })
    }
    saveUser({ ...user, numbers: [] } as IUser)
    setConfirmChangeCountryDialogOpen(false)
  }

  return (
    <>
      <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        {/* Appearance Select */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>{t('settings.appearance')}</Typography>
          <ButtonGroup fullWidth>
            <VibrateButton
              onClick={() => handleChangeTheme('light')}
              size='large'
              variant={settings.themeChoice === 'light' ? 'contained' : 'outlined'}
              color={settings.themeChoice === 'light' ? 'primary' : 'secondary'}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            >
              <LightMode />
              {t('settings.light')}
            </VibrateButton>
            <VibrateButton
              onClick={() => handleChangeTheme('dark')}
              size='large'
              variant={settings.themeChoice === 'dark' ? 'contained' : 'outlined'}
              color={settings.themeChoice === 'dark' ? 'primary' : 'secondary'}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            >
              <DarkMode />
              {t('settings.dark')}
            </VibrateButton>
            <VibrateButton
              onClick={() => handleChangeTheme('system')}
              size='large'
              variant={settings.themeChoice === 'system' ? 'contained' : 'outlined'}
              color={settings.themeChoice === 'system' ? 'primary' : 'secondary'}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            >
              <AutoMode />
              {t('settings.auto')}
            </VibrateButton>
          </ButtonGroup>
        </Box>

        {/* Vibrate Select */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>{t('settings.vibrate')}</Typography>
          <ButtonGroup fullWidth>
            <VibrateButton
              variant={settings.vibrate === 'on' ? 'contained' : 'outlined'}
              color={settings.vibrate === 'on' ? 'primary' : 'secondary'}
              size='large'
              onClick={() => handleChangeVibrate('on')}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            >
              <Vibration />
              {t('common.on')}
            </VibrateButton>
            <VibrateButton
              variant={settings.vibrate === 'off' ? 'contained' : 'outlined'}
              color={settings.vibrate === 'off' ? 'primary' : 'secondary'}
              size='large'
              onClick={() => handleChangeVibrate('off')}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            >
              <MobileOff />
              {t('common.off')}
            </VibrateButton>
            <VibrateButton
              variant={settings.vibrate === 'max' ? 'contained' : 'outlined'}
              color={settings.vibrate === 'max' ? 'primary' : 'secondary'}
              size='large'
              onClick={() => handleChangeVibrate('max')}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            >
              <EdgesensorHigh />
              {t('common.max')}
            </VibrateButton>
          </ButtonGroup>
        </Box>

        {/* LatLang Select */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>{t('settings.latlang')}</Typography>
          <ButtonGroup fullWidth disabled={!hasGeolocationDefined}>
            <VibrateButton
              variant={settings.latlang === 'off' ? 'contained' : 'outlined'}
              color={settings.latlang === 'off' ? 'primary' : 'secondary'}
              size='large'
              onClick={() => handleChangeLatLang('off')}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            >
              <LocationOff />
              {t('common.off')}
            </VibrateButton>
            <VibrateButton
              variant={settings.latlang === 'on' ? 'contained' : 'outlined'}
              color={settings.latlang === 'on' ? 'primary' : 'secondary'}
              size='large'
              onClick={() => handleChangeLatLang('on')}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            >
              <LocationOn />
              {t('common.on')}
            </VibrateButton>
          </ButtonGroup>
          <Typography variant='body2' color='text.secondary'>
            {t('settings.latlang_description')}
          </Typography>
        </Box>

        {/* Language Select */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>{t('settings.language')}</Typography>
          <FormControl fullWidth>
            <InputLabel id='language_select'>{t('settings.language')}</InputLabel>
            <Select
              labelId='language_select'
              id='language_select'
              value={settings.language}
              label={t('settings.language')}
              onChange={e => handleChangeLanguage(e.target.value as Language)}
            >
              {languages
                .sort((a, b) => a.labelKey.localeCompare(b.labelKey))
                .map(language => (
                  <MenuItem key={language.value} value={language.value}>
                    {t(language.labelKey)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        {/* Country Select */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>{t('settings.country')}</Typography>
          <FormControl fullWidth>
            <InputLabel id='country_select'>{t('settings.country')}</InputLabel>
            <Select
              labelId='country_select'
              id='country_select'
              value={settings.country}
              label={t('settings.country')}
              onChange={e => handleChangeCountry(e.target.value as Country)}
            >
              {countries
                .sort((a, b) => a.labelKey.localeCompare(b.labelKey))
                .map(country => (
                  <MenuItem key={country.value} value={country.value}>
                    {t(country.labelKey)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <ConfirmDialog
        open={confirmChangeCountryDialogOpen}
        title={t('confirm.change_country_title')}
        content={t('confirm.change_country_content')}
        onClose={() => setConfirmChangeCountryDialogOpen(false)}
        onConfirm={() => handleConfirmChangeCountry(country)}
      />
    </>
  )
}

export default SettingsBlock
