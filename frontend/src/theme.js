import { createTheme } from '@mui/material/styles';

// StudyStack brand theme — derived from the existing brand accent (#aa3bff)
// used across the favicon / icon set, extended into a full, production-grade
// Material UI theme.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7c3aed',
      light: '#a56bff',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0ea5e9',
      light: '#47bfff',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16a34a',
    },
    warning: {
      main: '#d97706',
    },
    error: {
      main: '#dc2626',
    },
    background: {
      default: '#faf9fc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1523',
      secondary: '#6b6375',
    },
    divider: '#e5e4e7',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
          paddingBlock: 9,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 20px -6px rgba(124, 58, 237, 0.45)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 0 0 rgba(20, 15, 30, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #e5e4e7',
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

export default theme;
