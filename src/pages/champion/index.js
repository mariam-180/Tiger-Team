import React, { useState, useEffect } from 'react';
import { Grid, Snackbar, Alert } from '@mui/material';

import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Banner from 'examples/bannerContainer';
import Content from 'examples/eventContant';
import Footer from 'examples/footer';
import ComingSoon from 'pages/comingSoon';

import { fetchControllers, getControllerByName } from 'utils/controllers';
import { useAuth } from 'authContext';

function Champion() {
  const { accessToken } = useAuth();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [eventClosed, setEventClosed] = useState(false);

  useEffect(() => {
    const loadEventClosed = async () => {
      try {
        const controllers = await fetchControllers(accessToken);
        const eventClosedController = getControllerByName(
          controllers,
          'EventComingSoon',
        );
        if (eventClosedController && eventClosedController.value === 'true') {
          setEventClosed(true);
        } else {
          setEventClosed(false);
        }
      } catch (error) {
        console.error('Error fetching EventClosed controller:', error);
      }
    };

    loadEventClosed();
  }, [accessToken]);

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
