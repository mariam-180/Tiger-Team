import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import RacingPage, {
  panelSx,
  buttonSx,
  kickerSx,
} from 'examples/design/RacingUI';
import { safeRedirect } from 'utils/authData.mjs';
export default function LoginRequiredPage() {
  const location = useLocation();
  const from = safeRedirect(
    `${location.state?.from?.pathname || '/'}${location.state?.from?.search || ''}`,
  );
  return (
    <RacingPage>
      <Box
        sx={{
          ...panelSx,
          maxWidth: 620,
          mx: 'auto',
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
        }}
      >
        <Typography sx={kickerSx}>Your driver account</Typography>
        <Typography
          component="h1"
          sx={{
            color: '#fff',
            fontSize: 'clamp(2rem,4vw,3rem)',
            fontWeight: 900,
            mb: 2,
          }}
        >
          One step from the grid.
        </Typography>
        <Typography sx={{ color: '#aaaabd', lineHeight: 1.8, mb: 3 }}>
          Sign in to confirm your reservation or complete your order.
        </Typography>
        <Button
          component={Link}
          to={`/registration?redirect=${encodeURIComponent(from)}`}
          sx={buttonSx}
        >
          Sign in to continue
        </Button>
        <Button
          component={Link}
          to="/"
          sx={{
            display: 'block',
            width: 'fit-content',
            mx: 'auto',
            mt: 2,
            color: '#aaaabd',
          }}
        >
          Back to home
        </Button>
      </Box>
    </RacingPage>
  );
}
