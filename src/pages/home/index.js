import React from 'react';
import {Grid} from '@mui/material';

import highWay from 'assets/images/backGround/HighWayRoad.webp';
import StyledContainer from 'components/ThisContainer';
import VideoSlider from 'components/ThisSlider/video';
import ChampionshipPreview from 'examples/championshipPreview';

import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import TextScrolling from 'examples/scrolling';
import Footer from 'examples/footer';

import Header from 'views/Intro';

function Home() {
  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundimage: ({
          functions: {linearGradient, rgba},
          palette: {gradients},
        }) =>
          `${linearGradient(
              rgba(gradients.dark.main, 0.01),
              rgba(gradients.dark.state, 0.01),
          )}`,
        overflow: 'hidden',
      }}
    >
      <DefaultNavbar />
      <Header/>
      <ChampionshipPreview />
      <StyledContainer
        background={highWay}
        sx={{
          textAlign: 'end',
        }}
      >
        <TextScrolling />
      </StyledContainer>
      <VideoSlider />
      <Footer />
    </Grid>
  );
}

export default Home;
