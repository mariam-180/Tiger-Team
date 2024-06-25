import React from 'react';
import { useContext } from 'react';
import PropTypes from 'prop-types';

import { ScrollableAreaContext } from 'components/ThisInteractive/ScrollableArea';
import Easing from 'utils/Easing';

export const ControlRotate = ({
  children,
  className,
  from = 0,
  to = 0,
  ease = Easing.linear,
  style = {},
}) => {
  const pctProgress = useContext(ScrollableAreaContext) || 0;

  const easedProgress = ease(pctProgress, 0, 1, 1);
  const inverse = 1 - easedProgress;

  const r = from * inverse + to * easedProgress;

  return (
    <span
      className={className}
      style={{
        transform: `rotate(${r}deg)`,
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// Add prop validation
ControlRotate.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  from: PropTypes.number,
  to: PropTypes.number,
  ease: PropTypes.func,
  style: PropTypes.object,
};
