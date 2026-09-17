import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../app/store.js';

vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}));
import emailjsMock from '@emailjs/browser';

vi.mock('three', () => ({
  default: {},
  WebGLRenderer: vi.fn(), Scene: vi.fn(), PerspectiveCamera: vi.fn(),
  BufferGeometry: vi.fn(), BufferAttribute: vi.fn(), PointsMaterial: vi.fn(),
  MeshStandardMaterial: vi.fn(), IcosahedronGeometry: vi.fn(),
  Points: vi.fn(), Mesh: vi.fn(), AmbientLight: vi.fn(), PointLight: vi.fn(),
  Float32Array,
}));

vi.mock('@react-three/fiber', () => ({
  Canvas:   ({ children, ...props }) => <div data-testid="r3f-canvas" {...props}>{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: { position: { x: 0, y: 0, z: 8 }, lookAt: vi.fn() } })),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Environment:   () => null,
}));

vi.mock('../lib/lenis', () => ({
  initLenis:    vi.fn(),
  destroyLenis: vi.fn(),
  getLenis:     () => null,
}));

vi.mock('../features/lms/auth/authApi.js', () => ({
  refreshRequest:  vi.fn().mockRejectedValue(new Error('no cookie')),
  loginRequest:    vi.fn(),
  logoutRequest:   vi.fn(),
  registerRequest: vi.fn(),
}));

vi.mock('../features/lms/auth/axiosClient.js', () => ({
  apiClient:   { post: vi.fn(), get: vi.fn(), interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } } },
  injectStore: vi.fn(),
  default:     { post: vi.fn(), get: vi.fn() },
}));

vi.mock('motion/react', async () => {
  const { forwardRef } = await import('react');
  const MOTION_PROPS = new Set([
    'initial','animate','exit','variants','transition','whileHover','whileTap',
    'whileFocus','whileInView','whileDrag','viewport','layoutId','layout',
    'drag','dragConstraints','onAnimationStart','onAnimationComplete','onUpdate','style',
  ]);
  const makeEl = (prop) => {
    const El = forwardRef(({ children, className, ...rest }, ref) => {
      const Tag = prop;
      const domProps = Object.fromEntries(Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k)));
      return <Tag ref={ref} className={className} {...domProps}>{children}</Tag>;
    });
    El.displayName = `motion.${prop}`;
    return El;
  };
  const mockControls = { start: vi.fn(), stop: vi.fn(), set: vi.fn() };
  return {
    motion:           new Proxy({}, { get: (_t, prop) => makeEl(prop) }),
    AnimatePresence:  ({ children }) => <>{children}</>,
    useReducedMotion: () => false,
    useInView:        () => true,
    useAnimation:     () => mockControls,
    useScroll:        () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring:        (val) => val,
    useTransform:     (_val, _from, _to) => ({ get: () => 0 }),
    useMotionValue:   (_init) => ({ set: vi.fn(), get: () => 0 }),
  };
});

function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  );
}

describe('Navbar', () => {
  it('renders all 4 navigation links', async () => {
    const { default: Navbar } = await import('../components/Navbar.jsx');
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});

describe('Home page', () => {
  it('renders without crashing', async () => {
    const { default: Home } = await import('../pages/Home.jsx');
    renderWithRouter(<Home />);
    expect(screen.getByText(/Empowering Minds/i)).toBeInTheDocument();
  });
});

describe('Courses page', () => {
  it('renders Academic Programs heading', async () => {
    const { default: Courses } = await import('../pages/Courses.jsx');
    renderWithRouter(<Courses />);
    expect(screen.getByRole('heading', { name: /Academic Programs/i })).toBeInTheDocument();
  });

  it('renders Skill Development Courses heading', async () => {
    const { default: Courses } = await import('../pages/Courses.jsx');
    renderWithRouter(<Courses />);
    expect(screen.getByRole('heading', { name: /Skill Development Courses/i })).toBeInTheDocument();
  });

  it('filter toggle hides Academic when Skill Courses selected', async () => {
    const { default: Courses } = await import('../pages/Courses.jsx');
    renderWithRouter(<Courses />);
    expect(screen.getByRole('heading', { name: /Academic Programs/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Skill Courses/i }));
    expect(screen.queryByRole('heading', { name: /Academic Programs/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Skill Development/i })).toBeInTheDocument();
  });
});

describe('Contact page', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders form fields', async () => {
    const { default: Contact } = await import('../pages/Contact.jsx');
    renderWithRouter(<Contact />);
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Message/i)).toBeInTheDocument();
  });

  it('renders Submit button', async () => {
    const { default: Contact } = await import('../pages/Contact.jsx');
    renderWithRouter(<Contact />);
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  it('shows Sending while submitting', async () => {
    emailjsMock.send.mockReturnValueOnce(new Promise(() => {}));
    const { default: Contact } = await import('../pages/Contact.jsx');
    renderWithRouter(<Contact />);
    fireEvent.change(screen.getByLabelText(/Your Name/i),     { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Your Message/i),  { target: { value: 'Hi' } });
    act(() => { fireEvent.submit(screen.getByLabelText(/Your Name/i).closest('form')); });
    expect(await screen.findByRole('button', { name: /Sending/i })).toBeInTheDocument();
  });

  it('shows success on resolved send', async () => {
    emailjsMock.send.mockResolvedValueOnce({ status: 200, text: 'OK' });
    const { default: Contact } = await import('../pages/Contact.jsx');
    renderWithRouter(<Contact />);
    fireEvent.change(screen.getByLabelText(/Your Name/i),     { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Your Message/i),  { target: { value: 'Hi' } });
    await act(async () => { fireEvent.submit(screen.getByLabelText(/Your Name/i).closest('form')); });
    expect(await screen.findByText(/Message sent/i)).toBeInTheDocument();
  });

  it('shows error on rejected send', async () => {
    emailjsMock.send.mockRejectedValueOnce(new Error('fail'));
    const { default: Contact } = await import('../pages/Contact.jsx');
    renderWithRouter(<Contact />);
    fireEvent.change(screen.getByLabelText(/Your Name/i),     { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Your Message/i),  { target: { value: 'Hi' } });
    await act(async () => { fireEvent.submit(screen.getByLabelText(/Your Name/i).closest('form')); });
    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
  });
});

describe('NotFound page', () => {
  it('renders 404 and back link', async () => {
    const { default: NotFound } = await import('../pages/NotFound.jsx');
    renderWithRouter(<NotFound />);
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Home/i })).toBeInTheDocument();
  });
});
