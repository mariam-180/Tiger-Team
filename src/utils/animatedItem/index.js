import React from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    opacity: 0,
    transform: 'translateY(40px)',
    transition: ({ delay }) =>
      `opacity 1s ease-out ${delay}s, transform 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    willChange: 'opacity, transform',
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

const AnimatedItem = ({ children, delay = 0 }) => {
  const classes = useStyles({ delay });
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`${classes.root} ${inView ? classes.visible : ''}`}
    >
      {children}
    </div>
  );
};

AnimatedItem.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
};

export default AnimatedItem;
