import React from 'react';
import PropTypes from 'prop-types';
import {Navigate} from 'react-router-dom';
import {useAuth} from 'authContext';
import {useSnackbar} from 'context/SnackbarContext';

const PrivateRoute = ({element: Component}) => {
  const {accessToken, tokenValid} = useAuth();
  const {showSnackbar} = useSnackbar();

  if (!accessToken || !tokenValid) {
    showSnackbar('You need to log in first to access that page', 'warning');
    return <Navigate to="/Registration" />;
  }

  return Component;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
