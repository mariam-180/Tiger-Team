import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled, keyframes } from '@mui/material/styles';

import CountdownClock from 'examples/countDown';
import WelcomingEventPage from 'examples/heroSection';

import { fetchControllers, getControllerByName } from 'utils/controllers';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Card = styled('section')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(4),
  boxSizing: 'border-box',
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.spacing(5, 4, 4),
  background: 'rgba(8, 8, 10, 0.66)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: '28px',
  boxShadow: '0 30px 70px rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(18px) saturate(140%)',
  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  animation: `${slideIn} 0.9s ${EASING} both`,
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(3),
    padding: theme.spacing(4, 3, 3),
    borderRadius: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2, 2.5),
    borderRadius: '18px',
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Banner = ({
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
}) => {
  const [targetDate, setTargetDate] = useState('2024-11-22');

  useEffect(() => {
    const loadTargetDate = async () => {
      try {
        const controllers = await fetchControllers();
        const targetDateController = getControllerByName(
          controllers,
          'EventStartDate',
        );
        if (targetDateController) {
          setTargetDate(targetDateController.start_date);
        }
      } catch (error) {
        console.error('Error fetching EventStartDate controller:', error);
      }
    };

    loadTargetDate();
  }, []);

  return (
    <Card>
      <WelcomingEventPage
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
      />
      <CountdownClock targetDate={targetDate} />
    </Card>
  );
};

Banner.propTypes = {
  setSnackbarOpen: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  setSnackbarSeverity: PropTypes.func.isRequired,
};

export default Banner;
