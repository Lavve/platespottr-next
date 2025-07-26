export type ThemeMode = 'light' | 'dark' | 'system'
export type Language = 'sv' | 'en' | 'fi'
export type Country = 'se' | 'fi'

export type ISettings = {
  theme: ThemeMode
  language: Language
  country: Country
  themeChoice: ThemeMode
  initialRulesDialogOpen?: boolean | undefined
  slug: string
}

export type ISettingsContext = {
  settings: ISettings
  saveSettings: (settings: ISettings) => void
  setTheme: (choice: ThemeMode) => void
}
