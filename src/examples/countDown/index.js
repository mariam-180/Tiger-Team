import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PropTypes from 'prop-types';

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
  const calculateTimeLeft = () => {
    const parts = targetDate.split('-');
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const targetDateObject = new Date(formattedDate);
    if (isNaN(targetDateObject)) {
      console.error('Invalid target date');
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const now = new Date();
    now.setHours(now.getHours());
    const difference = +targetDateObject - +now;

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        // seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <Board>
      <Header>
        <Label>Race starts in</Label>
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
  targetDate: PropTypes.string.isRequired,
};

export default CountdownClock;
