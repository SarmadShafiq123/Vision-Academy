/**
 * Role guard — reads role from the JWT payload already attached by requireAuth.
 * No DB lookup on every request; role is trusted from the signed token.
 * Must be used after requireAuth in the middleware chain.
 *
 * @param {string[]} allowedRoles - e.g. ['admin'] or ['admin','teacher']
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    return next();
  };
}
