export type ThemeMode = 'light' | 'dark' | 'system'
export type Language = 'sv' | 'en' | 'fi'
export type Country = 's' | 'fi' | 'us' | 'ee' | 'lt'
export type Vibrate = 'on' | 'off' | 'max'
export type LatLang = 'on' | 'off'

export type ISettings = {
  theme: ThemeMode
  language: Language
  country: Country
  themeChoice: ThemeMode
  initialRulesDialogOpen?: boolean
  supressedInstallAt?: number
  vibrate?: Vibrate
  latlang?: LatLang
}

export type ISettingsContext = {
  settings: ISettings
  saveSettings: (settings: ISettings) => void
  setTheme: (choice: ThemeMode) => void
  resetSettings: () => void
  removeSettings: () => void
}
