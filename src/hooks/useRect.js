import {useEffect, useState} from 'react';

const defaultRect = () => ({
  top: undefined,
  left: undefined,
  buttom: undefined,
  right: undefined,
  width: undefined,
  height: undefined,
});
export const useRect = (nodeRef = {current: null}) => {
  const [initialized, setInitialized] = useState(false);
  const [rect, setRect] = useState(defaultRect());

  useEffect(() => {
    setRect(calcPosition(nodeRef.current));
    setInitialized(true);
  }, [setInitialized, setRect, nodeRef]);

  const recalculate = () => {
    const calculated = calcPosition(nodeRef.current);
    setRect(calculated);
    return calculated;
  };

  return [initialized, rect, recalculate];
};

const calcPosition = (node) => {
  if (!node) return defaultRect();
  let el = node;
  let offsetLeft = 0;
  let offsetTop = 0;

  do {
    offsetLeft += el.offsetLeft;
    offsetTop += el.offsetTop;

    el = el.offsetParent;
  } while (el);

  return {
    top: offsetTop,
    left: offsetLeft,
    bottom: offsetTop + node.offsetHeight,
    right: offsetLeft + node.offsetWidth,
  };
};
