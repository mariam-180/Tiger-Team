import React, { useEffect, useRef, useState } from 'react';
import { Grid, Box } from '@mui/material';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';
import ParallaxBackground from 'examples/parallax';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function Live() {
  const playerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    playsInline: true,
    muted: true,
    sources: [
      {
        src: 'https://tigers-team.com/hls/low/OBS_Stream.m3u8',
        type: 'application/x-mpegURL',
      },
    ],
  };

  useEffect(() => {
    const player = playerRef.current
      ? videojs(playerRef.current, videoJsOptions, () => {})
      : null;

    if (player) {
      player.on('error', () => {
        const error = player.error();
        if (error && error.code === 4) {
          setErrorMessage('No live streaming at this moment');
        }
      });
    }

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [videoJsOptions]);

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
      <ParallaxBackground />
      <Box
        width="100%"
        sx={{
          height: {
            xs: '150vh',
            sm: '150vh',
            md: '100vh',
          },
        }}
      />
      <Box
        width="100%"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          '.video-js': { width: '100%', height: '100%' },
          position: 'relative',
          paddingTop: '56.25%',
          zIndex: 200,
        }}
      >
        {errorMessage ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="start"
            width="100%"
            height="50vh"
            color="#fff"
            fontSize="24px"
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="80%"
              height="20vh"
              color="rgba(0, 0, 0, 0.6)"
              fontSize="24px"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                padding: '20px',
                borderRadius: '40px',
                boxShadow: '0px 15px 50px rgba(180, 180, 180, 1.2)',
                textAlign: 'center',
                maxWidth: '550px',
              }}
            >
              {errorMessage}
            </Box>
          </Box>
        ) : (
          <div data-vjs-player>
            <video ref={playerRef} className="video-js vjs-big-play-centered" />
          </div>
        )}
      </Box>
      <Box width="100%" height="30vh" />
      <Footer />
    </Grid>
  );
}

export default Live;
