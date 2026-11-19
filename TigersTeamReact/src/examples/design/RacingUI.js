import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Navbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';
import surface from 'utils/productSurface';

export const panelSx = {
  bgcolor: '#14141c',
  border: '1px solid #34343f',
  borderRadius: { xs: '20px', md: '28px' },
  color: '#fff',
  minWidth: 0,
  overflowWrap: 'anywhere',
};
export const buttonSx = {
  bgcolor: '#c71935',
  color: '#fff',
  borderRadius: '11px',
  px: 3,
  py: 1.5,
  fontWeight: 800,
  '&:hover': { bgcolor: '#ec2948', color: '#fff' },
  '&.Mui-disabled': { bgcolor: '#4c2430', color: '#c6a5ad' },
};
export const kickerSx = {
  color: '#f18a9b',
  fontWeight: 800,
  fontSize: '0.65rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  mb: 1.5,
};

export function RacingProvider({ children }) {
  const base = useTheme();
  const theme = useMemo(
    () =>
      createTheme(base, {
        palette: {
          mode: 'dark',
          primary: { main: '#e23853' },
          background: { default: '#090a0f', paper: '#171720' },
          text: { primary: '#f4f4fa', secondary: '#adadbf' },
        },
        components: {
          MuiMenuItem: {
            styleOverrides: {
              root: {
                '&.Mui-selected': {
                  color: '#ff6077',
                  backgroundColor: '#461a28',
                  fontWeight: 800,
                },
                '&.Mui-selected:hover': { backgroundColor: '#5c2031' },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: { '&.Mui-selected': { color: '#ff4d68' } },
            },
          },
          MuiTableSortLabel: {
            styleOverrides: {
              root: {
                '&.Mui-active, &.Mui-active .MuiTableSortLabel-icon': {
                  color: '#ff4d68',
                },
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                backgroundColor: '#281a21',
                color: '#f6edf0',
                border: '1px solid #713041',
                '& .MuiAlert-icon': { color: '#ff7288' },
                '& .MuiAlert-message': { overflowWrap: 'anywhere' },
              },
            },
          },
          MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
          MuiTextField: { defaultProps: { variant: 'outlined' } },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 11,
                backgroundColor: '#1c1c26',
                color: '#fff',
              },
              notchedOutline: { borderColor: '#454553' },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: { color: '#adadbf', '&.Mui-focused': { color: '#ff5c73' } },
            },
          },
        },
      }),
    [base],
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
RacingProvider.propTypes = { children: PropTypes.node };

export default function RacingPage({ children }) {
  return (
    <RacingProvider>
      <Box sx={{ ...surface, minHeight: '100dvh' }}>
        <Navbar />
        <Box
          component="main"
          sx={{
            minHeight: '100dvh',
            boxSizing: 'border-box',
            pt: 'clamp(116px,16dvh,152px)',
            pb: { xs: 5, md: 8 },
            px: { xs: 2, sm: 3, lg: 6 },
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto', minWidth: 0 }}>{children}</Box>
        </Box>
        <Footer />
      </Box>
    </RacingProvider>
  );
}
RacingPage.propTypes = { children: PropTypes.node };
