import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Typography } from '@mui/material';

const titles = {
  info: 'Update',
  success: 'Completed',
  warning: 'Please check',
  error: 'Something needs attention',
};
const NotificationToast = React.forwardRef(function NotificationToast(
  { message, severity = 'info', onClose, ...rest },
  ref,
) {
  return (
    <Alert
      {...rest}
      ref={ref}
      severity={severity}
      role={severity === 'error' ? 'alert' : 'status'}
      onClose={onClose}
      sx={{
        width: '100%',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        bgcolor: '#24171d',
        color: '#f9f4f6',
        border: '1px solid #713041',
        borderLeft: '4px solid #eb294b',
        borderRadius: '16px',
        boxShadow: '0 14px 45px #0008',
        '& .MuiAlert-icon': {
          color: severity === 'success' ? '#8cdeb2' : '#ff6c86',
          opacity: 1,
        },
        '& .MuiAlert-message': { minWidth: 0 },
        '& .MuiAlert-action': { color: '#e1bdc8', alignSelf: 'flex-start' },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="div"
          sx={{
            color: '#ff8fa4',
            fontSize: '0.65rem',
            fontWeight: 900,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            mb: 0.5,
          }}
        >
          {titles[severity] || titles.info}
        </Typography>
        <Typography
          component="div"
          sx={{
            color: 'inherit',
            fontSize: '.85rem',
            lineHeight: 1.6,
            overflowWrap: 'anywhere',
            whiteSpace: 'pre-line',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Alert>
  );
});
NotificationToast.propTypes = {
  message: PropTypes.node.isRequired,
  severity: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  onClose: PropTypes.func,
};
export default NotificationToast;
