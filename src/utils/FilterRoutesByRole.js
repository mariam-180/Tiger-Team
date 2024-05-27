import {roleHierarchy} from 'roleBasedPrivateRoute';

const filterRoutesByRole = (routes, userRole) => {
  return routes.filter((route) => {
    return (
      !route.requiredRole ||
      roleHierarchy[userRole] >= roleHierarchy[route.requiredRole]
    );
  });
};

export default filterRoutesByRole;
