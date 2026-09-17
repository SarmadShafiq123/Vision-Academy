import axios from 'axios';
import { setCredentials, clearCredentials } from './authSlice.js';

const API_BASE_URL         = import.meta.env.VITE_API_BASE_URL ?? '';
const REFRESH_ENDPOINT     = '/api/auth/refresh';
const LOGOUT_ENDPOINT      = '/api/auth/logout';
const AUTHORIZATION_HEADER = 'Authorization';

let injectedStore = null;

/**
 * Injects the Redux store into the axios client after the store is created,
 * breaking the circular dependency between store → authSlice ← axiosClient → store.
 * Must be called once from app/store.js after configureStore().
 * @param {import('@reduxjs/toolkit').EnhancedStore} store
 */
export function injectStore(store) {
  injectedStore = store;
}

export const apiClient = axios.create({
  baseURL:         API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = injectedStore?.getState().auth.accessToken;
  if (token) {
    config.headers[AUTHORIZATION_HEADER] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing    = false;
let pendingRequests = [];

function processPending(error, token = null) {
  pendingRequests.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  pendingRequests = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((token) => {
        original.headers[AUTHORIZATION_HEADER] = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing    = true;

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${REFRESH_ENDPOINT}`,
        {},
        { withCredentials: true },
      );
      injectedStore?.dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      processPending(null, data.accessToken);
      original.headers[AUTHORIZATION_HEADER] = `Bearer ${data.accessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      processPending(refreshError);
      injectedStore?.dispatch(clearCredentials());
      await axios.post(`${API_BASE_URL}${LOGOUT_ENDPOINT}`, {}, { withCredentials: true }).catch(() => {});
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
