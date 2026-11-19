import React from 'react';
import { Grid } from '@mui/material';

import VideoBackgroundContainer from 'components/ThisBGVideo';
import ParentContainer from 'components/ThisContainer/filtered';

import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';

import AnimatedItem from 'utils/animatedItem';

import formulaVideo from 'assets/images/backGround/formula.png';

import ComingSoonBoard from './signboard';

function ComingSoon() {
  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundimage: ({
          functions: { linearGradient, rgba },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.dark.main, 0.01),
            rgba(gradients.dark.state, 0.01),
          )}`,
        overflow: 'hidden',
      }}
    >
      <DefaultNavbar />
      <VideoBackgroundContainer videoURL={formulaVideo}>
        <AnimatedItem>
          <ParentContainer
            backgroundImage=""
            sx={{
              background: 'transparent',
              backdropFilter: 'blur(2px) brightness(20%)',
              width: '100vw',
            }}
          >
            <ComingSoonBoard />
          </ParentContainer>
        </AnimatedItem>
      </VideoBackgroundContainer>
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
    </Grid>
  );
}

export default ComingSoon;
