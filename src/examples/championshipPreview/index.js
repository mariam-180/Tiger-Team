import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line max-len
import championshipPreviewImage from 'assets/images/backGround/championship.webp';
import logoIMG from 'assets/images/logos/logo.png';

import ComingSoon from 'pages/comingSoon/signboard';

import AnimatedTypingText from 'utils/Typing';
import { fetchControllers, getControllerByName } from 'utils/controllers';
import { useAuth } from 'authContext';

const PreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: `url(${championshipPreviewImage}) no-repeat center center`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  color: '#FFFFFF',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    backgroundAttachment: 'scroll',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.6)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: theme.spacing(20),
    height: theme.spacing(20),
    backgroundImage: `url(${logoIMG})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 1,
  },
  '& .items-container': {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    '&::after': {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  },
  [theme.breakpoints.up('lg')]: {
    '&::after': {
      width: theme.spacing(30),
      height: theme.spacing(30),
    },
  },
  [theme.breakpoints.up('xl')]: {
    '&::after': {
      width: theme.spacing(40),
      height: theme.spacing(40),
    },
  },
  [theme.breakpoints.down('sm')]: {
    backgroundAttachment: 'scroll',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #000000 30%, #FF0000 90%)',
  color: '#ffffff',
  padding: theme.spacing(1.5, 4),
  margin: theme.spacing(3),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  borderRadius: '25px',
  transition: 'background 0.5s ease, box-shadow 0.5s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #333333 30%, #666666 90%)',
    boxShadow: '0 5px 7px 2px rgba(255, 105, 135, .4)',
  },
}));

const ChampionshipPreview = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [eventClosed, setEventClosed] = useState(false);

  useEffect(() => {
    const loadEventClosed = async () => {
      try {
        const controllers = await fetchControllers(accessToken);
        const eventClosedController = getControllerByName(
          controllers,
          'EventComingSoon',
        );
        if (eventClosedController && eventClosedController.value === 'true') {
          setEventClosed(true);
        } else {
          setEventClosed(false);
        }
      } catch (error) {
        console.error('Error fetching EventClosed controller:', error);
      }
    };

    loadEventClosed();
  }, [accessToken]);

  const handleNavigate = () => {
    navigate('/championship');
  };

  return (
    <PreviewContainer>
      {eventClosed && <ComingSoon />}
      {!eventClosed && (
        <>
          <AnimatedTypingText
            sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              zIndex: 1,
            }}
            strings={['Get Ready for the Big Race!']}
            backSpeed={25}
            smartBackspace={true}
            styled={true}
          />
          <Typography
            color="#ffffff"
            variant="h4"
            sx={{
              mt: 2,
              mb: 2,
              maxWidth: '600px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            Get set for an amazing car race event on July 20th, 2024! It&apos;s
            a fun day where drivers show off their amazing driving skills in
            exciting races. It&apos;s perfect for anyone who loves cars and
            racing. Don&apos;t miss it!
          </Typography>
          <StyledButton
            variant="contained"
            size="large"
            onClick={handleNavigate}
          >
            Discover More
          </StyledButton>
        </>
      )}
    </PreviewContainer>
  );
};

export default ChampionshipPreview;
