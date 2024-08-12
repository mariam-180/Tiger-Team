import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Box } from '@mui/material';

const animationOptions = [
  'fade',
  'fade-up',
  'fade-down',
  'fade-left',
  'fade-right',
  'fade-up-right',
  'fade-up-left',
  'fade-down-right',
  'fade-down-left',
  'flip-up',
  'flip-down',
  'flip-left',
  'flip-right',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'zoom-in',
  'zoom-in-up',
  'zoom-in-down',
  'zoom-in-left',
  'zoom-in-right',
  'zoom-out',
  'zoom-out-up',
  'zoom-out-down',
  'zoom-out-left',
  'zoom-out-right',
];

function ScrollAnimation({ children, animation, duration, delay }) {
  useEffect(() => {
    AOS.init({ duration });
  }, [duration, delay]);

  return (
    <Box className="top" data-aos={animation} data-aos-delay={delay}>
      {children}
    </Box>
  );
}

ScrollAnimation.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
  delay: PropTypes.number,
  animation: PropTypes.oneOf(animationOptions),
};

ScrollAnimation.defaultProps = {
  animation: 'fade-up',
  duration: 1500,
  delay: 0,
};

export default ScrollAnimation;
