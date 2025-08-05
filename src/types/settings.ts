export type ThemeMode = 'light' | 'dark' | 'system'
export type Language = 'sv' | 'en' | 'fi'
export type Country = 's' | 'fi'

export type ISettings = {
  theme: ThemeMode
  language: Language
  country: Country
  themeChoice: ThemeMode
  initialRulesDialogOpen?: boolean
  supressedInstallAt?: number
  vibrate?: boolean
}

export type ISettingsContext = {
  settings: ISettings
  saveSettings: (settings: ISettings) => void
  setTheme: (choice: ThemeMode) => void
  resetSettings: () => void
  removeSettings: () => void
}
