import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice.js';
import { refreshRequest } from './authApi.js';

/**
 * Attempts to rehydrate the Redux auth state on app mount by calling
 * the refresh endpoint with the httpOnly cookie. Returns a `ready`
 * boolean that is false until the attempt completes, preventing a
 * flash-redirect to /login while the check is in flight.
 *
 * @returns {{ ready: boolean }}
 */
export function useAuthRehydrate() {
  const dispatch   = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    refreshRequest()
      .then(({ accessToken, user }) => {
        dispatch(setCredentials({ accessToken, user }));
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [dispatch]);

  return { ready };
}
