/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable new-cap */
import React from 'react';

import {Grid} from '@mui/material';

import NavBar from 'examples/navbars/DefaultNavbar';
import SnokardoRoom from 'examples/branches/snokardo';
import ParentContainer from 'components/ThisContainer/filtered';
import Footer from 'examples/footer';
import ComingSoon from './tem';

import background from 'assets/images/tigers_ai/tigersTeamCar_9.webp';

function QA() {
  const SnokardoPcs = [
    {id: 1, isavailable: 'true'},
    {id: 2, isavailable: 'false'},
    {id: 3, isavailable: 'true'},
    {id: 4, isavailable: 'true'},
    {id: 5, isavailable: 'false'},
    {id: 6, isavailable: 'true'},
    {id: 7, isavailable: 'true'},
  ];

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#fff',
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
      <ParentContainer backgroundImage={background} brightness={20}>
        <ComingSoon />
      </ParentContainer>
      <Footer />
    </Grid>
  );
}

export default QA;
