import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import BoxRoot from 'components/ThisBox/BoxRoot';

const CUBox = forwardRef(
    (
        {
          variant,
          bgColor,
          color,
          opacity,
          borderRadius,
          shadow,
          coloredShadow,
          ...rest
        },
        ref,
    ) => (
      <BoxRoot
        {...rest}
        ref={ref}
        ownerState={{
          variant,
          bgColor,
          color,
          opacity,
          borderRadius,
          shadow,
          coloredShadow,
        }}
      />
    ),
);

// Setting default values for the props of CUBox
CUBox.defaultProps = {
  variant: 'contained',
  bgColor: 'transparent',
  color: 'dark',
  opacity: 1,
  borderRadius: 'none',
  shadow: 'none',
  coloredShadow: 'none',
};

// Typechecking props for the CUBox
CUBox.propTypes = {
  variant: PropTypes.oneOf(['contained', 'gradient']),
  bgColor: PropTypes.string,
  color: PropTypes.string,
  opacity: PropTypes.number,
  borderRadius: PropTypes.string,
  shadow: PropTypes.string,
  coloredShadow: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
    'none',
  ]),
};

// Assigning display name to the component
CUBox.displayName = 'CUBox';

export default CUBox;
