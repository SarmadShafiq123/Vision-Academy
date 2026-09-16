import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectRole } from '../../features/auth/authSlice.js';
import { ROUTES } from '../theme/constants.js';

/**
 * Route guard that checks authentication and role.
 * Redirects unauthenticated users to /login preserving the attempted path.
 * Redirects authenticated users with the wrong role to their own dashboard.
 *
 * @param {{ allowedRoles: string[], children: React.ReactNode }} props
 */
export default function RequireRole({ allowedRoles, children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectRole);
  const location        = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    const fallback = ROUTES[role?.toUpperCase()] ?? ROUTES.LOGIN;
    return <Navigate to={fallback} replace />;
  }

  return children;
}
