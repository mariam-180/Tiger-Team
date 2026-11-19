import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
// import RegistrationFormDialog from 'examples/formSubmit';
import ViaLogin from 'examples/formSubmit/viaLogin';

import {
  fetchControllers,
  performActionsBasedOnControllers,
} from 'utils/controllers';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HOVER_QUERY = '@media (hover: hover)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(3),
  color: '#ffffff',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
}));

const Eyebrow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '&::before': {
    content: '""',
    width: '40px',
    height: '1px',
    backgroundColor: '#ffffff',
    transformOrigin: 'left',
    animation: `${growLine} 1s ${EASING} 0.1s both`,
  },
  [REDUCED_MOTION_QUERY]: {
    '&::before': {
      animation: 'none',
    },
  },
}));

const Title = styled(Typography)({
  fontSize: 'clamp(2rem, min(4.6vw, 8.5vh), 4.6rem)',
  fontWeight: 900,
  lineHeight: 1.02,
  letterSpacing: '-0.02em',
  textTransform: 'uppercase',
  color: '#ffffff',
  textShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
});

const TitleLine = styled(Box)({
  width: '72px',
  height: '4px',
  borderRadius: '2px',
  backgroundColor: '#d40000',
  transformOrigin: 'left',
  animation: `${growLine} 1s ${EASING} 0.4s both`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
});

const StyledRegisterButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.3, 5),
  color: '#ffffff',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#d40000',
  borderRadius: '999px',
  boxShadow: '0 8px 24px rgba(212, 0, 0, 0.35)',
  transition: `background-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.3s ${EASING}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.1, 3.5),
    fontSize: '0.92rem',
  },
  [HOVER_QUERY]: {
    '&:hover': {
      backgroundColor: '#ff1a1a',
      boxShadow: '0 12px 30px rgba(255, 26, 26, 0.45)',
      transform: 'translateY(-2px)',
    },
  },
}));

const ClosedRegistrationMessage = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1.5, 2.5),
  fontFamily: '"Nunito", sans-serif',
  fontSize: 'clamp(0.88rem, 1.2vw, 1rem)',
  fontWeight: 700,
  lineHeight: 1.5,
  color: '#ffffff',
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderLeft: '4px solid #d40000',
  borderRadius: '12px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25, 2),
  },
}));

const WelcomingEventPage = ({
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
}) => {
  const [open, setOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const loadRegistrationStatus = async () => {
    try {
      const controllers = await fetchControllers();
      setIsRegistrationOpen(false);
      performActionsBasedOnControllers(controllers, (name, value) => {
        if (name === 'RegistrationOpen') {
          setIsRegistrationOpen(value);
        }
      });
    } catch (error) {
      console.error('Error fetching RegistrationOpen controller:', error);
    }
  };
  useEffect(() => {
    loadRegistrationStatus();
  }, []);
  useBackgroundRefresh(loadRegistrationStatus);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FlexContainer>
      <Eyebrow>
        <Typography
          variant="overline"
          sx={{ letterSpacing: '0.35em', color: 'rgba(255, 255, 255, 0.85)' }}
        >
          Championship
        </Typography>
      </Eyebrow>
      <Title variant="h1">Tigers Team Champion League</Title>
      <TitleLine />
      {isRegistrationOpen ? (
        <StyledRegisterButton
          variant="contained"
          size="large"
          onClick={handleClickOpen}
        >
          Register Now
        </StyledRegisterButton>
      ) : (
        <ClosedRegistrationMessage>
          Registration is now closed. See you at the event!
        </ClosedRegistrationMessage>
      )}
      {/* <RegistrationFormDialog
        open={open}
        handleClose={handleClose}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
      /> */}
      {open && <ViaLogin handleClose={handleClose} />}
    </FlexContainer>
  );
};

WelcomingEventPage.propTypes = {
  setSnackbarOpen: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  setSnackbarSeverity: PropTypes.func.isRequired,
};

export default WelcomingEventPage;
