import React from 'react';
// import PrivateRoute from 'privateRoutes';
import RoleBasedPrivateRoute from 'roleBasedPrivateRoute';

import Home from 'layouts/pages/home';
import Champion from 'layouts/pages/champion';
import Registration from 'layouts/pages/registrationPage';
import Reservations from 'layouts/pages/reservations';
import Profile from 'layouts/pages/profile';
import Admin from 'layouts/pages/admin';
// import QA from 'layouts/pages/qa';
import Product from 'layouts/pages/product';
import Live from 'layouts/pages/live';

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
    name: 'Product',
    route: '/product',
    component: <Product />,
    requiredRole: null,
  },
  {
    name: 'Live',
    route: '/Live',
    component: <Live />,
    requiredRole: null,
  },
  {
    name: 'Profile',
    route: '/profile',
    component: (
      <RoleBasedPrivateRoute element={<Profile />} requiredRole="END_USER" />
    ),
    requiredRole: 'END_USER',
  },
  {
    name: 'Admin',
    route: '/admin',
    component: (
      <RoleBasedPrivateRoute element={<Admin />} requiredRole="EMPLOYEE_USER" />
    ),
    requiredRole: 'EMPLOYEE_USER',
  },
  // {
  //   name: 'QAPrivate',
  //   route: '/QA/Private',
  //   component: (
  //     <RoleBasedPrivateRoute element={<Live />} requiredRole="SUPER_USER" />
  //   ),
  //   requiredRole: 'SUPER_USER',
  // },
  // {
  //   name: 'QA',
  //   route: '/QA',
  //   // component: <PrivateRoute element={<QA />} />,
  //   component: <QA />,
  //   requiredRole: null,
  // },
];
export default routes;
