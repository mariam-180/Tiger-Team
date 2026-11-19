import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

export default function LoadingScreen({
  label = 'Loading your next experience',
  fullScreen = true,
  delay = 180,
}) {
  const [visible, setVisible] = useState(delay === 0);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  if (!visible)
    return (
      <Box
        aria-hidden="true"
        sx={{
          ...(fullScreen ? { backgroundColor: '#060708' } : {}),
          minHeight: fullScreen ? '100dvh' : 320,
          width: '100%',
        }}
      />
    );
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        ...(fullScreen ? { backgroundColor: '#060708' } : {}),
        minHeight: fullScreen ? '100dvh' : 320,
        width: '100%',
        minWidth: 0,
        overflowWrap: 'anywhere',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Typography
        sx={{
          color: '#ee7c92',
          fontSize: '0.65rem',
          fontWeight: 800,
          letterSpacing: '0.28em',
          mb: 2,
        }}
      >
        TIGERS TEAM RACING
      </Typography>
      <Box
        aria-hidden="true"
        sx={{
          width: 76,
          height: 76,
          position: 'relative',
          mb: 3,
          borderRadius: '50%',
          border: '1px solid #3e2938',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -1,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#ec3152',
            borderRightColor: '#6c203a',
            animation: 'race-loader-spin 900ms linear infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 20,
            border: '1px solid #9e2946',
            transform: 'rotate(45deg)',
            bgcolor: 'rgba(199,25,53,0.15)',
          },
          '@keyframes race-loader-spin': {
            to: { transform: 'rotate(360deg)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            '&::before': { animation: 'none' },
          },
        }}
      />
      <Typography
        sx={{
          color: '#fff',
          fontSize: 'clamp(1.25rem,3vw,1.7rem)',
          fontWeight: 900,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ color: '#9292aa', fontSize: '0.8rem', mt: 1 }}>
        Getting everything ready for you.
      </Typography>
    </Box>
  );
}
LoadingScreen.propTypes = {
  label: PropTypes.string,
  fullScreen: PropTypes.bool,
  delay: PropTypes.number,
};
