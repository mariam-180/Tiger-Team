import React from 'react';
import {Grid} from '@mui/material';

// import NavBar from 'examples/navbars/DefaultNavbar';
import DatePicker from 'examples/dateTimePicker';

function QA() {
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
      {/* <NavBar /> */}
      <DatePicker />
    </Grid>
  );
}

export default QA;
