import { createTheme } from '@mui/material';

// Design tokens from www.gracefulcarehk.com (web-app/tailwind.config.js)
export const brand = {
  orange: '#F5883B',
  orangeDark: '#E67A2E',
  beige: '#FAF4ED',
  blue: '#5066A6',
  darkBlue: '#1B243B',
  text: '#555962',
  textDark: '#323740',
  grey: '#8F96A4',
  greyBg: '#F3F4F6',
  greyTab: '#959595',
  outline: '#E4E4E4',
  white: '#FFFFFF',
};

// Shared section layout, matching the main site's max-w-7xl container and paddings
export const sectionInner = {
  maxWidth: 1280,
  mx: 'auto',
  px: { xs: 2, md: 5 },
  py: { xs: 5, md: 8 },
} as const;

// Sticky header height (same as the main site navbar); anchored sections scroll below it
export const HEADER_HEIGHT = { xs: 60, md: 92 };

const theme = createTheme({
  // The main site switches to its mobile layout below 936px
  breakpoints: {
    values: { xs: 0, sm: 600, md: 936, lg: 1200, xl: 1536 },
  },
  palette: {
    primary: { main: brand.orange, dark: brand.orangeDark, contrastText: brand.white },
    secondary: { main: brand.blue, contrastText: brand.white },
    text: { primary: brand.text, secondary: brand.grey },
    background: { default: brand.white, paper: brand.white },
    divider: brand.outline,
  },
  typography: {
    fontFamily: "'Noto Sans TC', sans-serif",
    h1: { fontSize: '2.5rem', lineHeight: 1.35, fontWeight: 500, letterSpacing: '0.15px' },
    h2: { fontSize: '2rem', lineHeight: 1.6, fontWeight: 500 },
    h3: { fontSize: '1.5rem', lineHeight: 1.5, fontWeight: 500 },
    h4: { fontSize: '1.25rem', lineHeight: 1.4, fontWeight: 500 },
    h5: { fontSize: '1.125rem', lineHeight: 1.4, fontWeight: 500 },
    h6: { fontSize: '1rem', lineHeight: 1.5, fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    button: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 100, padding: '10px 24px' },
        sizeLarge: { padding: '12px 32px', fontSize: '1rem' },
        outlined: { borderColor: brand.outline, backgroundColor: brand.white },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: brand.outline },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: brand.blue },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: brand.orange },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: brand.text, '&.Mui-focused': { color: brand.orange } },
      },
    },
  },
});

export default theme;
