import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Easing from 'utils/Easing';

export const AnimatedFade = ({
  children,
  duration = 1000,
  frame = 16,
  startOpacity = 0,
  endOpacity = 1,
  ease = Easing.easeInOutQuad,
}) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const tΔ = (1 * frame) / duration;
    let t = 0;

    let timeout = 0;
    const tick = () => {
      clearTimeout(timeout);
      const val = ease(
          t * endOpacity + (1 - t) * startOpacity,
          startOpacity,
          endOpacity,
          1,
      );
      setOpacity(val);
      t += tΔ;
      t = clamp(t);

      if (t < 1) {
        timeout = setTimeout(() => {
          tick();
        }, frame);
      }
    };
    tick();
  }, [setOpacity, duration, frame, startOpacity, endOpacity, ease]);

  return <div style={{opacity}}>{children}</div>;
};

AnimatedFade.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
  frame: PropTypes.number,
  startOpacity: PropTypes.number,
  endOpacity: PropTypes.number,
  ease: PropTypes.func,
};

const clamp = (val = 0, min = 0, max = 1) => {
  return Math.min(Math.max(val, min), max);
};
