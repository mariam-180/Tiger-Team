import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const BaseContainer = styled(Box)(
  ({ backgroundImage, theme, blur, brightness, sx }) => ({
    position: 'relative',
    minHeight: '100vh',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(3),
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `url(${backgroundImage}) no-repeat center center fixed`,
      backgroundSize: 'cover',
      filter: `blur(${blur}px) brightness(${brightness}%)`,
      zIndex: 0,
    },
    ...sx,
  }),
);

const ParentContainer = ({
  backgroundImage,
  children,
  blur,
  brightness,
  sx,
}) => {
  return (
    <BaseContainer
      backgroundImage={backgroundImage}
      blur={blur}
      brightness={brightness}
      sx={sx}
    >
      {children}
    </BaseContainer>
  );
};

ParentContainer.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  children: PropTypes.node,
  blur: PropTypes.number,
  brightness: PropTypes.number,
  sx: PropTypes.any,
};

ParentContainer.defaultProps = {
  blur: 0,
  brightness: 100,
};

export default ParentContainer;
