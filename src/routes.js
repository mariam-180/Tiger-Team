import React from 'react';
import RoleBasedPrivateRoute from 'roleBasedPrivateRoute';

import Home from 'layouts/pages/home';
import Champion from 'layouts/pages/champion';
import Registration from 'layouts/pages/registrationPage';
import Reservations from 'layouts/pages/reservations';
import Profile from 'layouts/pages/profile';
import Admin from 'layouts/pages/admin';
import Product from 'layouts/pages/product';
import Live from 'layouts/pages/live';
import QA from 'layouts/pages/qa';

// const useRouteStatuses = () => {
//   const [statuses, setStatuses] = useState({
//     isLiveRouteEnabled: false,
//     isQARouteEnabled: false,
//     isLoading: true,
//   });

//   useEffect(() => {
//     const loadRouteStatuses = async () => {
//       try {
//         const REACT_APP_ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;
//         const isQARouteEnabled = REACT_APP_ENVIRONMENT === 'Non-Prod';

//         const controllers = await fetchControllers();
//         const liveRouteController = getControllerByName(
//           controllers,
//           'LivePageEnabled',
//         );
//         const isLiveRouteEnabled =
//           liveRouteController && liveRouteController.value === 'true';

//         setStatuses({
//           isLiveRouteEnabled,
//           isQARouteEnabled,
//           isLoading: false,
//         });
//       } catch (error) {
//         console.error('Error fetching route statuses:', error);
//         setStatuses((prevState) => ({ ...prevState, isLoading: false }));
//       }
//     };

//     loadRouteStatuses();
//   }, []);

//   return statuses;
// };

export const getRoutesList = () => {
  // const { isLiveRouteEnabled, isQARouteEnabled, isLoading } =
  //   useRouteStatuses();

  // if (isLoading) return [];
  const isLiveRouteEnabled = false;
  const isQARouteEnabled = false;

  const routes = [
    {
      name: 'Home',
      route: '/',
      component: <Home />,
      requiredRole: null,
    },
    {
      name: 'Championship',
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
      name: 'Products',
      route: '/products',
      component: <Product />,
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
        <RoleBasedPrivateRoute
          element={<Admin />}
          requiredRole="EMPLOYEE_USER"
        />
      ),
      requiredRole: 'EMPLOYEE_USER',
    },
  ];

  if (isLiveRouteEnabled) {
    routes.push({
      name: 'Live',
      route: '/live',
      component: <Live />,
      requiredRole: null,
    });
  }

  if (isQARouteEnabled) {
    routes.push({
      name: 'QA',
      route: '/QA',
      component: <QA />,
      requiredRole: null,
    });
  }

  return routes;
};

export default getRoutesList;
