/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import './Slider.css';

function lerp({ x, y }, { x: targetX, y: targetY }) {
  const fraction = 0.1;

  x += (targetX - x) * fraction;
  y += (targetY - y) * fraction;

  return { x, y };
}

function Slider({ images, text }) {
  const sliderRef = useRef(null);
  const contentEl = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [animationStopped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const autoSlideTimeout = useRef(null);
  const restartAutoSlideTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const htmlStyles = getComputedStyle(document.documentElement);
      const mobileBreakpoint = htmlStyles.getPropertyValue('--mobile-bkp');
      setIsMobile(
        window.matchMedia(`only screen and (max-width: ${mobileBreakpoint})`)
          .matches,
      );

      if (!isMobile) {
        sliderRef.current.addEventListener('mousemove', handleMouseMove);
        contentEl.current.style.setProperty(
          'transform',
          `translateZ(${htmlStyles.getPropertyValue('--z-distance')})`,
        );
      } else {
        sliderRef.current.removeEventListener('mousemove', handleMouseMove);
        contentEl.current.style.setProperty('transform', 'none');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  // useEffect(() => {
  //   if (!animationRunning && targetX !== lastX && targetY !== lastY) {
  //     setAnimationRunning(true);
  //     runAnimation();
  //   }
  // }, [targetX, targetY, animationRunning]);

  const handleMouseMove = ({ pageX, pageY }) => {
    setTargetX(pageX);
    setTargetY(pageY);
  };

  // const runAnimation = () => {
  //   if (animationStopped) {
  //     setAnimationRunning(false);
  //     return;
  //   }

  //   const newPos = lerp({ x: lastX, y: lastY }, { x: targetX, y: targetY });

  //   setLastX(newPos.x);
  //   setLastY(newPos.y);

  //   const { xCoeff, yCoeff } = getMouseCoefficients(newPos);

  //   positionImage({ xCoeff, yCoeff });

  //   contentEl.current.style.setProperty(
  //     'transform',
  //     `
  //     translateZ(var(--z-distance))
  //     rotateX(${15 * yCoeff}deg)
  //     rotateY(${15 * xCoeff}deg)
  //   `,
  //   );

  //   if (!reachedFinalPoint(newPos)) {
  //     // requestAnimationFrame(runAnimation);
  //   } else {
  //     setAnimationRunning(false);
  //   }
  // };

  // const getMouseCoefficients = ({ x, y }) => {
  //   const halfWidth = window.innerWidth / 2;
  //   const halfHeight = window.innerHeight / 2;
  //   const xCoeff = (x - halfWidth) / halfWidth;
  //   const yCoeff = (halfHeight - y) / halfHeight;

  //   return { xCoeff, yCoeff };
  // };

  // const reachedFinalPoint = ({ x, y }) => {
  //   return Math.abs(x - targetX) < 1 && Math.abs(y - targetY) < 1;
  // };

  // const positionImage = ({ xCoeff, yCoeff }) => {
  //   const maxImgOffset = 1;
  //   const currentImage = sliderRef
  //     ? sliderRef.current.querySelector(
  //         `.slider__images-item[data-id='${activeIndex + 1}'] img`,
  //       )
  //     : 1;
  //   currentImage.style.setProperty(
  //     'transform',
  //     `
  //     translateX(${maxImgOffset * -xCoeff}em)
  //     translateY(${maxImgOffset * yCoeff}em)
  //   `,
  //   );
  // };

  const next = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    resetAutoSlide();
  };

  const prev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
    resetAutoSlide();
  };

  const onDotClick = (index) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
      resetAutoSlide();
    }
  };

  const autoSlide = () => {
    clearTimeout(autoSlideTimeout.current);
    autoSlideTimeout.current = setTimeout(() => {
      next();
      autoSlide();
    }, 3500);
  };

  const resetAutoSlide = () => {
    clearTimeout(autoSlideTimeout.current);
    clearTimeout(restartAutoSlideTimeout.current);
    restartAutoSlideTimeout.current = setTimeout(() => {
      autoSlide();
    }, 3500);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--from-left', activeIndex + 1);
  }, [activeIndex]);

  // For animation based on mouse position.
  // useEffect(() => {
  //   setAnimationRunning(true);
  //   runAnimation();
  // }, [targetX, targetY]);

  const stopAutoSlide = () => {
    clearTimeout(autoSlideTimeout.current);
  };

  useEffect(() => {
    autoSlide();
    sliderRef.current.addEventListener('mousemove', stopAutoSlide);
    sliderRef.current.addEventListener('touchstart', stopAutoSlide);

    return () => {
      clearTimeout(autoSlideTimeout.current);
      clearTimeout(restartAutoSlideTimeout.current);
    };
  }, []);

  return (
    <div
      id="slider"
      ref={sliderRef}
      className="slider"
      style={{ '--img-prev': `url(${images[activeIndex]})` }}
    >
      <div id="slider-content" ref={contentEl} className="slider__content">
        <div className="slider__images">
          {images.map((src, i) => (
            <div
              key={i}
              className={`slider__images-item ${
                i === activeIndex ? 'slider__images-item--active' : ''
              }`}
              data-id={i + 1}
            >
              <img src={src} alt={`Slide ${i + 1}`} />
            </div>
          ))}
        </div>
        <div className="slider__text">
          {Object.entries(text).map(([key, val], i) => (
            <div
              key={key}
              className={`slider__text-item ${
                i === activeIndex ? 'slider__text-item--active' : ''
              }`}
              data-id={i + 1}
            >
              <div className="slider__text-item-head">
                <h3>{key}</h3>
              </div>
              <div className="slider__text-item-info">
                <p>{val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="slider__nav">
        <div className="slider__nav-arrows">
          <div
            id="left"
            className="slider__nav-arrow slider__nav-arrow--left"
            onClick={prev}
          ></div>
          <div
            id="right"
            className="slider__nav-arrow slider__nav-arrow--right"
            onClick={next}
          ></div>
        </div>
        <div id="slider-dots" className="slider__nav-dots">
          {images.map((_, i) => (
            <div
              key={i}
              className={`slider__nav-dot ${
                i === activeIndex ? 'slider__nav-dot--active' : ''
              }`}
              data-id={i + 1}
              onClick={() => onDotClick(i)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
