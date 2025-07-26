import { createTheme } from '@mui/material/styles'

// Utöka TypeScript types för custom färger
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

// Utöka komponenter för att använda custom färger
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    roadsign: true
    regplate: true
    accent: true
  }
}

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
    contrastText: '#f7f7f7',
  },
  regplate: {
    main: '#efefef',
    light: '#fff',
    secondary: '#0067a6',
    contrastText: '#111',
  },
  gradients: {
    backgroundLight: 'radial-gradient(circle, #fff 0%, #aaa 100%)',
    backgroundDark: 'radial-gradient(circle, #333 0%, #000 100%)',
    roadsign: 'linear-gradient(135deg, #1365a7 0%, #3385c7 100%)',
    regplate: 'linear-gradient(135deg, #ededed 30%, #fff 70%, #d0d0d0 100%)',
  },
} as const

const theme = createTheme({
  ...base.defaults,
  palette: {
    mode: 'light',
    background: {
      default: '#e1e1e1',
      paper: '#f7f7f7',
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
      main: '#ff6b35',
      light: '#ff8a5c',
      dark: '#e55a2b',
      contrastText: '#f7f7f7',
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
          '--roadsign-secondary': base.roadsign.main,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#f0f0f0',
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
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e1e1e1',
      secondary: '#b0b0b0',
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
    warning: {
      main: '#8B6E36',
      light: '#9E773D',
      dark: '#6E551E',
      contrastText: '#e1e1e1',
    },
    accent: {
      main: '#ff6b35',
      light: '#ff8a5c',
      dark: '#e55a2b',
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
          '--roadsign-secondary': base.roadsign.main,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#181818',
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
  },
})

export default theme
