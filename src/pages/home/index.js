import React from 'react';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import highWay from 'assets/images/backGround/HighWayRoad.webp';
import StyledContainer from 'components/ThisContainer';
import VideoSlider from 'components/ThisSlider/video';
import ChampionshipPreview from 'examples/championshipPreview';
import ImageSlider from 'components/ThisSlider/image';

import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import TextScrolling from 'examples/scrolling';
import Footer from 'examples/footer';
import CsMovingWrap from 'examples/movingWrap';
import AnimatedItem from 'utils/animatedItem';

import darkBG from 'assets/images/backGround/FocusSpotLight.avif';
import CarBG1 from 'assets/images/tigers_ai/tigersTeamCar_4.webp';
import CarBG2 from 'assets/images/tigers_ai/tigersTeamCar_2.webp';
import CarBG3 from 'assets/images/tigers_ai/tigersTeamCar_3.webp';
// import Header from 'views/Intro';

function Home() {
  const navigate = useNavigate();

  const texts = ['Drifting', 'Racing', 'Boost', 'Drifting', 'Racing', 'Boost'];
  const customMap = (text) => `${text}`;

  const images = [
    {
      url: CarBG1,
      title: 'Master the Drift',
      description: (
        <>
          Experience the ultimate drifting simulation with our state-of-the-art
          game.
          <br />
          Sharpen your skills and dominate the leaderboards!
        </>
      ),
      button: 'Book your place',
      onClick: () => {
        navigate('/reservations');
      },
    },
    {
      url: CarBG2,
      title: 'Join the Drift Community',
      description: (
        <>
          Book a PC and join the action.
          <br />
          New here? Sign up now to join our community!
        </>
      ),
      button: 'Join Now',
      onClick: () => {
        navigate('/registration');
      },
    },
    {
      url: CarBG3,
      title: 'Special Drift Event',
      description: `
        Don't miss our upcoming drift event!
        Compete with the best and win exciting prizes. 
        Register now and show off your drifting prowess!
      `,
      button: 'Register for Event',
      onClick: () => {
        navigate('/championship');
      },
    },
  ];

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
      {/* <Header/> */}
      <AnimatedItem>
        <ImageSlider images={images} />
      </AnimatedItem>
      <AnimatedItem>
        <CsMovingWrap texts={texts} map={customMap} backgroundimage={darkBG} />
      </AnimatedItem>
      <AnimatedItem>
        <ChampionshipPreview />
      </AnimatedItem>
      <AnimatedItem>
        <StyledContainer
          background={highWay}
          sx={{
            textAlign: 'end',
          }}
        >
          <TextScrolling />
        </StyledContainer>
      </AnimatedItem>
      <VideoSlider />
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
    </Grid>
  );
}

export default Home;
