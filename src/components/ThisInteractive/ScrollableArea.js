import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useGlobalScroll } from 'hooks/useGlobalScroll';
import { useRect } from 'hooks/useRect';
import { Maths } from 'utils/Maths';

export const ScrollableAreaContext = React.createContext(false);

export const ScrollableArea = ({
  id = undefined,
  className = undefined,
  viewportHeight = 100,
  clamp = true,
  debug = false,
  debugLabel = '',
  children,
  style = {},
  startAtScreenTop = false,
}) => {
  const ref = useRef(null);
  const [scrollY, winHeight] = useGlobalScroll();
  const [initialized, rect] = useRect(ref);

  const scrollProgress = initialized
    ? getScrollProgress(
        scrollY,
        rect.top,
        rect.bottom,
        winHeight,
        clamp,
        startAtScreenTop,
      )
    : 0;

  useEffect(() => {
    if (debug) {
      console.log(
        debugLabel || (ref.current && ref.current.id) || 'RECT_CALC',
        `INIT=`,
        initialized,
        `TOP=`,
        rect.top,
        `BOTTOM=`,
        rect.bottom,
      );
    }
  }, [debug, debugLabel, initialized, rect]);

  if (debug) {
    console.log(
      debugLabel || (ref.current && ref.current.id) || 'SCRL_%=',
      scrollProgress,
      'SCRL_Y=',
      scrollY,
    );
  }

  return (
    <div
      id={id}
      ref={ref}
      className={className}
      style={{
        minHeight: `${viewportHeight}vh`,
        backgroundColor: debug ? 'rgba(255, 0, 0, 0.5)' : 'transparent',
        ...style,
      }}
    >
      <ScrollableAreaContext.Provider value={Number(scrollProgress) || 0}>
        {children}
      </ScrollableAreaContext.Provider>
    </div>
  );
};

ScrollableArea.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  viewportHeight: PropTypes.number,
  clamp: PropTypes.bool,
  debug: PropTypes.bool,
  debugLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  startAtScreenTop: PropTypes.bool,
};

function getScrollProgress(
  scrollY = 0,
  containerTopY = 0,
  containerBottomY = 0,
  winHeight = 0,
  clamp = false,
  startAtScreenTop = false,
) {
  if (!containerBottomY || containerBottomY - containerTopY <= 0) return -1;

  const min = startAtScreenTop
    ? containerTopY
    : Math.max(containerTopY - winHeight, 0);
  const max = Math.min(
    document.body.scrollHeight - winHeight,
    containerBottomY,
  );

  const pctProgress = (scrollY - min) / (max - min);

  if (!clamp) return pctProgress;

  return Maths.clampVal(pctProgress, 0, 1);
}
