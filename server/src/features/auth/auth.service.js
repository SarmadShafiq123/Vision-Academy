import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../users/user.model.js';
import { BCRYPT_SALT_ROUNDS, ROLES } from '../../shared/config/constants.js';

/**
 * Hashes a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>}
 */
export async function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);
}

/**
 * Compares a plain-text password against a stored hash.
 * @param {string} plain
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Signs a short-lived JWT access token containing id, email, and role.
 * @param {{ id: string, email: string, role: string }} payload
 * @returns {string}
 */
export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
}

/**
 * Signs a long-lived JWT refresh token.
 * @param {{ id: string }} payload
 * @returns {string}
 */
export function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Verifies and decodes a refresh token.
 * @param {string} token
 * @returns {{ id: string }}
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

/**
 * Creates a new user. Intended for admin-only use.
 * @param {{ name: string, email: string, password: string, role: string }} data
 * @returns {Promise<import('../users/user.model.js').User>}
 */
export async function createUser({ name, email, password, role }) {
  const passwordHash = await hashPassword(password);
  return User.create({ name, email, passwordHash, role });
}

/**
 * Attempts login — returns { accessToken, refreshToken, user } or throws.
 * @param {{ email: string, password: string }} credentials
 */
export async function loginUser({ email, password }) {
  const user = await User.findOne({ email, isActive: true });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
  const accessToken  = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken({ id: user._id.toString() });

  return {
    accessToken,
    refreshToken,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  };
}
