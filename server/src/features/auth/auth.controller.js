import { loginUser, createUser, verifyRefreshToken, signAccessToken } from './auth.service.js';
import { User } from '../users/user.model.js';
import { COOKIE_REFRESH_TOKEN, ROLES } from '../../shared/config/constants.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly:  true,
  secure:    process.env.NODE_ENV === 'production',
  sameSite:  'strict',
  maxAge:    7 * 24 * 60 * 60 * 1000,
};

/**
 * POST /api/auth/login
 * Open route — returns access token in body, refresh token in httpOnly cookie.
 */
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { accessToken, refreshToken, user } = await loginUser({ email, password });
    res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, REFRESH_COOKIE_OPTIONS);
    return res.json({ accessToken, user });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
}

/**
 * POST /api/auth/register
 * Admin-only — protected by requireAuth + requireRole(['admin']) in routes.
 */
export async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'name, email, password, and role are required' });
  }

  try {
    const user = await createUser({ name, email, password, role });
    return res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    return res.status(err.status || 500).json({ message: err.message });
  }
}

/**
 * POST /api/auth/refresh
 * Uses the httpOnly refresh token cookie to issue a new access token.
 */
export async function refresh(req, res) {
  const token = req.cookies?.[COOKIE_REFRESH_TOKEN];
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const { id } = verifyRefreshToken(token);
    const user   = await User.findById(id).select('-passwordHash');
    if (!user || !user.isActive) return res.status(401).json({ message: 'User not found or inactive' });

    const accessToken = signAccessToken({ id: user._id.toString(), email: user.email, role: user.role });
    return res.json({
      accessToken,
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

/**
 * POST /api/auth/logout
 * Clears the refresh token cookie.
 */
export async function logout(_req, res) {
  res.clearCookie(COOKIE_REFRESH_TOKEN, REFRESH_COOKIE_OPTIONS);
  return res.json({ message: 'Logged out' });
}
