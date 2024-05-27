import React, {useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'assets/theme';
import {Routes, Route, useLocation} from 'react-router-dom';
import {AuthProvider} from 'authContext';
import {SnackbarProvider} from 'context/SnackbarContext';
import {LoginRequiredProvider} from 'context/LoginRequiredContext';

import Home from 'layouts/pages/home'; ;
import LoginRequired from 'layouts/pages/loginRequired';
import Reservations from 'layouts/pages/reservations';
import routes from 'routes';

function App() {
  const {pathname} = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route, index) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
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
              {getRoutes(routes)}
            </Routes>
          </LoginRequiredProvider>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
