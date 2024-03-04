import React from 'react';
import {Box, styled} from '@mui/material';
import PropTypes from 'prop-types';

const StyledContainer = styled(Box)({
  'position': 'relative',
  'width': '100vw',
  'height': '100vh',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'overflow': 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.3)',
  },
  '& video': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 'auto',
    height: '100%',
    transform: 'translate(-50%, -50%)',
    filter: 'brightness(70%)',
  },
  '& video:after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});

const VideoBackgroundContainer = ({children, videoURL}) => {
  return (
    <StyledContainer>
      <video
        autoPlay={true}
        playsInline
        muted
        loop
        style={{objectFit: 'cover', width: '100%', height: '140%'}}
        controls={false}
      >
        <source src={videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Box position="absolute" zIndex="1" color="black" p={4}>
        {children}
      </Box>
    </StyledContainer>
  );
};

VideoBackgroundContainer.propTypes = {
  children: PropTypes.node.isRequired,
  videoURL: PropTypes.string.isRequired,
};

export default VideoBackgroundContainer;
