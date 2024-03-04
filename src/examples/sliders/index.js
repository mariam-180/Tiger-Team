import React, {useRef, useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';
import {gsap} from 'gsap';

const useStyles = makeStyles((theme) => ({
  stage: {
    'width': '100%',
    'transform': 'scale(0.8)',
    'height': '25vh',
    'backfaceVisibility': 'hidden',
    'userSelect': 'none',
    'overflow': 'hidden',
    'background': 'transparent',
    'position': 'absolute',
    'zIndex': 2,
    'transition': 'transform 0.3s ease-in-out, height 0.3s ease-in-out',
    [theme.breakpoints.up('sm')]: {
      transform: 'scale(0.8)',
      height: '40vh',
    },
    [theme.breakpoints.up('md')]: {
      transform: 'scale(0.75)',
      height: '50vh',
    },
    '@media (min-width: 1000px) and (max-width: 1200px)': {
      transform: 'scale(0.8)',
      height: '75vh',
    },
    '@media (min-width: 1200px) and (max-width: 1400px)': {
      transform: 'scale(.85)',
      height: '100vh',
    },
    '@media (min-width: 1400px) and (max-width: 1800px)': {
      transform: 'scale(0.9)',
      height: '110vh',
    },
    '@media (min-width: 1800px)': {
      transform: 'scale(1)',
      height: '130vh',
    },
  },
  container: {
    perspective: '2000px',
    width: '300px',
    height: '400px',
    position: 'relative',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%) scale(0.5)',
    transition: 'transform 0.3s ease-in-out',
    willChange: 'transform',
    [theme.breakpoints.up('sm')]: {
      transform: 'translate(-50%, -50%) scale(0.7)',
    },
    [theme.breakpoints.up('md')]: {
      transform: 'translate(-50%, -50%) scale(0.9)',
    },
    [theme.breakpoints.up('lg')]: {
      transform: 'translate(-60%, -60%) scale(1.2)',
    },
  },
  ring: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    userSelect: 'none',
  },
  imgWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    userSelect: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    color: '#750000',
    fontSize: '2.5rem',
    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
  },
}));

const RotatingRing = ({images, onSelect}) => {
  const classes = useStyles();
  const containerRef = useRef(null);
  const ringRef = useRef(null);

  const isMobile = window.innerWidth < 768;
  const sensitivityMultiplier = isMobile ? 5.5 : 2.5;

  useEffect(() => {
    const totalImages = images.length;
    const angle = 360 / totalImages;

    gsap.set(ringRef.current, {rotationY: 180, cursor: 'grab'});
    images.forEach((img, index) => {
      const elem = containerRef.current.querySelectorAll(
          `.${classes.imgWrapper}`,
      )[index];
      gsap.set(elem, {
        rotateY: index * -angle,
        transformOrigin: '50% 50% 500px',
        z: -500,
      });
      elem.style.backgroundImage = `url(${images[index].url})`;
    });

    const container = containerRef.current;
    const imgs = containerRef.current.querySelectorAll(
        `.${classes.imgWrapper}`,
    );

    imgs.forEach((img) => {
      img.addEventListener('mouseenter', () => {
        gsap.to(img, {opacity: 1, ease: 'power3'});
        gsap.to(imgs, {
          opacity: (i, target) => (target === img ? 1 : 0.5),
          ease: 'power3',
        });
      });

      img.addEventListener('mouseleave', () => {
        gsap.to(imgs, {opacity: 1, ease: 'power2.inOut'});
      });
    });

    let xPos = 0;

    // Drag functionality
    const dragStart = (e) => {
      if (e.touches) e.clientX = e.touches[0].clientX;
      xPos = Math.round(e.clientX);
      gsap.set(ringRef.current, {cursor: 'grabbing'});
      container.addEventListener('mousemove', drag);
      container.addEventListener('touchmove', drag);
    };
    const drag = (e) => {
      const currentX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = (currentX - xPos) * sensitivityMultiplier;

      gsap.to(ringRef.current, {
        rotationY: `-=${deltaX}`,
        ease: 'none',
      });

      xPos = currentX;
    };

    const dragEnd = () => {
      container.removeEventListener('mousemove', drag);
      container.removeEventListener('touchmove', drag);
      gsap.set(ringRef.current, {cursor: 'grab'});
    };

    container.addEventListener('mousedown', dragStart);
    container.addEventListener('touchstart', dragStart);
    container.addEventListener('mouseup', dragEnd);
    container.addEventListener('touchend', dragEnd);

    return () => {
      container.removeEventListener('mousedown', dragStart);
      container.removeEventListener('touchstart', dragStart);
      container.removeEventListener('mouseup', dragEnd);
      container.removeEventListener('touchend', dragEnd);
      container.removeEventListener('mousemove', drag);
      container.removeEventListener('touchmove', drag);
    };
  }, [images, classes.imgWrapper, sensitivityMultiplier]);

  return (
    <div className={classes.stage}>
      <div className={classes.container} ref={containerRef}>
        <div className={classes.ring} ref={ringRef}>
          {images.map((image, index) => (
            <div
              key={image.id}
              className={classes.imgWrapper}
              onClick={() => onSelect(index)}
              style={{backgroundImage: `url(${image.url})`}}
            >
              <span>{image.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

RotatingRing.propTypes = {
  images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default RotatingRing;
