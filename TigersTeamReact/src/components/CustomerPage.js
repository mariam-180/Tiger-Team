import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'authContext';
import LoadingScreen from 'components/LoadingScreen';
import { isStaffRole } from 'utils/accountRoles.mjs';

export default function CustomerPage({ children, adminPath }) {
  const { userRole, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isStaffRole(userRole) ? <Navigate to={adminPath} replace /> : children;
}
CustomerPage.propTypes = {
  children: PropTypes.node.isRequired,
  adminPath: PropTypes.string.isRequired,
};
