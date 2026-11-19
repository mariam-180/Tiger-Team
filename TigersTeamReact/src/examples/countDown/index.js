import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { getCountdown } from 'utils/countdown.mjs';

const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
`;

const Board = styled(Box)({
  width: '100%',
  color: '#ffffff',
});

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  '&::before': {
    content: '""',
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    backgroundColor: '#ff0000',
    animation: `${pulse} 1.6s ease-out infinite`,
  },
  [REDUCED_MOTION_QUERY]: {
    '&::before': {
      animation: 'none',
    },
  },
}));

const Cells = styled(Box)({
  display: 'flex',
  borderTop: '1px solid rgba(255, 255, 255, 0.3)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
});

const Cell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 0,
  padding: theme.spacing(1.5, 0),
  '&:not(:last-of-type)': {
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 0),
  },
}));

const Digits = styled(Typography)({
  fontSize: 'clamp(1.9rem, min(3.4vw, 7vh), 3.4rem)',
  fontWeight: 900,
  lineHeight: 1,
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.95)',
  fontVariantNumeric: 'tabular-nums',
});

const Label = styled(Typography)({
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.65)',
});

const CountdownClock = ({ targetDate }) => {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = getCountdown(targetDate, now);
  const timeLeft = countdown?.timeLeft ?? {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  return (
    <Board>
      <Header>
        <Label>
          {countdown ? 'Race starts in' : 'Race date to be announced'}
        </Label>
      </Header>
      <Cells>
        {Object.keys(timeLeft).map((interval) => (
          <Cell key={interval}>
            <Digits component="p">
              {String(timeLeft[interval]).padStart(2, '0')}
            </Digits>
            <Label>{interval}</Label>
          </Cell>
        ))}
      </Cells>
    </Board>
  );
};

CountdownClock.propTypes = {
  targetDate: PropTypes.string,
};

export default CountdownClock;
