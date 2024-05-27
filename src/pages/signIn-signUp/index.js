import React from 'react';
import {Grid} from '@mui/material';

import Registration from 'examples/registration';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import AnimatedItem from 'utils/animatedItem';
import Footer from 'examples/footer';

function RegistrationPage() {
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
      <AnimatedItem>
        <Registration />
      </AnimatedItem>
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
    </Grid>
  );
}

export default RegistrationPage;
