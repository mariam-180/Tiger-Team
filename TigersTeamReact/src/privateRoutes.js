import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'authContext';

import BeatLoaderUtil from 'utils/beatLoader';

import { useSnackbar } from 'context/SnackbarContext';
import { useLoginRequired } from 'context/LoginRequiredContext';

const PrivateRoute = ({ element: Component }) => {
  const { accessToken, tokenValid, loading } = useAuth();
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

  return Component;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
