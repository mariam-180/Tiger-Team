import {createTheme} from '@mui/material/styles';

// Base styles
import colors from 'assets/theme/base/colors';
import breakpoints from 'assets/theme/base/breakpoints';
import typography from 'assets/theme/base/typography';
import boxShadows from 'assets/theme/base/boxShadows';
import borders from 'assets/theme/base/borders';
import globals from 'assets/theme/base/globals';

// Helper functions
import boxShadow from 'assets/theme/functions//boxShadow';
import hexToRgb from 'assets/theme/functions//hexToRgb';
import linearGradient from 'assets/theme/functions//linearGradient';
import linearGradientV1 from 'assets/theme/functions//linearGradient@3';
import pxToRem from 'assets/theme/functions//pxToRem';
import rgba from 'assets/theme/functions//rgba';

// Components base styles for @mui material components
import button from 'assets/theme/components/button';
import flatpickr from 'assets/theme/components/flatpickr';
import container from 'assets/theme/components/container';

const theme = createTheme({
  breakpoints: {...breakpoints},
  palette: {...colors},
  typography: {...typography},
  boxShadows: {...boxShadows},
  borders: {...borders},
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    linearGradientV1,
    pxToRem,
    rgba,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...flatpickr,
        ...container,
      },
    },
    MuiButton: {...button},
  },
});

export default theme;
