import type { ISettings } from '@/types/settings'

export const defaultSettings: ISettings = {
  theme: 'light',
  themeChoice: 'system',
  language: 'sv',
  country: 's',
  initialRulesDialogOpen: true,
  vibrate: 'on',
  latlang: 'off',
  installedVersion: '',
}

export const languages = [
  { value: 'sv', labelKey: 'settings.swedish' },
  { value: 'fi', labelKey: 'settings.finnish' },
  { value: 'en', labelKey: 'settings.english' },
]

export const countries = [
  { value: 's', labelKey: 'settings.sweden' },
  { value: 'fi', labelKey: 'settings.finland' },
  { value: 'us', labelKey: 'settings.united_states' },
  { value: 'ee', labelKey: 'settings.estonia' },
  { value: 'lt', labelKey: 'settings.lithuania' },
]
