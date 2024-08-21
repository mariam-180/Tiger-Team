import React from 'react';
import {
  People,
  Event,
  Report,
  EventAvailable,
  ShoppingCart,
} from '@mui/icons-material'; // Import ShoppingCart icon
import RoleBasedPrivateRoute from 'roleBasedPrivateRoute';

import Home from 'layouts/pages/home';
import Admin from 'layouts/pages/admin';
import AdminUsers from 'layouts/pages/admin/users';
import AdminEvents from 'layouts/pages/admin/events';
import AdminReports from 'layouts/pages/admin/reports';
import AdminReservation from 'layouts/pages/admin/reservation';
import AdminOrders from 'layouts/pages/admin/orders'; // Import AdminOrders component

const adminRoutes = [
  {
    name: 'Home',
    route: '/',
    component: <Home />,
    requiredRole: null,
  },
  {
    name: 'Admin',
    route: '/admin',
    component: (
      <RoleBasedPrivateRoute element={<Admin />} requiredRole="EMPLOYEE_USER" />
    ),
    requiredRole: 'EMPLOYEE_USER',
  },
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
  {
    name: 'Orders',
    route: '/admin/orders',
    component: (
      <RoleBasedPrivateRoute
        element={<AdminOrders />}
        requiredRole="EMPLOYEE_USER"
      />
    ),
    requiredRole: 'EMPLOYEE_USER',
  },
];

const sections = [
  {
    title: 'Users',
    icon: <People />,
    color: '#d32f2f',
    component: <AdminUsers />,
    route: '/admin/users',
  },
  {
    title: 'Events',
    icon: <Event />,
    color: '#1976d2',
    component: <AdminEvents />,
    route: '/admin/events',
  },
  {
    title: 'Reservation',
    icon: <EventAvailable />,
    color: '#fbc02d',
    component: <AdminReservation />,
    route: '/admin/reservations',
  },
  {
    title: 'Orders',
    icon: <ShoppingCart />,
    color: '#ff9800',
    component: <AdminOrders />,
    route: '/admin/orders',
  },
  {
    title: 'Reports',
    icon: <Report />,
    color: '#388e3c',
    component: <AdminReports />,
    route: '/admin/reports',
  },
];

export { adminRoutes, sections };
