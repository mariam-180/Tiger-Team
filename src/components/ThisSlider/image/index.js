import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSpring, animated } from 'react-spring';
import { useSwipeable } from 'react-swipeable';
import ArrowBackIosIcon from '@mui/icons-material/KeyboardBackspaceTwoTone';
import ArrowForwardIosIcon from '@mui/icons-material/EastTwoTone';

import { useIsMobile } from 'utils/hooks';

import SocialMediaIcons from 'examples/socialMediaIcons';

const duration = 400;

// const StyledButton = styled(Button)(({ theme }) => ({
//   background: 'linear-gradient(45deg, #000000 0%, #d4af37 90%)',
//   color: '#ffffff',
//   padding: theme.spacing(1.5, 4),
//   fontSize: '.9rem',
//   fontWeight: 600,
//   textTransform: 'none',
//   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
//   borderRadius: '25px',
//   transition: 'background 0.5s ease, box-shadow 0.5s ease',
//   '&:hover': {
//     background: 'linear-gradient(45deg, #000000 0%, #d4af37 90%)',
//     boxShadow: '0 5px 7px 2px rgba(255, 165, 0, 0.5)',
//   },
// }));

const GradientTypography = styled(Typography)`
  background: linear-gradient(40deg, #ffffff 30%, #ff0000 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  width: fit-content;
`;

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #000000 30%, #FF0000 90%)',
  color: '#ffffff',
  padding: theme.spacing(1.5, 4),
  margin: theme.spacing(3),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  borderRadius: '25px',
  transition: 'background 0.5s ease, box-shadow 0.5s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #333333 30%, #666666 90%)',
    boxShadow: '0 5px 7px 2px rgba(255, 105, 135, .4)',
  },
}));

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const isMobile = useIsMobile();

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

  const handlers = useSwipeable({
    onSwipedRight: handleNext,
    onSwipedLeft: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '95vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...handlers}
    >
      <SocialMediaIcons
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          zIndex: 3,
          gap: 2,
          top: '44%',
          left: '10%',
          '@media (max-width: 600px)': {
            display: 'none',
          },
          '& .MuiIconButton-root': {
            '&:hover': {
              transform: 'translateX(15%)',
            },
          },
        }}
      />
      <animated.div
        style={{
          position: 'absolute',
          width: '100%',
          left: 0,
          height: '100%',
          backgroundImage: `url(${images[index].url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(0px) brightness(0.5)',
          ...imageProps,
        }}
      />
      <animated.div
        style={{
          ...contentProps,
          position: 'absolute',
          zIndex: 1,
          maxWidth: '800px',
          color: 'white',
          padding: '10px',
          textAlign: 'left',
          left: isMobile ? '0' : '20%',
        }}
      >
        <GradientTypography
          variant="h3"
          component="h1"
          // color="rgba(255, 165, 0, 0.5)"
          sx={{
            marginBottom: 1,
          }}
        >
          {images[index].title}
        </GradientTypography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
          {images[index].description}
        </Typography>
        {images[index].button && (
          <StyledButton
            variant="contained"
            color="warning"
            sx={{ marginBottom: 1 }}
            onClick={images[index].onClick}
          >
            {images[index].button}
          </StyledButton>
        )}
      </animated.div>
      <Box
        sx={{
          position: 'absolute',
          background: `linear-gradient(
            to bottom right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.1) 20%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.3) 60%,
            rgba(255, 0, 0, 0.5) 100%
            )`,
          clipPath: 'polygon(50% 0%, 100% 0, 100% 100%, 0% 100%)',
          height: '100vh',
          width: '30vh',
          top: '0',
          right: '11%',
          '@media (max-width: 600px)': {
            width: '50vw',
            left: '0',
            right: 'auto',
            clipPath: 'polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)',
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: '15%',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 3,
          '@media (max-width: 600px)': {
            right: 'auto',
            top: 'auto',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            flexDirection: 'row',
          },
        }}
      >
        <Button
          onClick={handlePrev}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '50%',
            minWidth: '50px',
            minHeight: '50px',
            padding: 0,
            display: 'flex',
            bottom: '8px',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background 0.5s ease,',
            zIndex: 10,
            '@media (max-width: 600px)': {
              right: '5px',
              bottom: '0',
            },
            '&:hover': {
              background: 'rgba(255, 165, 0, 0.1)',
            },
          }}
        >
          <ArrowBackIosIcon sx={{ color: 'grey', fontSize: 'large' }} />
        </Button>
        <Button
          onClick={handleNext}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '50%',
            minWidth: '50px',
            minHeight: '50px',
            padding: 0,
            display: 'flex',
            top: '8px',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            transition: 'background 1.5s ease,',
            '@media (max-width: 600px)': {
              top: '0',
              left: '5px',
            },
            '&:hover': {
              background: 'rgba(255, 165, 0, 0.1)',
            },
          }}
        >
          <ArrowForwardIosIcon sx={{ color: 'grey', fontSize: 'large' }} />
        </Button>
      </Box>
    </Box>
  );
};

ImageSlider.propTypes = {
  images: PropTypes.array.isRequired,
};

export default ImageSlider;
