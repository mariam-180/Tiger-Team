import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'authContext';

import BeatLoaderUtil from 'utils/beatLoader';

import { useSnackbar } from 'context/SnackbarContext';
import { useLoginRequired } from 'context/LoginRequiredContext';

export const roleHierarchy = {
  SUPER_USER: '3',
  EMPLOYEE_USER: '2',
  END_USER: '1',
};

const RoleBasedPrivateRoute = ({ element: Component, requiredRole }) => {
  const { accessToken, tokenValid, userRole, loading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { showLoginRequired } = useLoginRequired();
  const location = useLocation();

  if (loading) {
    return <BeatLoaderUtil loading={loading} />;
  }

  if (!accessToken || !tokenValid) {
    showSnackbar('You need to log in first to access that page', 'warning');
    showLoginRequired();
    return <Navigate to="/login-required" state={{ from: location }} />;
  }

  if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
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

export default RoleBasedPrivateRoute;
