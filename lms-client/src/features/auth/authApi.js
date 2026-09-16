import apiClient from './axiosClient.js';

const LOGIN_ENDPOINT    = '/api/auth/login';
const LOGOUT_ENDPOINT   = '/api/auth/logout';
const REFRESH_ENDPOINT  = '/api/auth/refresh';
const REGISTER_ENDPOINT = '/api/auth/register';

/**
 * Sends login credentials and returns { accessToken, user }.
 * @param {{ email: string, password: string }} credentials
 */
export async function loginRequest(credentials) {
  const { data } = await apiClient.post(LOGIN_ENDPOINT, credentials);
  return data;
}

/**
 * Calls the refresh endpoint to rehydrate the session.
 * Uses the httpOnly refresh cookie automatically.
 * @returns {Promise<{ accessToken: string, user: object }>}
 */
export async function refreshRequest() {
  const { data } = await apiClient.post(REFRESH_ENDPOINT);
  return data;
}

/**
 * Clears the server-side refresh token cookie.
 */
export async function logoutRequest() {
  await apiClient.post(LOGOUT_ENDPOINT);
}

/**
 * Admin-only — creates a new user account.
 * @param {{ name: string, email: string, password: string, role: string }} payload
 */
export async function registerRequest(payload) {
  const { data } = await apiClient.post(REGISTER_ENDPOINT, payload);
  return data;
}
