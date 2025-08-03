import { createTheme } from '@mui/material/styles'
import type { ThemeContextType, ThemeProviderProps } from '@/types/theme'

// Base-konfiguration för custom färger som används i båda teman
const base = {
  defaults: {
    direction: 'ltr',
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  },
  roadsign: {
    main: '#0067a6',
    border: '#f7f7f7',
    contrastText: '#f7f7f7',
  },
  regplate: {
    main: '#efefef',
    light: '#fff',
    secondary: '#0067a6',
    contrastText: '#222',
  },
  gradients: {
    backgroundLight:
      'linear-gradient(to right, #d7d7d7, #dedede, #e6e6e6, #ededed, #f5f5f5, #f5f5f5, #f5f5f5, #f5f5f5, #ededed, #e6e6e6, #dedede, #d7d7d7)',
    backgroundDark:
      'linear-gradient(to right, #000000, #0e0e0e, #181818, #202020, #282828, #282828, #282828, #282828, #202020, #181818, #0e0e0e, #000000)',
    roadsign: 'linear-gradient(135deg, #1365a7 0%, #3385c7 100%)',
    regplate: 'linear-gradient(135deg, #ededed 30%, #fff 70%, #d0d0d0 100%)',
  },
} as const

const theme = createTheme({
  ...base.defaults,
  palette: {
    mode: 'light',
    background: {
      default: '#f1f1f1',
      paper: '#e1e1e1',
    },
    text: {
      primary: '#111',
      secondary: '#444',
    },
    primary: {
      main: '#0067a6',
      light: '#3385c7',
      dark: '#004d7a',
      contrastText: '#f7f7f7',
    },
    secondary: {
      main: '#333',
      light: '#666',
      dark: '#000',
      contrastText: '#f7f7f7',
    },
    success: {
      main: '#008000',
      light: '#00b300',
      dark: '#006600',
      contrastText: '#f7f7f7',
    },
    warning: {
      main: '#8B6E36',
      light: '#9E773D',
      dark: '#6E551E',
      contrastText: '#f7f7f7',
    },
    error: {
      main: '#973838',
      light: '#993838',
      dark: '#591919',
      contrastText: '#f7f7f7',
    },
    accent: {
      main: '#8235FF',
      light: '#9966FF',
      dark: '#6600FF',
      contrastText: '#e1e1e1',
    },
    roadsign: {
      ...base.roadsign,
    },
    regplate: {
      ...base.regplate,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--background-gradient': base.gradients.backgroundLight,
          '--roadsign-gradient': base.gradients.roadsign,
          '--regplate-gradient': base.gradients.regplate,
          '--regplate-secondary': base.regplate.secondary,
          '--regplate-stars': 'rgb(191 173 103)',
          '--roadsign-secondary': base.roadsign.main,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#f0f0f0',
          border: '1px solid #fff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#fefefe',
        },
      },
    },
  },
})

// Skapa mörkt tema
export const darkTheme = createTheme({
  ...base.defaults,
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#282828',
    },
    text: {
      primary: '#F1F1F1',
      secondary: 'rgba(241, 241, 241, 0.8)',
    },
    primary: {
      main: '#0067a6',
      light: '#3385c7',
      dark: '#004d7a',
      contrastText: '#f7f7f7',
    },
    secondary: {
      main: '#fff',
      light: '#e0e0e0',
      dark: '#ccc',
      contrastText: '#000',
    },
    success: {
      main: '#008000',
      light: '#00b300',
      dark: '#006600',
      contrastText: '#f7f7f7',
    },
    warning: {
      main: '#8B6E36',
      light: '#9E773D',
      dark: '#6E551E',
      contrastText: '#e1e1e1',
    },
    accent: {
      main: '#8235FF',
      light: '#9966FF',
      dark: '#6600FF',
      contrastText: '#e1e1e1',
    },
    error: {
      main: '#973838',
      light: '#993838',
      dark: '#952929',
      contrastText: '#fff',
    },
    roadsign: {
      ...base.roadsign,
    },
    regplate: {
      ...base.regplate,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--background-gradient': base.gradients.backgroundDark,
          '--roadsign-gradient': base.gradients.roadsign,
          '--regplate-gradient': base.gradients.regplate,
          '--regplate-secondary': base.regplate.secondary,
          '--regplate-stars': 'rgb(191 173 103)',
          '--roadsign-secondary': base.roadsign.main,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#181818',
          border: '1px solid #333',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#121212',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export default theme
