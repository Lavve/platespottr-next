export type ThemeMode = 'light' | 'dark' | 'system'

export type Language = 'sv' | 'en'

export type ISettings = {
  theme: ThemeMode
  language: Language
  themeChoice: ThemeMode
  initialRulesDialogOpen?: boolean | undefined
  slug: string
}

export type ISettingsContext = {
  settings: ISettings
  saveSettings: (settings: ISettings) => void
  setTheme: (choice: ThemeMode) => void
}
