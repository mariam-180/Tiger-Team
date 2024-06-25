/* eslint-disable new-cap */
import React from 'react';
import {
  ScrollPage,
  Animator,
  batch,
  Fade,
  MoveIn,
  MoveOut,
  Sticky,
  StickyIn,
  FadeIn,
  ZoomIn,
  Move,
} from 'react-scroll-motion';
import PropTypes from 'prop-types';

// Available animations:
// Fade() - Simple fade animation
// MoveIn(x, y) - Moves in from a specified direction (x, y)
// MoveOut(x, y) - Moves out to a specified direction (x, y)
// Sticky() - Makes the element sticky while scrolling
// StickyIn() - Combines sticky with a fade in
// FadeIn() - Fades in
// ZoomIn() - Zooms in
// Move(x, y) - Moves to a specified direction (x, y)

// Easing function for smooth animation
const easeInOutCubic = (t) => --t * t * t + 1;

const Spin = (cycle) => ({
  in: {
    style: {
      // `p` is number (0~1)
      // When just before this page appear, `p` will be 0
      // When this page filled your screen, `p` will be 1
      transform: (p) => `rotate(${p * 360 * cycle}deg)`,
    },
  },
  out: {
    style: {
      // `p` is number (0~1)
      // When this page filled your screen, `p` will be 0
      // When just after this page disappear, `p` will be 1
      transform: (p) => `rotate(${p * 360 * cycle}deg)`,
    },
  },
});

// Define the custom animation for moving in from left and shaking
const MoveInFromLeftAndShake = {
  in: {
    style: {
      transform: (p) => `translateX(${(1 - p) * -1000}px)`,
      opacity: (p) => p,
    },
    easing: easeInOutCubic,
  },
  out: {
    style: {
      transform: 'translateX(0)',
      opacity: 1,
    },
    easing: easeInOutCubic,
  },
  enter: {
    style: {
      transform: 'translateX(0)',
      animation: 'shake 0.5s',
    },
  },
};

// Define keyframes for the shake animation
const shakeKeyframes = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
`;

// Predefined animations
const animations = {
  zoomInScrollOut: batch(StickyIn(), FadeIn(), ZoomIn()),
  fadeUp: batch(Fade(), Move(), Sticky()),
  fadeInFromLeft: batch(Fade(), MoveIn(-1000, 0)),
  fadeInFromRight: batch(Fade(), MoveIn(1000, 0)),
  fadeInFromLeftAndShake: batch(Sticky(), Fade(), MoveInFromLeftAndShake),
  fadeOut: batch(Fade(), MoveOut(0, -200)),
  spin: batch(Sticky(), Fade(), Spin(1)),
};

const AnimatedSection = ({ children, animation, shake }) => {
  let combinedAnimation;
  if (typeof animation === 'string' && animations[animation]) {
    combinedAnimation = animations[animation];
  } else if (Array.isArray(animation)) {
    combinedAnimation = batch(...animation);
  }
  return (
    <ScrollPage>
      <style>{shakeKeyframes}</style>
      <Animator
        animation={combinedAnimation}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {children}
      </Animator>
    </ScrollPage>
  );
};

AnimatedSection.propTypes = {
  children: PropTypes.node.isRequired,
  shake: PropTypes.bool,
  animation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

AnimatedSection.defaultProps = {
  animation: animations.fadeUp,
  shake: false,
  animation: 'fadeUp',
};

export default AnimatedSection;
