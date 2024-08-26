import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'assets/theme';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from 'authContext';
import { SnackbarProvider } from 'context/SnackbarContext';
import { LoginRequiredProvider } from 'context/LoginRequiredContext';

import Home from 'layouts/pages/home';
import LoginRequired from 'layouts/pages/loginRequired';
import Reservations from 'layouts/pages/reservations';
import ResetPassword from 'layouts/pages/resetPassword';
import routes from 'routes';
import { adminRoutes } from 'adminRoutes';

import {
  fetchControllers,
  performActionsBasedOnControllers,
} from 'utils/controllers';

function App() {
  const { pathname } = useLocation();

  const [isLiveRouteEnabled, setIsLiveRouteEnabled] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    const loadLiveRouteStatus = async () => {
      try {
        const controllers = await fetchControllers(accessToken);
        performActionsBasedOnControllers(controllers, (name, value) => {
          if (name === 'LiveRouteEnabled') {
            setIsLiveRouteEnabled(value);
          }
        });
      } catch (error) {
        console.error('Error fetching LiveRouteEnabled controller:', error);
      }
    };

    loadLiveRouteStatus();
  }, []);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route, index) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        if (route.name === 'Live' && !isLiveRouteEnabled) {
          return null;
        }

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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login-required" element={<LoginRequired />} />
              <Route path="/reservations/*" element={<Reservations />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {getRoutes(routes)}
              {getRoutes(adminRoutes)}
            </Routes>
          </LoginRequiredProvider>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
