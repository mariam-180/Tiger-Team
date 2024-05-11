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
    <>
      <Grid>
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
            display: 'grid',
            placeItems: 'center',
          }}
        ></Grid>
        <Reservation />
        <Footer />
      </Grid>
    </>
  );
}

export default Reservations;
