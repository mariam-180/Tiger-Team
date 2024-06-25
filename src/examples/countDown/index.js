import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CountdownClock = ({ targetDate }) => {
  const theme = useTheme();
  const styles = {
    clockContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: theme.spacing(5),
      [theme.breakpoints.down('sm')]: {
        width: '230px',
        '& .MuiTypography-h1': {
          fontSize: '2.0rem',
        },
      },
      [theme.breakpoints.up('md')]: {
        width: '280px',
        '& .MuiTypography-h1': {
          fontSize: '3.0rem',
        },
      },
      [theme.breakpoints.up('lg')]: {
        width: '380px',
        '& .MuiTypography-h1': {
          fontSize: '3.9rem',
        },
      },
    },
    clock: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(270deg, #4a0305, #1b1b1b)',
      color: '#e4e4e4',
      textShadow: '1px 1px 7px #0a0a0a',
      borderRadius: '15px',
      border: '2px solid #3a3a3a',
      boxShadow: '0 0 10px 0px rgba(0, 0, 0, 0.5)',
      animation: 'fadeIn 1s ease-out',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: {
        xs: theme.spacing(1),
        sm: theme.spacing(1),
        md: theme.spacing(1),
        lg: theme.spacing(1),
      },
    },
    number: {
      fontSize: '4rem',
      color: '#d53c3c',
      lineHeight: 1,
    },
    label: {
      fontSize: {
        xs: '0.5rem',
        sm: '0.5rem',
        md: '0.6rem',
        lg: '0.6rem',
      },
      textTransform: 'uppercase',
      color: '#878787',
      textShadow: 'none',
    },
  };

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

    const difference = +targetDateObject - +new Date();

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
        seconds: Math.floor((difference / 1000) % 60),
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
    <Box sx={styles.clockContainer}>
      <Box sx={styles.clock}>
        {Object.keys(timeLeft).map((interval) => (
          <Box key={interval} sx={styles.section}>
            <Typography variant="h1" component="p" sx={styles.number}>
              {timeLeft[interval]}
            </Typography>
            <Typography variant="caption" sx={styles.label}>
              {interval}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

CountdownClock.propTypes = {
  targetDate: PropTypes.string.isRequired,
};

export default CountdownClock;
