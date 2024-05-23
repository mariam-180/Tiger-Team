import React, {useEffect} from 'react'; // Import React
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'assets/theme';

import {Routes, Route, useLocation} from 'react-router-dom';
import {AuthProvider} from 'authContext';
import {SnackbarProvider} from 'context/SnackbarContext';

import Home from 'layouts/pages/home';
import Snokardo from 'layouts/pages/snokardo';

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Reservations/Snokardo" element={<Snokardo />} />
            {getRoutes(routes)}
          </Routes>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
