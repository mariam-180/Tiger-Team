import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const StyledContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'sx',
})(({theme, backgroundimage, secondbackground, sx}) => ({
  'position': 'relative',
  'minHeight': '100vh',
  'display': 'flex',
  'flexDirection': 'column',
  'justifyContent': 'center',
  'alignItems': 'center',
  'background': `url(${backgroundimage}) no-repeat center center fixed`,
  'overflow': 'hidden',
  'backgroundSize': 'cover',
  'backgroundPosition': 'center',
  'backgroundAttachment': 'fixed',
  'width': '100vw',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,
    backgroundAttachment: 'fixed',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: theme.spacing(20),
    height: theme.spacing(20),
    backgroundimage: `url(${secondbackground})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 1,
  },
  [theme.breakpoints.up('md')]: {
    '&::after': {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  },
  [theme.breakpoints.up('lg')]: {
    '&::after': {
      width: theme.spacing(30),
      height: theme.spacing(30),
    },
  },
  [theme.breakpoints.up('xl')]: {
    '&::after': {
      width: theme.spacing(40),
      height: theme.spacing(40),
    },
  },
  ...sx,
}));

const BackgroundContainer = ({
  backgroundimage, secondbackground, children, sx,
}) => {
  return (
    <StyledContainer
      sx={sx}
      backgroundimage={backgroundimage}
      secondbackground={secondbackground}
    >
      {children}
    </StyledContainer>
  );
};

BackgroundContainer.propTypes = {
  backgroundimage: PropTypes.string.isRequired,
  secondbackground: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

export default BackgroundContainer;
