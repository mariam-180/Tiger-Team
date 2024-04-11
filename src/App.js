import React, {useEffect} from 'react'; // Import React
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'assets/theme';

import {Routes, Route, useLocation} from 'react-router-dom';

import Home from 'layouts/pages/home';
// import Registration from 'layouts/pages/registrationPage';

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
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/Registration" element={<Registration />} /> */}
        {getRoutes(routes)}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
