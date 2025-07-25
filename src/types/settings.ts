export type ThemeMode = 'light' | 'dark' | 'system'

export type ISettings = {
  theme: ThemeMode
  themeChoice: ThemeMode // User's explicit choice
  initialRulesDialogOpen?: boolean | undefined
}

export type ISettingsContext = {
  settings: ISettings
  saveSettings: (settings: ISettings) => void
  setThemeChoice: (choice: ThemeMode) => void
}
