import React from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    opacity: 0,
    // transform: 'translatey(20px)',
    transition: ({ delay }) =>
      `opacity 1.8s ease-out ${delay}s, transform 1.2s ease-out ${delay}s`,
  },
  visible: {
    opacity: 1,
    // transform: 'translatey(0)',
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
