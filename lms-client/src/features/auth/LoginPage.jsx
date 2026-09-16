import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice.js';
import { loginRequest } from './authApi.js';
import { ROLE_DASHBOARD } from '../../shared/theme/constants.js';
import logo from '../../shared/assets/vision-logo-transparent.png';

const FIELD_EMAIL    = 'email';
const FIELD_PASSWORD = 'password';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [fields, setFields]   = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken, user } = await loginRequest(fields);
      dispatch(setCredentials({ accessToken, user }));
      navigate(ROLE_DASHBOARD[user.role] ?? '/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Vision Academy" className="h-14 mb-4" />
          <h1 className="text-2xl font-bold text-primary-600 tracking-wide">
            LMS Portal
          </h1>
          <p className="text-sm text-neutral-500 mt-1 tracking-brand uppercase">
            Vision Academy
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 px-8 py-10">
          <h2 className="text-lg font-semibold text-neutral-800 mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor={FIELD_EMAIL}
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id={FIELD_EMAIL}
                name={FIELD_EMAIL}
                type="email"
                autoComplete="email"
                required
                value={fields.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-60 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor={FIELD_PASSWORD}
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Password
              </label>
              <input
                id={FIELD_PASSWORD}
                name={FIELD_PASSWORD}
                type="password"
                autoComplete="current-password"
                required
                value={fields.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-60 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          &copy; {new Date().getFullYear()} Vision Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
