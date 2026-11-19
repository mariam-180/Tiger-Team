import React from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useGlobalMouseMove } from 'hooks/useGlobalMouseMove';
import Easing from 'utils/Easing';
import { ScrollableAreaContext } from 'components/ThisInteractive/ScrollableArea';

export const ControlTranslate = ({
  children,
  className,
  scrollFromX = 0,
  scrollFromY = 0,
  scrollToX = 0,
  scrollToY = 0,
  mouseOffsetX = 0,
  mouseOffsetY = 0,
  ease = Easing.linear,
  style = {},
}) => {
  const [mouseX, mouseY] = useGlobalMouseMove();
  const pctProgress = useContext(ScrollableAreaContext) || 0;

  const easedProgress = ease(pctProgress, 0, 1, 1);
  const inverse = 1 - easedProgress;

  const x =
    scrollFromX * inverse + scrollToX * easedProgress + mouseOffsetX * mouseX;
  const y =
    scrollFromY * inverse + scrollToY * easedProgress + mouseOffsetY * mouseY;

  return (
    <div
      className={className}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0px)`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

ControlTranslate.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  scrollFromX: PropTypes.number,
  scrollFromY: PropTypes.number,
  scrollToX: PropTypes.number,
  scrollToY: PropTypes.number,
  mouseOffsetX: PropTypes.number,
  mouseOffsetY: PropTypes.number,
  ease: PropTypes.func,
  style: PropTypes.object,
};
