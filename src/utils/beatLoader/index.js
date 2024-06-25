// BeatLoaderUtil.js
import React from 'react';
import PropTypes from 'prop-types';

import { css } from '@emotion/react';
import BeatLoader from 'react-spinners/BeatLoader';

const BeatLoaderUtil = ({
  loading,
  color = '#8993A4',
  size = 35,
  background,
}) => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const containerStyle = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const backgroundStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `url(${background}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    filter: 'blur(8px) brightness(20%)',
  };

  const loaderStyle = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translateX(-50%)',
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      <div style={loaderStyle}>
        <BeatLoader
          color={color}
          loading={loading}
          css={override}
          size={size}
        />
      </div>
    </div>
  );
};

BeatLoaderUtil.propTypes = {
  loading: PropTypes.any,
  color: PropTypes.string,
  size: PropTypes.number,
  background: PropTypes.string,
};

export default BeatLoaderUtil;
