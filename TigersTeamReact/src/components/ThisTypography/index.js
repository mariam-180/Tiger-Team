import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import TypographyRoot from 'components/ThisTypography/TypographyRoot';

const Typography = forwardRef(
  (
    {
      color,
      fontWeight,
      textTransform,
      verticalAlign,
      textGradient,
      opacity,
      children,
      shiny,
      waving,
      ...rest
    },
    ref,
  ) => (
    <TypographyRoot
      {...rest}
      ref={ref}
      ownerState={{
        color,
        textTransform,
        verticalAlign,
        fontWeight,
        opacity,
        textGradient,
        shiny,
        waving,
      }}
    >
      {children}
    </TypographyRoot>
  ),
);

// Setting default values for the props of Typography
Typography.defaultProps = {
  color: 'dark',
  fontWeight: false,
  textTransform: 'none',
  verticalAlign: 'unset',
  textGradient: false,
  shiny: false,
  waving: false,
  opacity: 1,
};

// Typechecking props for the Typography
Typography.propTypes = {
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
    'text',
    'white',
    'darkRed',
  ]),
  fontWeight: PropTypes.oneOf([false, 'light', 'regular', 'medium', 'bold']),
  textTransform: PropTypes.oneOf([
    'none',
    'capitalize',
    'uppercase',
    'lowercase',
  ]),
  verticalAlign: PropTypes.oneOf([
    'unset',
    'baseline',
    'sub',
    'super',
    'text-top',
    'text-bottom',
    'middle',
    'top',
    'bottom',
  ]),
  textGradient: PropTypes.bool,
  children: PropTypes.node.isRequired,
  opacity: PropTypes.number,
  shiny: PropTypes.bool,
  waving: PropTypes.bool,
};

// Assigning display name to the component
Typography.displayName = 'Typography';

export default Typography;
