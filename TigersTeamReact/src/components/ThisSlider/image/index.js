import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useSpring, animated } from 'react-spring';
import { useSwipeable } from 'react-swipeable';
import ArrowBackIosIcon from '@mui/icons-material/KeyboardBackspaceTwoTone';
import ArrowForwardIosIcon from '@mui/icons-material/EastTwoTone';

import SocialMediaIcons from 'examples/socialMediaIcons';

const duration = 400;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const MOBILE_QUERY = '@media (max-width: 600px)';
const SHORT_SCREEN_QUERY = '@media (max-height: 700px)';
const TOUCH_QUERY = '@media (hover: none)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const REDUCED_MOTION_QUERY = `@media ${REDUCED_MOTION}`;
const CONTENT_PADDING_LEFT = { xs: 3, sm: 8, md: '14%', lg: '20%' };
const BAR_PADDING_RIGHT = { xs: 3, sm: 8, md: '8%', lg: '10%' };
const PARALLAX_STRENGTH = 24;
const SLIDE_INTERVAL_SECONDS = 8;

const slowZoom = keyframes`
  from { transform: scale(1.08); }
  to { transform: scale(1.2); }
`;

const revealUp = keyframes`
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const sweep = keyframes`
  from { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
  20% { opacity: 1; }
  to { transform: translateX(120vw) skewX(-20deg); opacity: 0; }
`;

const shimmer = keyframes`
  from { background-position: 0% 50%; }
  to { background-position: 200% 50%; }
`;

const scrollDrop = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const fillProgress = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const openTop = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
`;

const openBottom = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
`;

const enterAnimation = (delay) => `${fadeUp} 0.9s ${EASING} ${delay}s both`;

const Title = styled(Typography)({
  maxWidth: '760px',
  fontSize: 'clamp(2rem, min(6vw, 9vh), 5rem)',
  fontWeight: 800,
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
  textTransform: 'uppercase',
  color: '#ffffff',
  filter: 'drop-shadow(0 0 22px rgba(255, 0, 0, 0.4))',
});

const WordMask = styled('span')({
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'top',
  marginRight: '0.25em',
  paddingBottom: '0.08em',
});

const Word = styled('span')({
  display: 'inline-block',
  animation: `${revealUp} 0.9s ${EASING} both`,
  '&[data-accent="true"]': {
    background: 'linear-gradient(90deg, #ffffff 0%, #ff4d4d 50%, #ffffff 100%)',
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${revealUp} 0.9s ${EASING} both, ${shimmer} 4s linear infinite`,
  },
});

const GhostNumber = styled(Typography)({
  position: 'absolute',
  right: '6%',
  bottom: '4%',
  zIndex: 1,
  fontSize: 'clamp(8rem, 28vw, 26rem)',
  fontWeight: 900,
  lineHeight: 0.8,
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.12)',
  pointerEvents: 'none',
  userSelect: 'none',
  animation: `${fadeUp} 1.2s ${EASING} 0.3s both`,
  [MOBILE_QUERY]: {
    fontSize: '8rem',
    right: '4%',
    bottom: '12%',
  },
});

const LightSweep = styled(Box)({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 1,
  width: '30%',
  pointerEvents: 'none',
  background:
    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
  animation: `${sweep} 1.6s ease-out 0.2s both`,
});

const Spotlight = styled(Box)({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background:
    'radial-gradient(circle 160px at var(--x, 70%) var(--y, 40%), rgba(255, 0, 0, 0.28), transparent 70%)',
  [TOUCH_QUERY]: {
    display: 'none',
  },
});

