import React from 'react';

import PropTypes from 'prop-types';

import Box from 'components/ThisBox';

function DashboardLayout({ children }) {
  return (
    <Box
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: 'relative',
        [breakpoints.up('xl')]: {
          transition: transitions.create(['margin-left', 'margin-right'], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        overflow: 'hidden',
      })}
    >
      {children}
    </Box>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
