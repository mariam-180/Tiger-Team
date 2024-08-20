import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Typed from 'typed.js';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const GradientTypography = styled(Typography)`
  background: linear-gradient(40deg, #ffffff 30%, #ff0000 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  width: fit-content;
`;

const AnimatedTypingText = ({
  strings,
  sx,
  typeSpeed = 70,
  backSpeed = 70,
  smartBackspace,
  loop,
  backDelay = 1000,
  styled = false,
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
    <>
      {styled && (
        <GradientTypography variant="body1" sx={sx}>
          <span ref={el} />
        </GradientTypography>
      )}
      {!styled && (
        <Typography component="div" variant="body1" sx={sx}>
          <span ref={el} />
        </Typography>
      )}
    </>
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
  styled: PropTypes.bool,
};

export default AnimatedTypingText;
