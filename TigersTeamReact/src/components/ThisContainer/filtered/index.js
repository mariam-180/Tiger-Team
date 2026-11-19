import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const BaseContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['backgroundImage', 'blur', 'brightness'].includes(prop),
})(({ backgroundImage, theme, blur, brightness }) => ({
  position: 'relative',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '100vh',
  '@supports (height: 100dvh)': {
    minHeight: '100dvh',
  },
  padding: theme.spacing(13, 6, 4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(3),
  overflow: 'hidden',
  backgroundColor: '#000000',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(12, 3, 4),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(11, 1.5, 3),
    gap: theme.spacing(2),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    filter: `blur(${blur}px) brightness(${brightness}%)`,
    zIndex: 0,
  },
}));

const Content = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  boxSizing: 'border-box',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
}));

const ParentContainer = ({
  backgroundImage,
  children,
  blur = 0,
  brightness = 100,
  sx,
}) => {
  return (
    <BaseContainer
      backgroundImage={backgroundImage}
      blur={blur}
      brightness={brightness}
      sx={sx}
    >
      <Content>{children}</Content>
    </BaseContainer>
  );
};

ParentContainer.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  children: PropTypes.node,
  blur: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  brightness: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sx: PropTypes.any,
};

export default ParentContainer;
