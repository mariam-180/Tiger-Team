import React, { useEffect, useState } from 'react';

import { styled, keyframes, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ControlRotate } from 'components/ThisInteractive/ControlRotate';
import { ControlTranslate } from 'components/ThisInteractive/ControlTranslate';
import { ScrollableArea } from 'components/ThisInteractive/ScrollableArea';
import AnimatedTypingText from 'utils/Typing';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HOVER_QUERY = '@media (hover: hover)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';
const DESKTOP_QUERY = '@media (min-width: 900px)';
const CONTAINER_PADDING = '64px';
const AUTO_SWITCH_MS = 4500;
const TITLE_FONT_SIZE = 'clamp(1.4rem, 5vw, 3.4rem)';
const TITLE_LINE_HEIGHT = 1.15;

const driftWord = keyframes`
  from { transform: translateX(-4%); }
  to { transform: translateX(4%); }
`;

const fadeSwap = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.6); }
  100% { box-shadow: 0 0 0 16px rgba(255, 0, 0, 0); }
`;

const Stage = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '100%',
  height: `calc(100vh - ${CONTAINER_PADDING})`,
  '@supports (height: 100dvh)': {
    height: `calc(100dvh - ${CONTAINER_PADDING})`,
  },
  overflow: 'hidden',
  padding: theme.spacing(4, 6),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 2),
  },
}));

const GhostWord = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  translate: '-50% -50%',
  zIndex: 0,
  fontSize: 'clamp(7rem, 30vw, 28rem)',
  fontWeight: 900,
  lineHeight: 0.8,
  letterSpacing: '-0.04em',
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.14)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  userSelect: 'none',
  animation: `${driftWord} 18s ease-in-out infinite alternate`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
});

const Content = styled('div')({
  position: 'relative',
  zIndex: 1,
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '1100px',
  textAlign: 'left',
  color: '#ffffff',
});

const TitleSlot = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: `calc(2 * ${TITLE_LINE_HEIGHT} * ${TITLE_FONT_SIZE})`,
  [DESKTOP_QUERY]: {
    minHeight: `calc(${TITLE_LINE_HEIGHT} * ${TITLE_FONT_SIZE})`,
  },
});

const TrackLayout = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.1fr 0.9fr',
  alignItems: 'center',
  gap: theme.spacing(6),
  marginTop: theme.spacing(5),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
}));

const TrackBox = styled('div')({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 10',
  maxHeight: '48vh',
  '& svg': {
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },
});

const Station = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  position: 'absolute',
  display: 'grid',
  placeItems: 'center',
  width: 'clamp(38px, 5vw, 54px)',
  height: 'clamp(38px, 5vw, 54px)',
  padding: 0,
  transform: 'translate(-50%, -50%)',
  fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
  fontWeight: 800,
  color: '#ffffff',
  cursor: 'pointer',
  backgroundColor: active ? '#d40000' : 'rgba(0, 0, 0, 0.55)',
  border: `2px solid ${active ? '#ff1a1a' : 'rgba(255, 255, 255, 0.6)'}`,
  borderRadius: '50%',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  transition: `background-color 0.4s ease, border-color 0.4s ease,
    transform 0.5s ${EASING}`,
  animation: active ? `${pulseRing} 1.6s ease-out infinite` : 'none',
  [HOVER_QUERY]: {
    '&:hover': {
      transform: 'translate(-50%, -50%) scale(1.12)',
    },
  },
  '&:focus-visible': {
    outline: '2px solid #ffffff',
    outlineOffset: '3px',
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Car = styled('div')({
  position: 'absolute',
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: '#ff1a1a',
  boxShadow: '0 0 18px 6px rgba(255, 26, 26, 0.7)',
  transform: 'translate(-50%, -50%)',
  transition: `left 1.4s ${EASING}, top 1.4s ${EASING}`,
  pointerEvents: 'none',
  [REDUCED_MOTION_QUERY]: {
    transition: 'none',
  },
});

const Detail = styled('div')(({ theme }) => ({
  textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)',
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
  },
}));

const DetailIndex = styled('div')({
  fontSize: 'clamp(3.5rem, 9vw, 7rem)',
  fontWeight: 900,
  lineHeight: 0.9,
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.6)',
  animation: `${fadeSwap} 0.7s ${EASING} both`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
});

const DetailText = styled('p')(({ theme }) => ({
  margin: theme.spacing(2, 0, 0),
  fontSize: 'clamp(0.9rem, 1.8vw, 1.25rem)',
  lineHeight: 1.65,
  color: 'rgba(255, 255, 255, 0.95)',
  animation: `${fadeSwap} 0.7s ${EASING} 0.1s both`,
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(1),
    lineHeight: 1.5,
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const motivationList = [
  'Gear Up for Glory',
  'Take the Wheel, Be Legendary',
  'Live the Thrill of the Race',
];

const paragraphs = [
  'Experience the thrill of drifting with Tigers Team! Our cutting-edge e-gaming and simulations bring the excitement right to you.',
  'Enjoy a top-notch drifting experience with our state-of-the-art technology and immersive environments.',
  'Come learn, play, and master the art of drifting with us and take your skills to new heights!',
];

const TRACK_PATH = 'M 20 150 C 120 20, 200 20, 260 90 S 380 180, 380 60';
const STATIONS = [
  { x: 20, y: 150 },
  { x: 260, y: 90 },
  { x: 380, y: 60 },
];
const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 200;

const toPercent = (value, total) => `${(value / total) * 100}%`;

export const ExampleScrollText = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const [activeStation, setActiveStation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return undefined;

    const timerId = setInterval(
      () => setActiveStation((current) => (current + 1) % paragraphs.length),
      AUTO_SWITCH_MS,
    );

    return () => clearInterval(timerId);
  }, [isPaused]);

  let scrollFromX;
  let scrollToX;

  if (isXs) {
    scrollFromX = 0;
    scrollToX = 0;
  } else if (isSm) {
    scrollFromX = 0;
    scrollToX = 0;
  } else if (isMd) {
    scrollFromX = 0;
    scrollToX = 0;
  } else if (isLg) {
    scrollFromX = 0;
    scrollToX = 0;
  }

  const car = STATIONS[activeStation];

  return (
    <ScrollableArea viewportHeight={0}>
      <Stage>
        <GhostWord aria-hidden="true">DRIFT</GhostWord>
        <ControlTranslate scrollFromX={scrollFromX} scrollToX={scrollToX}>
          <ControlRotate className="position-absolute" from={-1} to={0}>
            <Content>
              <TitleSlot>
                <AnimatedTypingText
                  strings={motivationList}
                  loop
                  smartBackspace
                  sx={{
                    display: 'block',
                    fontSize: TITLE_FONT_SIZE,
                    lineHeight: TITLE_LINE_HEIGHT,
                    fontWeight: 900,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    color: '#d40000',
                    textShadow: '0 2px 18px rgba(0, 0, 0, 0.8)',
                  }}
                />
              </TitleSlot>
              <TrackLayout
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <TrackBox>
                  <svg
                    viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d={TRACK_PATH}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    <path
                      d={TRACK_PATH}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.85)"
                      strokeWidth="2"
                      strokeDasharray="10 12"
                      strokeLinecap="round"
                    />
                  </svg>
                  <Car
                    style={{
                      left: toPercent(car.x, VIEW_WIDTH),
                      top: toPercent(car.y, VIEW_HEIGHT),
                    }}
                  />
                  {STATIONS.map((station, position) => (
                    <Station
                      key={`station-${station.x}`}
                      type="button"
                      active={position === activeStation}
                      aria-label={`Show highlight ${position + 1}`}
                      onClick={() => setActiveStation(position)}
                      style={{
                        left: toPercent(station.x, VIEW_WIDTH),
                        top: toPercent(station.y, VIEW_HEIGHT),
                      }}
                    >
                      {String(position + 1).padStart(2, '0')}
                    </Station>
                  ))}
                </TrackBox>
                <Detail aria-live="polite">
                  <DetailIndex key={`index-${activeStation}`}>
                    {String(activeStation + 1).padStart(2, '0')}
                  </DetailIndex>
                  <DetailText key={`text-${activeStation}`}>
                    {paragraphs[activeStation]}
                  </DetailText>
                </Detail>
              </TrackLayout>
            </Content>
          </ControlRotate>
        </ControlTranslate>
      </Stage>
    </ScrollableArea>
  );
};
