import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import racingImage from 'assets/images/backGround/racing.jpeg';
import driftingImage from 'assets/images/tigers_ai/tigersTeamCar_3.webp';
import formulaImage from 'assets/images/backGround/formula.png';
import rallyImage from 'assets/images/backGround/rally.jpeg';

import ResponsiveVideo from 'components/ThisVideo';

import { Box, Button, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ViewCarouselRoundedIcon from '@mui/icons-material/ViewCarouselRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HOVER_QUERY = '@media (hover: hover)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';
const DRAWER_SPACE = '190px';

const videos = [
  {
    title: 'GT racing',
    intro: 'Precision circuit racing built on grip, braking and consistency.',
    url: racingImage,
    thumbnail: racingImage,
  },
  {
    title: 'Drifting',
    intro: 'Controlled slides where style and car control decide the score.',
    url: driftingImage,
    thumbnail: driftingImage,
  },
  {
    title: 'Formula',
    intro: 'Open-wheel speed demanding sharp reflexes and clean racing lines.',
    url: formulaImage,
    thumbnail: formulaImage,
  },
  {
    title: 'Rally',
    intro:
      'Fast stage racing across changing surfaces and unpredictable terrain.',
    url: rallyImage,
    thumbnail: rallyImage,
  },
];

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const zoomIn = keyframes`
  from { opacity: 0; transform: scale(1.06); }
  to { opacity: 1; transform: scale(1); }
`;

const enterAnimation = (delay) => `${fadeUp} 0.9s ${EASING} ${delay}s both`;

const Section = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '5fr 7fr',
  width: '100%',
  height: '100vh',
  '@supports (height: 100dvh)': {
    height: '100dvh',
  },
  overflow: 'hidden',
  backgroundColor: '#000000',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '44% 56%',
  },
}));

const Media = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gridColumn: 2,
  overflow: 'hidden',
  clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)',
  transition: 'filter 0.8s ease',
  [theme.breakpoints.down('md')]: {
    gridColumn: 1,
    gridRow: 1,
    clipPath: 'none',
  },
}));

const Backdrop = styled(Box)({
  position: 'absolute',
  inset: '-40px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(34px) brightness(0.5) saturate(1.2)',
  animation: `${zoomIn} 1s ${EASING} both`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
});

const Frame = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: 'min(78%, calc(62dvh * 16 / 9))',
  marginLeft: '8%',
  overflow: 'hidden',
  borderRadius: '16px',
  boxShadow: '0 40px 90px rgba(0, 0, 0, 0.7)',
  backgroundColor: '#000000',
  '& img': {
    filter: 'contrast(1.06) saturate(1.12)',
    animation: `${zoomIn} 0.9s ${EASING} both`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background:
      'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.14) 0 1px, transparent 1px 3px)',
  },
  [theme.breakpoints.down('md')]: {
    width: 'min(88%, calc(32dvh * 16 / 9))',
    marginLeft: 0,
  },
  [REDUCED_MOTION_QUERY]: {
    '& img': {
      animation: 'none',
    },
  },
}));

const Info = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gridColumn: 1,
  gridRow: 1,
  boxSizing: 'border-box',
  padding: theme.spacing(10, 4, 4, 8),
  color: '#ffffff',
  transition: 'padding-bottom 0.6s ease',
  [theme.breakpoints.down('lg')]: {
    paddingLeft: theme.spacing(4),
  },
  [theme.breakpoints.down('md')]: {
    gridRow: 2,
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 3, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2, 2),
  },
}));

const Eyebrow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1),
  animation: enterAnimation(0.1),
  '&::before': {
    content: '""',
    width: '40px',
    height: '1px',
    backgroundColor: '#ffffff',
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const GhostIndex = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(4rem, 12vw, 10rem)',
  fontWeight: 900,
  lineHeight: 0.85,
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.5)',
  animation: enterAnimation(0.15),
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: 'clamp(2rem, 5.2vw, 4.6rem)',
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: '-0.02em',
  textTransform: 'uppercase',
  animation: enterAnimation(0.25),
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const TitleLine = styled(Box)(({ theme }) => ({
  width: '84px',
  height: '4px',
  margin: theme.spacing(2, 0),
  borderRadius: '2px',
  backgroundColor: '#d40000',
  transformOrigin: 'left',
  animation: `${growLine} 1s ${EASING} 0.4s both`,
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1.25, 0),
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Intro = styled(Typography)(({ theme }) => ({
  maxWidth: '380px',
  fontSize: '1.05rem',
  lineHeight: 1.7,
  color: 'rgba(255, 255, 255, 0.82)',
  animation: enterAnimation(0.5),
  [theme.breakpoints.down('md')]: {
    maxWidth: '520px',
    fontSize: '0.95rem',
    lineHeight: 1.55,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.88rem',
    lineHeight: 1.5,
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const RingToggle = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(11),
  right: theme.spacing(4),
  zIndex: 6,
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2.5),
  minHeight: '44px',
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '999px',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  transition: `background-color 0.3s ease, border-color 0.3s ease,
    transform 0.3s ${EASING}`,
  '&&, &&:hover, &&:focus, &&:active': {
    color: '#ffffff',
  },
  '&& .MuiSvgIcon-root, && .toggle-label': {
    color: '#ffffff',
  },
  [theme.breakpoints.down('sm')]: {
    top: theme.spacing(9),
    right: theme.spacing(2),
    padding: theme.spacing(1, 1.5),
    '& .toggle-label': {
      display: 'none',
    },
  },
  [HOVER_QUERY]: {
    '&:hover': {
      backgroundColor: '#d40000',
      borderColor: '#d40000',
      transform: 'translateY(-2px)',
    },
  },
}));

const Drawer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 5,
  boxSizing: 'border-box',
  padding: theme.spacing(6, 0, 2.5),
  background:
    'linear-gradient(to top, rgba(0, 0, 0, 0.92) 55%, transparent 100%)',
}));

