// ConfettiUtil.js
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Confetti from 'react-confetti';

const ConfettiUtil = ({run, onComplete}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (run) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) {
          onComplete();
        }
      }, 2000);
    }
  }, [run, onComplete]);

  return showConfetti && <Confetti/>;
};

ConfettiUtil.propTypes = {
  onComplete: PropTypes.func,
  run: PropTypes.bool,
};
export default ConfettiUtil;
