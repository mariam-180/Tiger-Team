import React from 'react';
import RoleBasedPrivateRoute from 'roleBasedPrivateRoute';
import CustomerPage from 'components/CustomerPage';

import Home from 'layouts/pages/home';
const Champion = React.lazy(() => import('layouts/pages/champion'));
const Registration = React.lazy(() => import('layouts/pages/registrationPage'));
const Reservations = React.lazy(() => import('layouts/pages/reservations'));
const Profile = React.lazy(() => import('layouts/pages/profile'));
const Product = React.lazy(() => import('layouts/pages/product'));
const Live = React.lazy(() => import('layouts/pages/live'));
const QA = React.lazy(() => import('layouts/pages/qa'));
// Public routes must exist on the first render, including direct URL visits.
export const getRoutesList = () => {
  const routes = [
    {
      name: 'Home',
      route: '/',
      component: (
        <CustomerPage adminPath="/admin">
          <Home />
        </CustomerPage>
      ),
      requiredRole: null,
    },
    {
      name: 'Championship',
      route: '/championship',
      component: (
        <CustomerPage adminPath="/admin/events">
          <Champion />
        </CustomerPage>
      ),
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
      name: 'Products',
      route: '/products',
      component: (
        <CustomerPage adminPath="/admin/products">
          <Product />
        </CustomerPage>
      ),
      requiredRole: null,
    },
    {
      name: 'Live',
      route: '/live',
      component: <Live />,
      requiredRole: null,
    },
    {
      name: 'Profile',
      route: '/profile',
      component: (
        <CustomerPage adminPath="/admin/users">
          <RoleBasedPrivateRoute
            element={<Profile />}
            requiredRole="END_USER"
          />
        </CustomerPage>
      ),
      requiredRole: 'END_USER',
    },
  ];

  routes.push({
    name: 'Help & FAQ',
    route: '/QA',
    component: (
      <CustomerPage adminPath="/admin">
        <QA />
      </CustomerPage>
    ),
    requiredRole: null,
  });

  return routes;
};

export default getRoutesList;
