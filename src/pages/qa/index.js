/* eslint-disable react/no-unescaped-entities */
/* eslint-disable new-cap */
import React from 'react';
import {useTheme} from '@mui/material';

import {Grid, Box} from '@mui/material';

import NavBar from 'examples/navbars/DefaultNavbar';
import DatePicker from 'examples/dateTimePicker';
import Footer from 'examples/footer';

import {ScrollContainer} from 'react-scroll-motion';
import AnimatedSection from 'utils/animatedSection';

import backGround from 'assets/images/tigers_ai/tigersTeamCar_8.webp';
// import BeatLoaderUtil from 'utils/beatLoader';


function QA() {
  const theme = useTheme();

  const boxStyles = {
    'position': 'relative',
    'minHeight': '100vh',
    'padding': theme.spacing(2),
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `url(${backGround}) no-repeat center center fixed`,
      backgroundSize: 'cover',
      filter: 'blur(8px) brightness(20%)',
    },
  };

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
      <NavBar />
      {/* <BeatLoaderUtil backGround={backGround}/> */}
      <ScrollContainer>
        <AnimatedSection animation="zoomInScrollOut">
          <Box sx={boxStyles}>
            <DatePicker />
          </Box>
        </AnimatedSection>
        <AnimatedSection animation="fadeInFromLeft">
          <Box sx={boxStyles}>
            <DatePicker />
          </Box>
        </AnimatedSection>
        <AnimatedSection animation="fadeInFromLeft">
          <Box sx={boxStyles}>
            <DatePicker />
          </Box>
        </AnimatedSection>
        <AnimatedSection animation="fadeInFromRight">
          <Box sx={boxStyles}>
            <DatePicker />
          </Box>
        </AnimatedSection>
        <AnimatedSection animation="fadeOut">
          <Box sx={boxStyles}>
            <DatePicker />
          </Box>
        </AnimatedSection>
        <AnimatedSection animation="spin">
          <Box sx={boxStyles}>
            <DatePicker />
          </Box>
        </AnimatedSection>
      </ScrollContainer>
      <Box sx={{height: '50vh'}} />
      <Footer />
    </Grid>
  );
}

export default QA;
