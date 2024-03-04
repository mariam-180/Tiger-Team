import React from 'react';
import {Grid} from '@mui/material';

import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Banner from 'examples/bannerContainer';
import Contant from 'examples/eventContant';
import Footer from 'examples/footer';

function Champion() {
  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundImage: ({
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
      <Banner />
      <Contant></Contant>
      <Footer></Footer>
    </Grid>
  );
}

export default Champion;
