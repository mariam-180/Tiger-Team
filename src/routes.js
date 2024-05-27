import React from 'react';
import PrivateRoute from 'privateRoutes';
import RoleBasedPrivateRoute from 'roleBasedPrivateRoute';

import Home from 'layouts/pages/home';
import Champion from 'layouts/pages/champion';
import Registration from 'layouts/pages/registrationPage';
import QA from 'layouts/pages/qa';
import Reservations from 'layouts/pages/reservations';
// import Live from 'layouts/pages/live';

const routes = [
  {
    name: 'Home',
    route: '/',
    component: <Home />,
    requiredRole: null,
  },
  {
    name: 'championship',
    route: '/championship',
    component: <Champion />,
    requiredRole: null,
  },
  {
    name: 'Registration',
    route: '/registration',
    component: <Registration />,
    requiredRole: null,
  },
  {
    name: 'Reservations',
    route: '/reservations',
    component: <Reservations />,
  },
  {
    name: 'QA',
    route: '/QA',
    component: <PrivateRoute element={<QA />} />,
    requiredRole: null,
  },
  {
    name: 'QAPrivate',
    route: '/QA/Private',
    component: (
      <RoleBasedPrivateRoute element={<QA />} requiredRole="SUPER_USER" />
    ),
    requiredRole: 'SUPER_USER',
  },
  // {
  //   name: 'QA',
  //   route: '/QA',
  //   component: <QA />,
  //   requiredRole: null,
  // },
];
export default routes;
