import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRect } from 'react-use-rect';

const SlideText = ({ source }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [rectRef] = useRect(setRect);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItemIndex((index) =>
        index === source.length - 1 ? 0 : index + 1,
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [currentItemIndex, source]);

  return (
    <div
      style={{
        display: 'inline-flex',
        overflow: 'hidden',
        position: 'relative',
        width: `${rect?.width}px`,
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <span style={{ visibility: 'hidden' }}>{source[currentItemIndex]}</span>
      {source.map((text, index) => (
        <span
          key={index}
          ref={currentItemIndex === index ? rectRef : null}
          style={{
            position: 'absolute',
            top: (rect?.height ?? 0) * 2,
            transform: `translateY(${
              currentItemIndex === index ? `-${(rect?.height ?? 0) * 2}px` : 0
            })`,
            transition: 'all 1s ease-in-out',
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
};

SlideText.propTypes = {
  source: PropTypes.arrayOf(PropTypes.string).isRequired,
  length: PropTypes.number.isRequired,
};

export default SlideText;

// ************* / Usage:

// import React from "react";
// import SlideText from "./SlideText";
// import "./styles.css";

// const mock = ["Poland", "Germany", "UK", "Spain"];

// export default function App() {
//   return (
//     <div className="App" style={{ color: "white", fontSize: "2rem" }}>
//       The <SlideText source={mock} length={mock.length} /> is the Best!
//     </div>
//   );
// }
