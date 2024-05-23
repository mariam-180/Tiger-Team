import React from 'react';
import PropTypes from 'prop-types';
import {Navigate} from 'react-router-dom';
import {useAuth} from 'authContext';
import {useSnackbar} from 'context/SnackbarContext';

export const roleHierarchy = {
  SUPER_USER: '3',
  EMPLOYEE_USER: '2',
  END_USER: '1',
};

export const RoleBasedPrivateRoute = ({element: Component, requiredRole}) => {
  const {accessToken, tokenValid, userRole} = useAuth();
  const {showSnackbar} = useSnackbar();

  if (!accessToken || !tokenValid) {
    showSnackbar('You need to log in first to access that page', 'warning');
    return <Navigate to="/Registration" />;
  }
  if (userRole < roleHierarchy[requiredRole]) {
    showSnackbar(
        'You do not have the required permissions to access this page',
        'error',
    );
    return <Navigate to="/" />;
  }

  return Component;
};

RoleBasedPrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRole: PropTypes.string.isRequired,
};

