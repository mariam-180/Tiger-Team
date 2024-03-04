import React, {useEffect, useRef} from 'react';
import {Grid, Box} from '@mui/material';
import ParallaxBackground from 'examples/parallax';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function QA() {
  const playerRef = useRef(null);
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    playsInline: true, // Add this line
    muted: true,
    sources: [
      {
        src: 'https://206.189.55.191/hls/obs_stream.m3u8', // Update this URL to your HLS stream URL
        type: 'application/x-mpegURL',
      },
    ],
  };

  useEffect(() => {
    const player = playerRef.current ?
      videojs(playerRef.current, videoJsOptions, () => {}) :
      null;

    return () => {
      if (player) {
        player.dispose();
      }
    };
  });

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
      <ParallaxBackground />
      <Box width="100%" height="150vh" />
      <Box
        width="100%"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          '.video-js': {width: '100%', height: '100%'},
          'position': 'relative',
          'paddingTop': '56.25%', // 16:9 Aspect Ratio
          'zIndex': 200,
        }}
      >
        <div data-vjs-player>
          <video ref={playerRef} className="video-js vjs-big-play-centered" />
        </div>
      </Box>
    </Grid>
  );
}

export default QA;
