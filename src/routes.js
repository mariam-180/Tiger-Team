import React from 'react';
// import PrivateRoute from 'privateRoutes';
import RoleBasedPrivateRoute from 'roleBasedPrivateRoute';

import Home from 'layouts/pages/home';
import Champion from 'layouts/pages/champion';
import Registration from 'layouts/pages/registrationPage';
import AdminUsers from 'layouts/pages/admin/users';
import AdminEvents from 'layouts/pages/admin/events';
import AdminReports from 'layouts/pages/admin/reports';
import AdminReservation from 'layouts/pages/admin/reservation';
import Reservations from 'layouts/pages/reservations';
import Profile from 'layouts/pages/profile';
// import QA from 'layouts/pages/qa';
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
    name: 'Profile',
    route: '/profile',
    component: (
      <RoleBasedPrivateRoute element={<Profile />} requiredRole="END_USER" />
    ),
    requiredRole: 'END_USER',
  },
  {
    name: 'Admin',
    collapse: [
      {
        name: 'Users',
        route: '/admin/users',
        component: (
          <RoleBasedPrivateRoute
            element={<AdminUsers />}
            requiredRole="EMPLOYEE_USER"
          />
        ),
        requiredRole: 'EMPLOYEE_USER',
      },
      {
        name: 'Reservations',
        route: '/admin/reservations',
        component: (
          <RoleBasedPrivateRoute
            element={<AdminReservation />}
            requiredRole="EMPLOYEE_USER"
          />
        ),
        requiredRole: 'EMPLOYEE_USER',
      },
      {
        name: 'Events',
        route: '/admin/events',
        component: (
          <RoleBasedPrivateRoute
            element={<AdminEvents />}
            requiredRole="EMPLOYEE_USER"
          />
        ),
        requiredRole: 'EMPLOYEE_USER',
      },
      {
        name: 'Reports',
        route: '/admin/reports',
        component: (
          <RoleBasedPrivateRoute
            element={<AdminReports />}
            requiredRole="SUPER_USER"
          />
        ),
        requiredRole: 'SUPER_USER',
      },
    ],
    requiredRole: 'EMPLOYEE_USER',
  },
  // {
  //   name: 'QAPrivate',
  //   route: '/QA/Private',
  //   component: (
  //     <RoleBasedPrivateRoute element={<QA />} requiredRole="SUPER_USER" />
  //   ),
  //   requiredRole: 'SUPER_USER',
  // },
  // {
  //   name: 'QA',
  //   route: '/QA',
  //   component: <QA />,
  //   requiredRole: null,
  // },
  // {
  //   name: 'QA',
  //   route: '/QA',
  //   component: <PrivateRoute element={<QA />} />,
  //   requiredRole: null,
  // },
];
export default routes;
