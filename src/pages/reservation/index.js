import React from 'react';

// @mui material components
import Grid from '@mui/material/Grid';

// Reservations page sections
import Reservation from './sections';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';

// Images
import bgImage from 'assets/images/tigers_ai/tigersTeamCar.webp';

function Reservations() {
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
      <Grid
        minHeight="45vh"
        width="100%"
        sx={{
          backgroundImage: ({
            functions: {linearGradient, rgba},
            palette: {gradients},
          }) =>
            `${linearGradient(
                rgba(gradients.dark.main, 0.6),
                rgba(gradients.dark.state, 0.6),
            )}, url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'grid',
          placeItems: 'center',
          backgroundAttachment: 'local',
        }}
      ></Grid>
      <Reservation />
      <Footer />
    </Grid>
  );
}

export default Reservations;
