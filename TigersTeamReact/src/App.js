import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PageErrorBoundary from 'components/PageErrorBoundary';
import LoadingScreen from 'components/LoadingScreen';
import CustomerPage from 'components/CustomerPage';
import theme from 'assets/theme';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider } from 'authContext';
import { SnackbarProvider } from 'context/SnackbarContext';
import { LoginRequiredProvider } from 'context/LoginRequiredContext';

import Home from 'layouts/pages/home';
const LoginRequired = React.lazy(() => import('layouts/pages/loginRequired'));
const Reservations = React.lazy(() => import('layouts/pages/reservations'));
const ResetPassword = React.lazy(() => import('layouts/pages/resetPassword'));

import { getRoutesList } from 'routes';
import { adminRoutes } from 'adminRoutes';
import RoleBasedPrivateRoute from 'roleBasedPrivateRoute';

function App() {
  const routes = getRoutesList();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route, index) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && route.route !== '/reservations') {
        const key = route.key || `${route.route}-${index}`;
        return (
          <Route exact path={route.route} element={route.component} key={key} />
        );
      }

      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SnackbarProvider>
          <LoginRequiredProvider>
            <PageErrorBoundary resetKey={pathname}>
              <React.Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <CustomerPage adminPath="/admin">
                        <Home />
                      </CustomerPage>
                    }
                  />
                  <Route path="/login-required" element={<LoginRequired />} />
                  <Route
                    path="/reservations/*"
                    element={
                      <CustomerPage adminPath="/admin/reservations">
                        <Reservations />
                      </CustomerPage>
                    }
                  />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  {getRoutes(routes)}
                  <Route
                    path="/admin"
                    element={
                      <RoleBasedPrivateRoute
                        element={<Outlet />}
                        requiredRole="SUPER_USER"
                      />
                    }
                  >
                    {adminRoutes.map((route) =>
                      route.route === '/admin' ? (
                        <Route
                          index
                          element={route.component}
                          key={route.route}
                        />
                      ) : (
                        <Route
                          path={route.route.slice('/admin/'.length)}
                          element={route.component}
                          key={route.route}
                        />
                      ),
                    )}
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </React.Suspense>
            </PageErrorBoundary>
          </LoginRequiredProvider>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
