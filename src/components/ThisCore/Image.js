import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import 'assets/css/Image.css';

const Image = ({
  src = '',
  alt = '',
  height,
  children,
  fixed = false,
  speed = 1,
  clamp = false,
  debug = false,
}) => {
  const box = useRef(null);
  const img = useRef(null);
  const [ΔY, setΔY] = useState(0);

  const handleScroll = () => {
    if (fixed) return;
    if (!box.current || !img.current) return;

    const boxRect = box.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;

    const winBottom = scrollY + winHeight;
    const boxTop = boxRect.top + scrollY;
    const boxBottom = boxRect.bottom + scrollY;
    const boxHeight = boxRect.height;
    const pct =
      (clampVal(winBottom, boxTop, boxBottom + winHeight) - boxTop) /
      (boxHeight + winHeight);

    const imgHeight = img.current.offsetHeight;

    if (imgHeight < boxHeight) {
      console.warn(
          // eslint-disable-next-line max-len
          `Parallax effect doesn't work if image is smaller than the bounding box. imgHeight=${imgHeight}, boxHeight=${boxHeight}`,
      );
      return;
    }

    const diff = imgHeight - boxHeight;
    const deltaY = (0 - diff - diff * speed) * 0.5 + diff * pct * speed;

    if (clamp) {
      setΔY(clampVal(deltaY, -diff, 0));
    } else {
      setΔY(deltaY);
    }

    if (debug) {
      console.log({
        pct,
        ΔY,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={box} className="image-box" style={{height: height || 'auto'}}>
      {fixed ? (
        <div
          className="image-bg dark-overlay"
          style={{backgroundImage: `url(${src})`, height: height || 'auto'}}
        />
      ) : (
        <img
          ref={img}
          className="image-behind"
          src={src}
          alt={alt}
          style={{transform: `translateY(${ΔY}px)`}}
        />
      )}
      {children && <div className="image-content">{children}</div>}
    </div>
  );
};

export default Image;

const clampVal = (num, min, max) => {
  return Math.max(min, Math.min(num, max));
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node,
  fixed: PropTypes.bool,
  speed: PropTypes.number,
  clamp: PropTypes.bool,
  debug: PropTypes.bool,
};
