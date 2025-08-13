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
  installedVersion?: string
}

export type ISettingsContext = {
  settings: ISettings
  isLoadingSettings: boolean
  setTheme: (choice: ThemeMode) => ISettings
  resetSettings: () => void
  removeSettings: () => void
  saveSettings: (settings: ISettings) => void
  syncSettingsToApi: () => Promise<void>
}
