import jwt from 'jsonwebtoken';

/**
 * Verifies the Bearer access token in the Authorization header.
 * Attaches the decoded payload to req.user on success.
 * Rejects with 401 on missing, malformed, or expired token.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}
