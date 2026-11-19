import React from 'react';
import {
  People,
  Event,
  Report,
  EventAvailable,
  ShoppingCart,
  Store,
  Settings,
  Videocam,
} from '@mui/icons-material';

const Admin = React.lazy(() => import('layouts/pages/admin'));
const AdminUsers = React.lazy(() => import('layouts/pages/admin/users'));
const AdminEvents = React.lazy(() => import('layouts/pages/admin/events'));
const AdminReports = React.lazy(() => import('layouts/pages/admin/reports'));
const AdminReservation = React.lazy(
  () => import('layouts/pages/admin/reservation'),
);
const AdminOrders = React.lazy(() => import('layouts/pages/admin/orders'));
const AdminProducts = React.lazy(() => import('layouts/pages/admin/products'));
const AdminControllers = React.lazy(
  () => import('layouts/pages/admin/controllers'),
);
const AdminStreaming = React.lazy(
  () => import('layouts/pages/admin/streaming'),
);

const adminRoutes = [
  {
    name: 'Admin',
    route: '/admin',
    component: <Admin />,
    requiredRole: 'SUPER_USER',
  },
  {
    name: 'Users',
    route: '/admin/users',
    component: <AdminUsers />,
    requiredRole: 'SUPER_USER',
  },
  {
    name: 'Reservations',
    route: '/admin/reservations',
    component: <AdminReservation />,
    requiredRole: 'SUPER_USER',
  },
  {
    name: 'Events',
    route: '/admin/events',
    component: <AdminEvents />,
    requiredRole: 'SUPER_USER',
  },
  {
    name: 'Reports',
    route: '/admin/reports',
    component: <AdminReports />,
    requiredRole: 'SUPER_USER',
  },
  {
    name: 'Orders',
    route: '/admin/orders',
    component: <AdminOrders />,
    requiredRole: 'SUPER_USER',
  },
  {
    name: 'Products',
    route: '/admin/products',
    component: <AdminProducts />,
    requiredRole: 'SUPER_USER',
  },
  {
    name: 'Controllers',
    route: '/admin/controllers',
    component: <AdminControllers />,
    requiredRole: 'SUPER_USER',
  },
  {
    name: 'Streaming',
    route: '/admin/streaming',
    component: <AdminStreaming />,
    requiredRole: 'SUPER_USER',
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
    title: 'Reservations',
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
    title: 'Products',
    icon: <Store />,
    color: '#9c27b0',
    component: <AdminProducts />,
    route: '/admin/products',
  },
  {
    title: 'Controllers',
    icon: <Settings />,
    color: '#3f51b5',
    component: <AdminControllers />,
    route: '/admin/controllers',
  },
  {
    title: 'Streaming',
    icon: <Videocam />,
    color: '#00897b',
    component: <AdminStreaming />,
    route: '/admin/streaming',
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
