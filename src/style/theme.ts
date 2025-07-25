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

// Base-konfiguration för custom färger som används i båda temana
const generalColors = {
  roadsign: {
    main: '#0067a6',
    contrastText: '#fff',
  },
  regplate: {
    main: '#efefef',
    light: '#fff',
    secondary: '#0067a6',
    contrastText: '#111',
  },
  gradients: {
    backgroundLight: 'radial-gradient(circle, #fff 0%, #efefef 100%)',
    backgroundDark: 'radial-gradient(circle, #333 50%, #000 100%)',
    roadsign: 'linear-gradient(135deg, #1365a7 0%, #3385c7 100%)',
    regplate: 'linear-gradient(135deg, #ededed 30%, #fff 70%, #d0d0d0 100%)',
  },
} as const

const theme = createTheme({
  direction: 'ltr',
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    mode: 'light', // Default mode
    background: {
      default: '#e1e1e1',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    primary: {
      main: '#333',
      light: '#666',
      dark: '#000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#0067a6',
      light: '#3385c7',
      dark: '#004d7a',
      contrastText: '#fff',
    },
    accent: {
      main: '#ff6b35',
      light: '#ff8a5c',
      dark: '#e55a2b',
      contrastText: '#fff',
    },
    roadsign: {
      ...generalColors.roadsign,
    },
    regplate: {
      ...generalColors.regplate,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--background-gradient': generalColors.gradients.backgroundLight,
          '--roadsign-gradient': generalColors.gradients.roadsign,
          '--regplate-gradient': generalColors.gradients.regplate,
          '--regplate-secondary': generalColors.regplate.secondary,
          '--roadsign-secondary': generalColors.roadsign.main,
        },
      },
    },
  },
})

// Skapa mörkt tema
export const darkTheme = createTheme({
  direction: 'ltr',
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
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
      main: '#fff',
      light: '#e0e0e0',
      dark: '#ccc',
      contrastText: '#000',
    },
    secondary: {
      main: '#0067a6',
      light: '#3385c7',
      dark: '#004d7a',
      contrastText: '#e1e1e1',
    },
    accent: {
      main: '#ff6b35',
      light: '#ff8a5c',
      dark: '#e55a2b',
      contrastText: '#e1e1e1',
    },
    roadsign: {
      ...generalColors.roadsign,
    },
    regplate: {
      ...generalColors.regplate,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--background-gradient': generalColors.gradients.backgroundDark,
          '--roadsign-gradient': generalColors.gradients.roadsign,
          '--regplate-gradient': generalColors.gradients.regplate,
          '--regplate-secondary': generalColors.regplate.secondary,
          '--roadsign-secondary': generalColors.roadsign.main,
        },
      },
    },
  },
})

export default theme
