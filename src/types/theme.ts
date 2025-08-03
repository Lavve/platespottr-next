import type { ReactNode } from 'react'

// Theme related types
export interface ThemeProviderProps {
  children: ReactNode
}

export interface ThemeContextType {
  isDarkMode: boolean
  setTheme: (mode: 'light' | 'dark' | 'system') => void
}

// MUI theme extensions
declare module '@mui/material/styles' {
  interface Palette {
    roadsign: Palette['primary'] & {
      secondary?: string
    }
    regplate: Palette['primary'] & {
      secondary?: string
    }
    accent: Palette['primary']
  }

  interface PaletteOptions {
    roadsign?: PaletteOptions['primary'] & {
      secondary?: string
    }
    regplate?: PaletteOptions['primary'] & {
      secondary?: string
    }
    accent?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    roadsign: true
    regplate: true
    accent: true
  }
}
