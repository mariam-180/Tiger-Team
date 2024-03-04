import React from 'react';
import {styled} from '@mui/material/styles';

import formulaVideo from 'assets/videos/formula.mp4';

import VideoBackgroundContainer from 'components/ThisBGVideo';
import secondBackground from 'assets/images/logos/logo.png';
import CountdownClock from 'examples/countDown';
import WelcomingEventPage from 'examples/heroSection';

const backgroundImage = '';
const StyledContainer = styled('div')(({theme}) => ({
  'position': 'relative',
  'minHeight': '100vh',
  'display': 'flex',
  'flexDirection': 'column',
  'justifyContent': 'center',
  'alignItems': 'center',
  'background': `url(${backgroundImage}) no-repeat center center fixed`,
  'overflow': 'hidden',
  'backgroundSize': 'cover',
  'backgroundPosition': 'center',
  'backgroundAttachment': 'fixed',
  'width': '100vw',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,
    backgroundAttachment: 'fixed',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: theme.spacing(20),
    height: theme.spacing(20),
    backgroundImage: `url(${secondBackground})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 1,
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
}));

const CountdownContainerItem = styled('div')(({theme}) => ({
  position: 'absolute',
  top: 90,
  left: 0,
  padding: theme.spacing(2),
}));

const Banner = () => {
  return (
    <VideoBackgroundContainer videoURL={formulaVideo}>
      <StyledContainer
        sx={{
          background: 'transparent',
          backdropFilter: 'blur(1px) brightness(50%)',
        }}
      >
        <CountdownContainerItem>
          <CountdownClock targetDate="2024-03-1" />
        </CountdownContainerItem>
        <WelcomingEventPage />
      </StyledContainer>
    </VideoBackgroundContainer>
  );
};

export default Banner;
