import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// eslint-disable-next-line max-len
import championshipPreviewImage from 'assets/images/backGround/championship.webp';

import ComingSoon from 'pages/comingSoon/signboard';

import AnimatedTypingText from 'utils/Typing';
import { fetchControllers, getControllerByName } from 'utils/controllers';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HOVER_QUERY = '@media (hover: hover)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';
const CLOCK_TICK_MS = 1000;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const drift = keyframes`
  from { transform: scale(1.05) translateX(0); }
  to { transform: scale(1.15) translateX(-2%); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
`;

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.2; }
`;

const slideLine = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
`;

const raceBy = keyframes`
  from { background-position: 0 50%; }
  to { background-position: 360px 50%; }
`;

const enterAnimation = (delay) => `${fadeUp} 0.9s ${EASING} ${delay}s both`;

const PreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  minHeight: '100vh',
  '@supports (height: 100dvh)': {
    minHeight: '100dvh',
  },
  padding: theme.spacing(12, 6),
  color: '#ffffff',
  backgroundColor: '#000000',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(10, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(9, 2),
  },
}));

const BackgroundImage = styled(Box)({
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${championshipPreviewImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'grayscale(0.6) brightness(0.55)',
  animation: `${drift} 24s ease-in-out infinite alternate`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
});

const Vignette = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: `
    radial-gradient(ellipse at center, transparent 20%,
      rgba(0, 0, 0, 0.85) 100%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%,
      transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8) 100%)
  `,
});

const CheckeredStrip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 2,
  height: '18px',
  opacity: 0.55,
  background:
    'repeating-conic-gradient(#ffffff 0% 25%, #000000 0% 50%) 50% / 36px 36px',
  animation: `${raceBy} 6s linear infinite`,
  [theme.breakpoints.down('sm')]: {
    height: '12px',
    backgroundSize: '24px 24px',
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Content = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '1100px',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(3),
  },
}));

const TitleSlot = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: 'calc(2 * 1.05 * clamp(2rem, 7.5vw, 5.5rem))',
});

const ScoreBoard = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '900px',
  overflow: 'hidden',
  background: 'rgba(0, 0, 0, 0.55)',
  borderTop: '1px solid rgba(255, 255, 255, 0.35)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.35)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  animation: enterAnimation(0.5),
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
    animation: `${slideLine} 3.5s linear infinite`,
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    maxWidth: '420px',
  },
  [REDUCED_MOTION_QUERY]: {
    '&::after': {
      animation: 'none',
    },
  },
}));

const BoardCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '1 1 0',
  minWidth: 0,
  padding: theme.spacing(2.5, 2),
  '&:not(:last-of-type)': {
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: '0 0 auto',
    padding: theme.spacing(1.25, 2.5),
    '&:not(:last-of-type)': {
      borderRight: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    },
  },
}));

const CellLabel = styled(Typography)({
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.55)',
});

const CellValue = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.2rem, 3.2vw, 2.2rem)',
  fontWeight: 800,
  lineHeight: 1.15,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.2rem',
  },
}));

const LiveDot = styled('span')({
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: '#ff0000',
  animation: `${pulse} 1.6s ease-out infinite`,
});

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.4, 5),
  color: '#ffffff',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#d40000',
  borderRadius: '999px',
  boxShadow: '0 8px 24px rgba(212, 0, 0, 0.35)',
  animation: enterAnimation(0.8),
  transition: `background-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.3s ${EASING}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.2, 3.5),
    fontSize: '0.95rem',
  },
  [HOVER_QUERY]: {
    '&:hover': {
      backgroundColor: '#ff1a1a',
      boxShadow: '0 12px 30px rgba(255, 26, 26, 0.45)',
      transform: 'translateY(-2px)',
    },
  },
}));

const LiveClock = () => {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timerId = setInterval(() => setNow(dayjs()), CLOCK_TICK_MS);

    return () => clearInterval(timerId);
  }, []);

  return (
    <ScoreBoard>
      <BoardCell>
        <CellLabel>Day</CellLabel>
        <CellValue>{now.format('dddd')}</CellValue>
      </BoardCell>
      <BoardCell>
        <CellLabel>Date</CellLabel>
        <CellValue>{now.format('DD MMM YYYY')}</CellValue>
      </BoardCell>
      <BoardCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LiveDot />
          <CellLabel>Live</CellLabel>
        </Box>
        <CellValue>
          {now.format('HH')}
          <Box
            component="span"
            sx={{ animation: `${blink} 1s step-end infinite` }}
          >
            :
          </Box>
          {now.format('mm')}
          <Box
            component="span"
            sx={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.6em' }}
          >
            {` ${now.format('ss')}`}
          </Box>
        </CellValue>
      </BoardCell>
    </ScoreBoard>
  );
};

const ChampionshipPreview = () => {
  const navigate = useNavigate();

  const [eventClosed, setEventClosed] = useState(false);

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
  useEffect(() => {
    loadEventClosed();
  }, []);
  useBackgroundRefresh(loadEventClosed);

  const handleNavigate = () => {
    navigate('/championship');
  };

  return (
    <PreviewContainer>
      <BackgroundImage />
      <Vignette />
      <CheckeredStrip />
      {eventClosed && <ComingSoon />}
      {!eventClosed && (
        <Content>
          <TitleSlot>
            <AnimatedTypingText
              sx={{
                fontSize: 'clamp(2rem, 7.5vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                color: '#ffffff',
                zIndex: 1,
              }}
              strings={['Get Ready for the Big Race!']}
              backSpeed={25}
              smartBackspace={true}
              styled={true}
            />
          </TitleSlot>
          <Typography
            sx={{
              maxWidth: '640px',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: { xs: 1.7, md: 1.8 },
              color: 'rgba(255, 255, 255, 0.8)',
              animation: enterAnimation(0.3),
            }}
          >
            Get set for an amazing car race event! It&apos;s a fun day where
            drivers show off their amazing driving skills in exciting races.
            It&apos;s perfect for anyone who loves cars and racing. Don&apos;t
            miss it!
          </Typography>
          <LiveClock />
          <StyledButton variant="contained" onClick={handleNavigate}>
            Discover More
          </StyledButton>
        </Content>
      )}
    </PreviewContainer>
  );
};

export default ChampionshipPreview;
