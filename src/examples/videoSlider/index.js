/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import './Slider.css';

function Slider({ media, text }) {
  const sliderRef = useRef(null);
  const contentEl = useRef(null);
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
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

  const handleMouseMove = ({ pageX, pageY }) => {
    setTargetX(pageX);
    setTargetY(pageY);
  };

  const next = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % media.length);
    resetAutoSlide();
  };

  const prev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length,
    );
    resetAutoSlide();
  };

  const onDotClick = (index) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
    }
    resetAutoSlide();
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
    }, 1000);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--from-left', activeIndex + 1);
  }, [activeIndex]);

  const stopAutoSlide = () => {
    clearTimeout(autoSlideTimeout.current);
  };

  useEffect(() => {
    resetAutoSlide();
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
      style={{
        '--img-prev':
          media[activeIndex].type === 'image'
            ? `url(${media[activeIndex].src})`
            : '',
      }}
    >
      {media[activeIndex].type === 'video' && (
        <video
          className="slider__background-video"
          src={media[activeIndex].src}
          autoPlay={true}
          playsInline
          muted
          loop
          disablePictureInPicture
          controls={false}
        />
      )}
      <div id="slider-content" ref={contentEl} className="slider__content">
        <div className="slider__images">
          {media.map((item, i) => (
            <div
              key={i}
              className={`slider__images-item ${
                i === activeIndex ? 'slider__images-item--active' : ''
              }`}
              data-id={i + 1}
            >
              <img src={item.src} alt={`Slide ${i + 1}`} />
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
          {media.map((_, i) => (
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
