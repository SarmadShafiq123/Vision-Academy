import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectRole } from '../auth/authSlice.js';
import { PORTAL_ROUTES } from './constants.js';

/**
 * Route guard for LMS portal routes. Checks authentication and role.
 * Unauthenticated users are redirected to /portal/login, preserving the
 * attempted path in location state. Authenticated users with the wrong role
 * are redirected to their own portal dashboard.
 *
 * @param {{ allowedRoles: string[], children: React.ReactNode }} props
 */
export default function RequireRole({ allowedRoles, children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectRole);
  const location        = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PORTAL_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    const fallback = PORTAL_ROUTES[role?.toUpperCase()] ?? PORTAL_ROUTES.LOGIN;
    return <Navigate to={fallback} replace />;
  }

  return children;
}
