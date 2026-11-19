import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from 'authContext';
import { isStaffRole } from 'utils/accountRoles.mjs';
import RacingPage, {
  buttonSx,
  kickerSx,
  panelSx,
} from 'examples/design/RacingUI';
import LoadingScreen from 'components/LoadingScreen';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function LivePlayer({ hlsUrl, onError }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Video.js owns and removes this element on dispose. Create a fresh node
    // on each mount so React StrictMode can safely mount the player again.
    const element = document.createElement('video-js');
    element.classList.add('vjs-big-play-centered');
    containerRef.current.appendChild(element);
    const player = videojs(element, {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      playsInline: true,
      muted: true,
      sources: [{ src: hlsUrl, type: 'application/x-mpegURL' }],
    });
    player.on('error', () =>
      onError('Live playback was interrupted. Reconnecting...'),
    );
    return () => {
      if (!player.isDisposed()) player.dispose();
    };
  }, [hlsUrl, onError]);

  return <div data-vjs-player ref={containerRef} style={{ width: '100%' }} />;
}

LivePlayer.propTypes = {
  hlsUrl: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
};

function Live() {
  const { userRole } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [streamAvailable, setStreamAvailable] = useState(false);
  const [streamChecked, setStreamChecked] = useState(false);
  const [hlsUrl, setHlsUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    let timer;
    let controller;
    let timeout;

    const checkStream = async () => {
      controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 6000);
      try {
        const response = await fetch('/api/stream/status', {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Stream status unavailable');
        const data = await response.json();
        if (!cancelled) {
          const available =
            data.available === true &&
            typeof data.hls_url === 'string' &&
            Boolean(data.hls_url);
          setHlsUrl(available ? data.hls_url : '');
          setStreamAvailable(available);
          setErrorMessage('');
        }
      } catch {
        if (!cancelled) {
          setStreamAvailable(false);
          setErrorMessage('Unable to check the live stream. Retrying...');
        }
      } finally {
        clearTimeout(timeout);
        if (!cancelled) {
          setStreamChecked(true);
          // Schedule after completion to avoid overlapping requests.
          timer = setTimeout(checkStream, 5000);
        }
      }
    };

    checkStream();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(timeout);
      controller?.abort();
    };
  }, []);

  const status = !streamChecked
    ? 'Checking signal'
    : errorMessage
      ? 'Reconnecting'
      : streamAvailable
        ? 'Live now'
        : 'Off air';
  return (
    <RacingPage>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
        }}
      >
        <Box sx={{ maxWidth: 750 }}>
          <Typography sx={kickerSx}>Tigers Team / Live race room</Typography>
          <Typography
            component="h1"
            sx={{
              color: '#fff',
              fontSize: 'clamp(2.4rem,6vw,4.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
            }}
          >
            Front row.
            <br />
            <Box component="span" sx={{ color: '#ef8ba0' }}>
              Full throttle.
            </Box>
          </Typography>
          <Typography sx={{ color: '#aaaabd', mt: 2, lineHeight: 1.8 }}>
            Watch the action as it happens. The player connects automatically
            when a broadcast goes live.
          </Typography>
        </Box>
        <Box
          role="status"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: '1px solid #3f3445',
            borderRadius: '100px',
            px: 2,
            py: 1,
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 7,
              height: 7,
              bgcolor: streamAvailable && !errorMessage ? '#ed3154' : '#88889c',
              borderRadius: '50%',
            }}
          />
          <Typography
            sx={{ color: '#d4d4e1', fontSize: '0.75rem', fontWeight: 700 }}
          >
            {status}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          ...panelSx,
          overflow: 'hidden',
          boxShadow: '0 30px 90px rgba(0,0,0,0.4)',
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            borderBottom: '1px solid #34343f',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography
            sx={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}
          >
            The Tigers broadcast
          </Typography>
          <Typography sx={{ color: '#9292a9', fontSize: '0.7rem' }}>
            Live from the racing floor
          </Typography>
        </Box>
        {!streamChecked ? (
          <LoadingScreen fullScreen={false} label="Finding the live signal" />
        ) : streamAvailable && !errorMessage ? (
          <Box
            sx={{
              aspectRatio: '16 / 9',
              bgcolor: '#000',
              '& .video-js': { width: '100%', height: '100%' },
            }}
          >
            <LivePlayer hlsUrl={hlsUrl} onError={setErrorMessage} />
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: { xs: 300, md: 420 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              px: 3,
              py: 5,
              background:
                'radial-gradient(ellipse at center, rgba(129,24,54,0.17), transparent 70%)',
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                height: 56,
                mb: 3,
              }}
            >
              {[18, 32, 48, 36, 22, 42, 56, 28, 16].map((height, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 4,
                    height,
                    bgcolor: index === 6 ? '#ef3154' : '#49303f',
                    borderRadius: 2,
                  }}
                />
              ))}
            </Box>
            <Typography
              component="h2"
              sx={{
                color: '#fff',
                fontWeight: 900,
                fontSize: 'clamp(1.8rem,4vw,3rem)',
                mb: 1,
              }}
            >
              {errorMessage
                ? 'Finding our way back.'
                : 'Quiet before the race.'}
            </Typography>
            <Typography
              sx={{
                color: '#aaaabd',
                maxWidth: 460,
                lineHeight: 1.8,
                fontSize: '0.9rem',
              }}
            >
              {errorMessage ||
                'There is no live broadcast right now. Stay on this page and the stream will appear automatically when it starts.'}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderTop: '1px solid #34343f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography sx={{ color: '#aaaabd', fontSize: '0.8rem' }}>
            Race coverage, updates and broadcast information.
          </Typography>
          <Button
            component={Link}
            to={isStaffRole(userRole) ? '/admin/streaming' : '/championship'}
            sx={buttonSx}
          >
            {isStaffRole(userRole)
              ? 'Broadcast setup'
              : 'Explore the championship'}
          </Button>
        </Box>
      </Box>
    </RacingPage>
  );
}

export default Live;
