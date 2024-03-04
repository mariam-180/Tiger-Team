import React from 'react';
import {styled} from '@mui/material/styles';

import formulaVideo from 'assets/videos/formula.mp4';

import VideoBackgroundContainer from 'components/ThisBGVideo';
import BackgroundContainer from 'components/ThisBackgroundContainer';

import CountdownClock from 'examples/countDown';
import WelcomingEventPage from 'examples/heroSection';

const CountdownContainerItem = styled('div')(({theme}) => ({
  position: 'absolute',
  top: 90,
  left: 0,
  padding: theme.spacing(2),
}));

const Banner = () => {
  return (
    <VideoBackgroundContainer videoURL={formulaVideo}>
      <BackgroundContainer
        secondbackground=""
        backgroundimage=""
        sx={{
          background: 'transparent',
          backdropFilter: 'blur(10px) brightness(50%)',
        }}
      >
        <CountdownContainerItem>
          <CountdownClock targetDate="2024-03-1" />
        </CountdownContainerItem>
        <WelcomingEventPage />
      </BackgroundContainer>
    </VideoBackgroundContainer>
  );
};

export default Banner;
