import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'authContext';

import AdminWorkspace from 'pages/admin/AdminWorkspace';
import LoadingScreen from 'components/LoadingScreen';

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
  const hasRole =
    Number(roleHierarchy[userRole] || 0) >=
    Number(roleHierarchy[requiredRole] || Infinity);

  useEffect(() => {
    if (loading) return;
    if (!accessToken || !tokenValid) {
      showSnackbar('You need to log in first to access that page', 'warning');
      showLoginRequired();
    } else if (!hasRole) {
      showSnackbar(
        'You do not have the required permissions to access this page',
        'error',
      );
    }
  }, [
    loading,
    accessToken,
    tokenValid,
    hasRole,
    showSnackbar,
    showLoginRequired,
  ]);

  if (loading) {
    return <LoadingScreen label="Checking your session" />;
  }

  if (!accessToken || !tokenValid) {
    return <Navigate to="/login-required" state={{ from: location }} />;
  }

  if (!hasRole) {
    return <Navigate to="/" />;
  }

  return location.pathname === '/admin' ||
    location.pathname.startsWith('/admin/') ? (
    <AdminWorkspace>{Component}</AdminWorkspace>
  ) : (
    Component
  );
};

RoleBasedPrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRole: PropTypes.string.isRequired,
};

export default RoleBasedPrivateRoute;
