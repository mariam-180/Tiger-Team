import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Box, styled, Typography } from '@mui/material';

import logoIMG from 'assets/images/logos/logo.png';

const ContainerBase = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sx',
})(({ theme, background, secondbackground, layouttype, sx }) => ({
  position: 'relative',
  textAlign: 'center',
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  backgroundImage: `url(${background})`,
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
    backgroundImage: `url(${secondbackground})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 1,
  },
  '& .items-container': {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    ...layoutStyles(layouttype, theme),
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
  [theme.breakpoints.down('sm')]: {
    backgroundAttachment: 'scroll',
  },
}));

function layoutStyles(layouttype, theme) {
  return layouttype === 'row'
    ? {
        [theme.breakpoints.down('sm')]: {
          gap: theme.spacing(1),
          '& .item': {
            flexBasis: '100%',
          },
        },
        [theme.breakpoints.between('sm', 'md')]: {
          gap: theme.spacing(6),
          '& .item': {
            flexBasis: 'calc(50% - 16px)',
          },
        },
        [theme.breakpoints.up('md')]: {
          gap: theme.spacing(8),
          '& .item': {
            flexBasis: 'calc(33.33% - 16px)',
          },
        },
        [theme.breakpoints.up('lg')]: {
          gap: theme.spacing(12),
          '& .item': {
            flexBasis: 'calc(33.33% - 16px)',
          },
        },
      }
    : {};
}

export default function StyledContainer({
  children,
  background,
  secondbackground,
  layouttype,
  sx,
  titleText,
  noLogo = false,
}) {
  const backgroundtype = background
    ? background.endsWith('.mp4')
      ? 'video'
      : 'image'
    : 'image';

  return (
    <ContainerBase
      layouttype={layouttype}
      backgroundtype={backgroundtype}
      secondbackground={
        noLogo ? '' : secondbackground ? secondbackground : logoIMG
      }
      sx={sx}
      style={
        backgroundtype === 'image'
          ? { backgroundImage: `url(${background})` }
          : {}
      }
    >
      {backgroundtype === 'video' && (
        <video
          muted
          autoPlay={true}
          playsInline
          loop
          className="background-video"
        >
          <source src={background} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {titleText && (
        <Box
          sx={{
            paddingY: 2,
            paddingX: 4,
            backgroundColor: '#656565',
            borderRadius: '15px',
            display: 'inline-block',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h1" fontWeight="bold" sx={{ color: '#FFFFFF' }}>
            {titleText}
          </Typography>
        </Box>
      )}

      <div className="items-container">{children}</div>
    </ContainerBase>
  );
}

StyledContainer.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string.isRequired,
  secondbackground: PropTypes.string,
  layouttype: PropTypes.oneOf(['row', 'column']),
  sx: PropTypes.object,
  titleText: PropTypes.string,
  noLogo: PropTypes.bool,
};
