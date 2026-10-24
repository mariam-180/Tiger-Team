import React, { useState, useEffect } from 'react';
import { Grid, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

import stageImage from 'assets/images/backGround/HighWayRoad.webp';

import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Banner from 'examples/bannerContainer';
import Content from 'examples/eventContant';
import Footer from 'examples/footer';
import ComingSoon from 'pages/comingSoon';

import { fetchControllers, getControllerByName } from 'utils/controllers';

const Stage = styled('main')(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
  gap: theme.spacing(3),
  boxSizing: 'border-box',
  width: '100%',
  height: '100vh',
  '@supports (height: 100dvh)': {
    height: '100dvh',
  },
  overflow: 'hidden',
  padding: theme.spacing(15, 6, 4),
  backgroundColor: '#000000',
  backgroundImage: `url(${stageImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'minmax(0, 1fr)',
    height: 'auto',
    minHeight: '100dvh',
    overflow: 'visible',
    gap: theme.spacing(2),
    padding: theme.spacing(13, 3, 4),
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1.5),
    padding: theme.spacing(12, 1.5, 3),
  },
}));

function Champion() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [eventClosed, setEventClosed] = useState(false);

  useEffect(() => {
    const loadEventClosed = async () => {
      try {
        const controllers = await fetchControllers();
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
  }, []);

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
          <Stage>
            <Banner
              setSnackbarOpen={setSnackbarOpen}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarSeverity={setSnackbarSeverity}
            />
            <Content />
          </Stage>
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
          <Footer />
        </>
      )}
    </Grid>
  );
}

export default Champion;
