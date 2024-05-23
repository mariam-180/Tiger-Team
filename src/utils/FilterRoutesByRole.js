import {roleHierarchy} from 'roleBasedPrivateRoute';

const filterRoutesByRole = (routes, userRole) => {
  return routes.filter((route) => {
    return (
      !route.requiredRole ||
      userRole >= roleHierarchy[route.requiredRole]
    );
  });
};

export default filterRoutesByRole;
