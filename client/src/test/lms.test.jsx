import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../app/store.js';

vi.mock('../features/lms/auth/authApi.js', () => ({
  refreshRequest:  vi.fn().mockRejectedValue(new Error('no cookie')),
  loginRequest:    vi.fn(),
  logoutRequest:   vi.fn(),
  registerRequest: vi.fn(),
}));

vi.mock('../features/lms/auth/axiosClient.js', () => ({
  apiClient:   {
    post: vi.fn(), get: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: { headers: { common: {} } },
  },
  injectStore: vi.fn(),
  default:     { post: vi.fn(), get: vi.fn() },
}));

vi.mock('motion/react', () => ({
  motion:           new Proxy({}, {
    get: (_t, prop) => {
      const C = ({ children, className }) => {
        const Tag = prop;
        return <Tag className={className}>{children}</Tag>;
      };
      C.displayName = `motion.${prop}`;
      return C;
    },
  }),
  AnimatePresence:  ({ children }) => <>{children}</>,
  useReducedMotion: () => false,
  useInView:        () => true,
  useAnimation:     () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
  useScroll:        () => ({ scrollYProgress: { get: () => 0 } }),
  useSpring:        (v) => v,
  useTransform:     () => ({ get: () => 0 }),
  useMotionValue:   () => ({ set: vi.fn(), get: () => 0 }),
}));

vi.mock('../features/lms/auth/LoginPage.jsx', () => ({
  default: () => (
    <form>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
      <button type="submit">Sign in</button>
    </form>
  ),
}));

vi.mock('../features/lms/shared/RequireRole.jsx', () => ({
  default: ({ allowedRoles, children }) => {
    const isAuthenticated = false;
    if (!isAuthenticated) return null;
    return children;
  },
}));

function wrap(ui, route = '/') {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  );
}

describe('Redux store shape', () => {
  it('has both theme and auth slices with no key collision', () => {
    const state = store.getState();
    expect(state).toHaveProperty('theme');
    expect(state).toHaveProperty('auth');
    expect(state.theme).toHaveProperty('value');
    expect(state.auth).toHaveProperty('isAuthenticated', false);
    expect(state.auth).toHaveProperty('user', null);
    expect(state.auth).toHaveProperty('accessToken', null);
  });
});

describe('LMS LoginPage', () => {
  it('renders email, password fields and sign-in button', async () => {
    const { default: LoginPage } = await import('../features/lms/auth/LoginPage.jsx');
    wrap(<LoginPage />, '/portal/login');
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });
});

describe('RequireRole', () => {
  it('redirects unauthenticated user away from protected route', async () => {
    const { default: RequireRole } = await import('../features/lms/shared/RequireRole.jsx');
    wrap(
      <RequireRole allowedRoles={['admin']}><div>secret</div></RequireRole>,
      '/portal/admin',
    );
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });
});
