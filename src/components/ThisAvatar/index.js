import React, { forwardRef } from 'react';

import PropTypes from 'prop-types';

import ThisAvatarRoot from 'components/ThisAvatar/AvatarRoot';

const ThisAvatar = forwardRef(({ bgColor, size, shadow, ...rest }, ref) => (
  <ThisAvatarRoot ref={ref} ownerState={{ shadow, bgColor, size }} {...rest} />
));

ThisAvatar.displayName = 'ThisAvatar';

ThisAvatar.defaultProps = {
  bgColor: 'transparent',
  size: 'md',
  shadow: 'none',
};

ThisAvatar.propTypes = {
  bgColor: PropTypes.oneOf([
    'transparent',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  shadow: PropTypes.oneOf([
    'none',
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    'xxl',
    'inset',
  ]),
};

export default ThisAvatar;
