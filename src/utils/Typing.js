import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import Typed from 'typed.js';
import {Typography} from '@mui/material';

const AnimatedTypingText = ({
  strings,
  sx,
  typeSpeed = 70,
  backSpeed = 70,
  smartBackspace,
  loop,
  backDelay = 1000,
}) => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: strings,
      typeSpeed: typeSpeed,
      backSpeed: backSpeed,
      smartBackspace: smartBackspace ? true : false,
      loop: loop ? true : false,
      backDelay: backDelay,
    });

    return () => {
      typed.destroy();
    };
  }, [strings, typeSpeed, backSpeed, smartBackspace, loop, backDelay]);

  return (
    <Typography component="div" variant="body1" sx={sx}>
      <span ref={el} />
    </Typography>
  );
};

AnimatedTypingText.propTypes = {
  strings: PropTypes.arrayOf(PropTypes.string).isRequired,
  sx: PropTypes.object,
  typeSpeed: PropTypes.number,
  backSpeed: PropTypes.number,
  smartBackspace: PropTypes.bool,
  loop: PropTypes.bool,
  backDelay: PropTypes.number,
};

export default AnimatedTypingText;
