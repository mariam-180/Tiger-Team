export const roleHierarchy = { SUPER_USER: 3, EMPLOYEE_USER: 2, END_USER: 1 };
export const isStaffRole = (role) => role === 'SUPER_USER';

export function navigationForRole(routes, role) {
  if (isStaffRole(role))
    return [
      { name: 'Admin dashboard', route: '/admin', requiredRole: 'SUPER_USER' },
    ];
  return routes.filter(
    (route) =>
      !route.requiredRole ||
      (roleHierarchy[role] || 0) >= roleHierarchy[route.requiredRole],
  );
}
