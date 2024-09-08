import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const SnapScrollParent = ({ children }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        '& > *': {
          scrollSnapAlign: 'start',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f0f0f0',
        },
      }}
    >
      {children}
    </Box>
  );
};

SnapScrollParent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SnapScrollParent;
