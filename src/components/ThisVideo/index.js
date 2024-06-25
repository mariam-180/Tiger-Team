import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const ResponsiveVideo = ({ videoSrc, ismuted, iscontrolled, isslider }) => {
  return (
    <Box
      sx={{
        width: '100%',
        paddingTop: '56.25%',
        position: 'relative',
      }}
    >
      <video
        id="ResponsiveVideo"
        src={videoSrc}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          background: '#000000',
        }}
        muted={ismuted}
        autoPlay={isslider ? true : ismuted}
        loop
        playsInline
        controls={iscontrolled ? true : false}
      />
    </Box>
  );
};

ResponsiveVideo.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  ismuted: PropTypes.bool,
  isslider: PropTypes.bool,
  iscontrolled: PropTypes.bool,
};

export default ResponsiveVideo;