const Rail = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(0, 8),
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 3),
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1.5),
    padding: theme.spacing(0, 2),
  },
}));

const TrackCard = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'image',
})(({ theme, active, image }) => ({
  position: 'relative',
  display: 'flex',
  flex: '0 0 auto',
  alignItems: 'flex-end',
  width: '190px',
  height: '112px',
  padding: theme.spacing(1.5),
  overflow: 'hidden',
  scrollSnapAlign: 'start',
  textAlign: 'left',
  cursor: 'pointer',
  color: '#ffffff',
  backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 70%), url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: `2px solid ${active ? '#d40000' : 'rgba(255, 255, 255, 0.25)'}`,
  borderRadius: '10px',
  transition: `transform 0.5s ${EASING}, border-color 0.3s ease`,
  [theme.breakpoints.down('sm')]: {
    width: '140px',
    height: '86px',
    padding: theme.spacing(1),
  },
  [HOVER_QUERY]: {
    '&:hover': {
      transform: 'translateY(-6px)',
      borderColor: '#ffffff',
    },
  },
  '&:focus-visible': {
    outline: '2px solid #ffffff',
    outlineOffset: '3px',
  },
}));

const CardLabel = styled('span')({
  fontSize: '0.8rem',
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
});

const VideoSlider = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showRing, setShowRing] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const ringRef = useRef();

  const updateVideo = (index) => {
    setCurrentVideo(index);
    setTransitionPhase('fadein');
    gsap.to(ringRef.current, {
      y: 100,
      opacity: 0,
      display: 'none',
      duration: 0.5,
    });
  };

  const handleRingSelect = (index) => {
    updateVideo(index);
    setShowRing(!showRing);
  };

  const toggleRingVisibility = () => {
    const newY = showRing ? 100 : 0;
    const newOpacity = showRing ? 0 : 1;
    gsap.to(ringRef.current, {
      y: newY,
      opacity: newOpacity,
      display: newOpacity ? 'block' : 'none',
      duration: 0.5,
    });
    setShowRing(!showRing);
  };

  useEffect(() => {
    if (transitionPhase === 'fadein') {
      setTimeout(() => setTransitionPhase('idle'), 500);
    }
  }, [transitionPhase]);

  const current = videos[currentVideo];
  const counter = `${String(currentVideo + 1).padStart(2, '0')} / ${String(
    videos.length,
  ).padStart(2, '0')}`;

  return (
    <Section>
      <Media
        sx={{
          filter: showRing
            ? 'blur(4px) brightness(35%)'
            : 'blur(0px) brightness(100%)',
        }}
      >
        <Backdrop
          key={`backdrop-${currentVideo}`}
          style={{ backgroundImage: `url(${current.url})` }}
        />
        <Frame>
          <ResponsiveVideo
            iscontrolled={true}
            ismuted={true}
            isslider={true}
            videoSrc={current.url}
          />
        </Frame>
      </Media>

      <Info sx={{ paddingBottom: showRing ? DRAWER_SPACE : undefined }}>
        <Eyebrow>
          <Typography
            variant="overline"
            sx={{ letterSpacing: '0.35em', color: 'rgba(255,255,255,0.85)' }}
          >
            {counter}
          </Typography>
        </Eyebrow>
        <GhostIndex key={`index-${currentVideo}`} component="div">
          {String(currentVideo + 1).padStart(2, '0')}
        </GhostIndex>
        <Title key={`title-${currentVideo}`} component="h2">
          {current.title}
        </Title>
        <TitleLine key={`line-${currentVideo}`} />
        <Intro key={`intro-${currentVideo}`}>{current.intro}</Intro>
      </Info>

      <RingToggle onClick={toggleRingVisibility} aria-label="Toggle track list">
        {showRing ? <CloseRoundedIcon /> : <ViewCarouselRoundedIcon />}
        <span className="toggle-label">Choose Track</span>
      </RingToggle>

      <Drawer ref={ringRef}>
        <Rail>
          {videos.map((video, index) => (
            <TrackCard
              key={video.title}
              type="button"
              active={index === currentVideo}
              image={video.thumbnail}
              aria-label={`Show ${video.title}`}
              onClick={() => handleRingSelect(index)}
            >
              <CardLabel>{video.title}</CardLabel>
            </TrackCard>
          ))}
        </Rail>
      </Drawer>
    </Section>
  );
};

export default VideoSlider;