const CurtainPanel = styled(Box)({
  position: 'absolute',
  left: 0,
  zIndex: 20,
  width: '100%',
  height: '50.5%',
  backgroundColor: '#000000',
  pointerEvents: 'none',
  '&[data-side="top"]': {
    top: 0,
    animation: `${openTop} 1.3s ${EASING} 0.2s both`,
  },
  '&[data-side="bottom"]': {
    bottom: 0,
    animation: `${openBottom} 1.3s ${EASING} 0.2s both`,
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.4, 4),
  color: '#ffffff',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#d40000',
  borderRadius: '999px',
  boxShadow: '0 8px 24px rgba(212, 0, 0, 0.35)',
  transition: `background-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.3s ${EASING}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.2, 3),
    fontSize: '0.95rem',
  },
  '& .MuiButton-endIcon': {
    transition: `transform 0.3s ${EASING}`,
  },
  '&:hover': {
    backgroundColor: '#ff1a1a',
    boxShadow: '0 12px 30px rgba(255, 26, 26, 0.45)',
    transform: 'translateY(-2px)',
    '& .MuiButton-endIcon': {
      transform: 'translateX(5px)',
    },
  },
}));

const ArrowButton = styled(Button)(({ theme }) => ({
  minWidth: '52px',
  minHeight: '52px',
  padding: 0,
  borderRadius: '50%',
  color: '#d40000',
  border: '1px solid #a00101',
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  transition: `background-color 0.3s ease, color 0.3s ease,
    transform 0.3s ${EASING}`,

  [theme.breakpoints.down('sm')]: {
    minWidth: '46px',
    minHeight: '46px',
  },

  '&:hover': {
    backgroundColor: '#d40000',
    color: '#ffffff',
    borderColor: '#d40000',
    transform: 'scale(1.08)',
  },
}));

const AnimatedTitle = ({ text }) => {
  const words = text.split(' ');
  const lastWordIndex = words.length - 1;

  return (
    <Title variant="h3" component="h1">
      {words.map((word, wordIndex) => (
        <WordMask key={`${word}-${wordIndex}`}>
          <Word
            data-accent={wordIndex === lastWordIndex}
            style={{ animationDelay: `${0.2 + wordIndex * 0.08}s` }}
          >
            {word}
          </Word>
        </WordMask>
      ))}
    </Title>
  );
};

AnimatedTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

const Eyebrow = () => (
  <Box
    sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 2, md: 3 } }}
  >
    <Box
      sx={{
        width: { xs: '32px', md: '48px' },
        height: '1px',
        backgroundColor: '#ffffff',
        transformOrigin: 'left',
        animation: `${growLine} 1s ${EASING} 0.1s both`,
      }}
    />
    <Typography
      variant="overline"
      sx={{
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: { xs: '0.25em', md: '0.35em' },
        animation: enterAnimation(0.1),
      }}
    >
      Tigers Team Racing
    </Typography>
  </Box>
);

const SlideCounter = ({
  current,
  total,
  isPaused,
  isAutoplayEnabled,
  onComplete,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
    <Typography
      component="div"
      sx={{
        color: '#ffffff',
        fontWeight: 800,
        fontSize: { xs: '1.4rem', md: '1.8rem' },
      }}
    >
      {String(current + 1).padStart(2, '0')}
      <Box
        component="span"
        sx={{
          ml: 1,
          fontSize: '0.9rem',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        / {String(total).padStart(2, '0')}
      </Box>
    </Typography>
    <Box sx={{ display: 'flex', gap: 1 }}>
      {Array.from({ length: total }, (_, slide) => (
        <Box
          key={slide}
          sx={{
            position: 'relative',
            width:
              slide === current
                ? { xs: '36px', md: '56px' }
                : { xs: '16px', md: '24px' },
            height: '2px',
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transition: `width 0.6s ${EASING}`,
          }}
        >
          {slide === current && (
            <Box
              onAnimationEnd={isAutoplayEnabled ? onComplete : undefined}
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#ffffff',
                transformOrigin: 'left',
                transform: isAutoplayEnabled ? 'scaleX(0)' : 'scaleX(1)',
                animation: isAutoplayEnabled
                  ? `${fillProgress} ${SLIDE_INTERVAL_SECONDS}s linear forwards`
                  : 'none',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  </Box>
);

SlideCounter.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  isPaused: PropTypes.bool.isRequired,
  isAutoplayEnabled: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
};

const ScrollHint = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: '4%',
      left: '50%',
      zIndex: 3,
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      transform: 'translateX(-50%)',
      [SHORT_SCREEN_QUERY]: {
        display: 'none',
      },
    }}
  >
    <Typography
      variant="caption"
      sx={{ color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.3em' }}
    >
      SCROLL
    </Typography>
    <Box
      sx={{
        width: '1px',
        height: '48px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          animation: `${scrollDrop} 1.8s ease-in-out infinite`,
        }}
      />
    </Box>
  </Box>
);

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoplayEnabled] = useState(
    () => !window.matchMedia(REDUCED_MOTION).matches,
  );
  const parallaxRef = useRef(null);
  const spotlightRef = useRef(null);

  const contentProps = useSpring({
    opacity: isAnimating ? 0 : 1,
    transform: isAnimating ? 'translateY(100px)' : 'translateY(0px)',
    config: { duration: duration },
    onRest: () => {
      if (isAnimating) {
        setIndex(nextIndex);
        setIsAnimating(false);
      }
    },
  });

  const imageProps = useSpring({
    from: { transform: 'translateX(0%)', opacity: 1 },
    to: {
      transform: isAnimating
        ? direction === 'left'
          ? 'translateX(-100%)'
          : 'translateX(100%)'
        : 'translateX(0%)',
      opacity: isAnimating ? 0 : 1,
    },
    config: { duration: duration },
  });

  const handlePrev = () => {
    setDirection('left');
    setNextIndex(index === 0 ? images.length - 1 : index - 1);
    setIsAnimating(true);
  };

  const handleNext = () => {
    setDirection('right');
    setNextIndex(index === images.length - 1 ? 0 : index + 1);
    setIsAnimating(true);
  };

  const handleAutoplayComplete = () => {
    if (!isAnimating) {
      handleNext();
    }
  };

  const handlers = useSwipeable({
    onSwipedRight: handleNext,
    onSwipedLeft: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleMouseMove = (event) => {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const ratioX = (event.clientX - left) / width;
    const ratioY = (event.clientY - top) / height;

    if (parallaxRef.current) {
      const offsetX = (ratioX - 0.5) * -PARALLAX_STRENGTH;
      const offsetY = (ratioY - 0.5) * -PARALLAX_STRENGTH;
      parallaxRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty('--x', `${ratioX * 100}%`);
      spotlightRef.current.style.setProperty('--y', `${ratioY * 100}%`);
    }
  };

  const currentSlide = images[index];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100vh',
        '@supports (height: 100dvh)': {
          height: '100dvh',
        },
        backgroundColor: '#000000',
        [REDUCED_MOTION_QUERY]: {
          '& *': {
            animationDuration: '0.01ms !important',
            animationDelay: '0s !important',
            animationIterationCount: '1 !important',
          },
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...handlers}
    >
      <CurtainPanel data-side="top" />
      <CurtainPanel data-side="bottom" />

      <animated.div
        style={{
          position: 'absolute',
          width: '100%',
          left: 0,
          height: '100%',
          overflow: 'hidden',
          ...imageProps,
        }}
      >
        <Box
          ref={parallaxRef}
          sx={{
            position: 'absolute',
            inset: `-${PARALLAX_STRENGTH}px`,
            transition: 'transform 0.6s ease-out',
          }}
        >
          <Box
            key={index}
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${currentSlide.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.75)',
              animation: `${slowZoom} 14s ease-out forwards`,
            }}
          />
        </Box>
      </animated.div>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: {
            xs: `
              linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%,
                rgba(0, 0, 0, 0.6) 100%),
              linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%,
                transparent 40%)
            `,
            md: `
              linear-gradient(90deg, rgba(0, 0, 0, 0.85) 0%,
                rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.1) 100%),
              linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%,
                transparent 35%)
            `,
          },
        }}
      />

      <Spotlight ref={spotlightRef} />
      <LightSweep key={`sweep-${index}`} />
      <GhostNumber key={`ghost-${index}`} component="div">
        {String(index + 1).padStart(2, '0')}
      </GhostNumber>

      <SocialMediaIcons
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          alignItems: 'center',
          position: 'absolute',
          zIndex: 4,
          gap: 1.5,
          top: { xs: 'auto', md: '40%' },
          bottom: { xs: '88px', md: 'auto' },
          right: { xs: '16px', md: '2%', lg: '3%' },
          '&::before, &::after': {
            display: { xs: 'none', md: 'block' },
          },
        }}
      />

      <animated.div
        style={{
          ...contentProps,
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Box
          key={index}
          sx={{
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%',
            pl: CONTENT_PADDING_LEFT,
            pr: { xs: 3, md: 14, lg: 18 },
            pt: { xs: 10, md: 0 },
            pb: { xs: 14, md: 0 },
            color: '#ffffff',
            pointerEvents: 'auto',
          }}
        >
          <Eyebrow />
          <AnimatedTitle text={currentSlide.title} />
          <Typography
            variant="body1"
            component="p"
            sx={{
              maxWidth: '500px',
              mt: { xs: 2, md: 3 },
              mb: { xs: 3, md: 4 },
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: { xs: 1.6, md: 1.8 },
              color: 'rgba(255, 255, 255, 0.8)',
              animation: enterAnimation(0.5),
            }}
          >
            {currentSlide.description}
          </Typography>
          {currentSlide.button && (
            <Box sx={{ animation: enterAnimation(0.7) }}>
              <StyledButton
                variant="contained"
                endIcon={<ArrowForwardIosIcon />}
                onClick={currentSlide.onClick}
              >
                {currentSlide.button}
              </StyledButton>
            </Box>
          )}
        </Box>
      </animated.div>

      <ScrollHint />

      <Box
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: CONTENT_PADDING_LEFT,
          pr: BAR_PADDING_RIGHT,
          py: { xs: 2.5, md: 4 },
        }}
      >
        <SlideCounter
          key={`counter-${index}`}
          current={index}
          total={images.length}
          isPaused={isPaused}
          isAutoplayEnabled={isAutoplayEnabled}
          onComplete={handleAutoplayComplete}
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <ArrowButton onClick={handlePrev} aria-label="Previous slide">
            <ArrowBackIosIcon />
          </ArrowButton>
          <ArrowButton onClick={handleNext} aria-label="Next slide">
            <ArrowForwardIosIcon />
          </ArrowButton>
        </Box>
      </Box>
    </Box>
  );
};

ImageSlider.propTypes = {
  images: PropTypes.array.isRequired,
};

export default ImageSlider;
