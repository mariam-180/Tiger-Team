import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const TransparentContainer = styled(Box)(({ theme, sx, base }) => ({
  position: 'relative',
  zIndex: 1,
  width: '90%',
  maxWidth: '800px',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  boxShadow: '0 3px 5px 2px rgba(255, 255, 255, 5.3)',
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '10px',
  marginTop: !base ? '15%' : '0%',
  [theme.breakpoints.down('md')]: {
    marginTop: !base ? '20%' : '0%',
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: !base ? '25%' : '0%',
  },
  ...sx,
}));

const TransparentBox = ({ children, base, sx }) => {
  return (
    <TransparentContainer base={base} sx={sx}>
      {children}
    </TransparentContainer>
  );
};

TransparentBox.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.any,
  base: PropTypes.bool,
};
export default TransparentBox;
