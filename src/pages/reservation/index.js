import React from 'react';
import { useAuth } from 'authContext';

import Single from 'pages/reservation/single_pc';
import Multiple from 'pages/reservation/multiple_pc';

export const roleHierarchy = {
  SUPER_USER: '3',
  EMPLOYEE_USER: '2',
  END_USER: '1',
};

const Reservation = () => {
  const { userRole, accessToken, tokenValid } = useAuth();
  if (
    roleHierarchy[userRole] < roleHierarchy['EMPLOYEE_USER'] ||
    !accessToken ||
    !tokenValid
  ) {
    return <Single />;
  } else {
    return <Multiple />;
  }
};

Reservation.propTypes = {};

export default Reservation;
