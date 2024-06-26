import React, { useState } from 'react';
import { Grid, Snackbar, Alert } from '@mui/material';

import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Banner from 'examples/bannerContainer';
import Content from 'examples/eventContant';
import Footer from 'examples/footer';
import ComingSoon from 'pages/comingSoon';

function Champion() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [eventClosed] = useState(false);

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundImage: ({
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
      {eventClosed ? (
        <ComingSoon />
      ) : (
        <>
          <Banner
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            sx={{
              '& .MuiSnackbar-root': {
                bottom: 0,
                left: 0,
                right: 0,
              },
              '& .MuiPaper-root': {
                width: '100%',
                maxWidth: '100%',
              },
            }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Content />
          <Footer />
        </>
      )}
    </Grid>
  );
}

export default Champion;
