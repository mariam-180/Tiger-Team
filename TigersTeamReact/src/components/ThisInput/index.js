import React, { forwardRef } from 'react';

import PropTypes from 'prop-types';

import InputRoot from 'components/ThisInput/InputRoot';

const Input = forwardRef(({ error, success, disabled, ...rest }, ref) => (
  <InputRoot {...rest} ref={ref} ownerState={{ error, success, disabled }} />
));

Input.displayName = 'Input';

Input.defaultProps = {
  error: false,
  success: false,
  disabled: false,
};

Input.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Input;
