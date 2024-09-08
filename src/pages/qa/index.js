/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable new-cap */
import React from 'react';

import { Container, Grid, Typography } from '@mui/material';
import NavBar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';
import ScrollAnimation from 'utils/scrollAnimation';

import SnapScrollParent from 'components/ThisSnapScrollParent';
function QA() {
  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#000',
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
      <NavBar />
      <SnapScrollParent>
        <Container>
          <Typography variant="h1">Hero</Typography>
        </Container>
        <Container>
          <Typography variant="h1">Section 2</Typography>
        </Container>
        <Container>
          <Typography variant="h1">Section 3</Typography>
        </Container>
      </SnapScrollParent>
    </Grid>
  );
}

export default QA;
