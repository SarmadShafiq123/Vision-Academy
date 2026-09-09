/**
 * Smoke tests — verify pages render without crashing.
 *
 * jsdom has no WebGL, so we stub @react-three/fiber, @react-three/drei,
 * and three before any component import touches them.
 *
 * motion/react is stubbed to return plain element wrappers so layout
 * effects and RAF-dependent code don't cause noise in jsdom.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── 0. Stub @emailjs/browser ─────────────────────────────────────────────────
vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}));
import emailjsMock from '@emailjs/browser';

// ── 1. Stub three ────────────────────────────────────────────────────────────
vi.mock('three', () => ({
  default: {},
  WebGLRenderer: vi.fn(), Scene: vi.fn(), PerspectiveCamera: vi.fn(),
  BufferGeometry: vi.fn(), BufferAttribute: vi.fn(), PointsMaterial: vi.fn(),
  MeshStandardMaterial: vi.fn(), IcosahedronGeometry: vi.fn(),
  Points: vi.fn(), Mesh: vi.fn(), AmbientLight: vi.fn(), PointLight: vi.fn(),
  Float32Array,
}));

// ── 2. Stub @react-three/fiber ───────────────────────────────────────────────
vi.mock('@react-three/fiber', () => ({
  Canvas:   ({ children, ...props }) => <div data-testid="r3f-canvas" {...props}>{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: { position: { x: 0, y: 0, z: 8 }, lookAt: vi.fn() } })),
}));

// ── 3. Stub @react-three/drei ────────────────────────────────────────────────
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Environment:   () => null,
}));

// ── 4. Stub motion/react ─────────────────────────────────────────────────────
vi.mock('motion/react', async () => {
  const { forwardRef } = await import('react');

  const MOTION_PROPS = new Set([
    'initial', 'animate', 'exit', 'variants', 'transition',
    'whileHover', 'whileTap', 'whileFocus', 'whileInView', 'whileDrag',
    'viewport', 'layoutId', 'layout', 'drag', 'dragConstraints',
    'onAnimationStart', 'onAnimationComplete', 'onUpdate',
    'style', // motion components accept style but we strip to avoid DOM noise
  ]);

  const makeEl = (prop) => {
    const El = forwardRef(({ children, className, ...rest }, ref) => {
      const Tag = prop;
      const domProps = Object.fromEntries(
        Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k)),
      );
      return <Tag ref={ref} className={className} {...domProps}>{children}</Tag>;
    });
    El.displayName = `motion.${prop}`;
    return El;
  };

  // A no-op AnimationControls mock returned by useAnimation
  const mockControls = { start: vi.fn(), stop: vi.fn(), set: vi.fn() };

  return {
    motion: new Proxy({}, { get: (_t, prop) => makeEl(prop) }),
    AnimatePresence: ({ children }) => <>{children}</>,
    useReducedMotion: () => false,
    useInView:        () => true,
    useAnimation:     () => mockControls,
    // Scroll hooks used by ScrollProgressBar
    useScroll:  () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring:  (val) => val,
    useTransform: (_val, _from, _to) => ({ get: () => 0 }),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 1 — Navbar
// ─────────────────────────────────────────────────────────────────────────────
describe('Navbar', () => {
  it('renders all 4 navigation links', async () => {
    const { default: Navbar } = await import('../components/Navbar');
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2 — Home page
// ─────────────────────────────────────────────────────────────────────────────
describe('Home page', () => {
  it('renders without crashing', async () => {
    const { default: Home } = await import('../pages/Home');
    renderWithRouter(<Home />);
    expect(screen.getByText(/Empowering Minds/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3 — Courses page
// ─────────────────────────────────────────────────────────────────────────────
describe('Courses page', () => {
  it('renders Academic Programs section heading', async () => {
    const { default: Courses } = await import('../pages/Courses');
    renderWithRouter(<Courses />);
    expect(screen.getByRole('heading', { name: /Academic Programs/i })).toBeInTheDocument();
  });

  it('renders Skill Development Courses section heading', async () => {
    const { default: Courses } = await import('../pages/Courses');
    renderWithRouter(<Courses />);
    expect(screen.getByRole('heading', { name: /Skill Development Courses/i })).toBeInTheDocument();
  });

  it('filter toggle hides Academic section when Skill Courses selected', async () => {
    const { default: Courses } = await import('../pages/Courses');
    renderWithRouter(<Courses />);

    // Both sections visible by default
    expect(screen.getByRole('heading', { name: /Academic Programs/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Skill Development/i })).toBeInTheDocument();

    // Click "Skill Courses" filter
    fireEvent.click(screen.getByRole('button', { name: /Skill Courses/i }));

    expect(screen.queryByRole('heading', { name: /Academic Programs/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Skill Development/i })).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 4 — Contact page
// ─────────────────────────────────────────────────────────────────────────────
describe('Contact page', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders Name, Email, and Message form fields', async () => {
    const { default: Contact } = await import('../pages/Contact');
    renderWithRouter(<Contact />);
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Message/i)).toBeInTheDocument();
  });

  it('renders the Submit button', async () => {
    const { default: Contact } = await import('../pages/Contact');
    renderWithRouter(<Contact />);
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  async function fillAndSubmit() {
    fireEvent.change(screen.getByLabelText(/Your Name/i),     { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Your Message/i),  { target: { value: 'Hello!' } });
    const form = screen.getByLabelText(/Your Name/i).closest('form');
    await act(async () => { fireEvent.submit(form); });
  }

  it('shows "Sending…" while the form is submitting', async () => {
    emailjsMock.send.mockReturnValueOnce(new Promise(() => {}));
    const { default: Contact } = await import('../pages/Contact');
    renderWithRouter(<Contact />);

    fireEvent.change(screen.getByLabelText(/Your Name/i),     { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Your Message/i),  { target: { value: 'Hello!' } });
    act(() => { fireEvent.submit(screen.getByLabelText(/Your Name/i).closest('form')); });

    expect(await screen.findByRole('button', { name: /Sending/i })).toBeInTheDocument();
  });

  it('shows success message after successful submission', async () => {
    emailjsMock.send.mockResolvedValueOnce({ status: 200, text: 'OK' });
    const { default: Contact } = await import('../pages/Contact');
    renderWithRouter(<Contact />);
    await fillAndSubmit();
    expect(await screen.findByText(/Message sent/i)).toBeInTheDocument();
  });

  it('shows error message when emailjs.send fails', async () => {
    emailjsMock.send.mockRejectedValueOnce(new Error('Network error'));
    const { default: Contact } = await import('../pages/Contact');
    renderWithRouter(<Contact />);
    await fillAndSubmit();
    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 5 — NotFound page
// ─────────────────────────────────────────────────────────────────────────────
describe('NotFound page', () => {
  it('renders 404 heading and back-to-home link', async () => {
    const { default: NotFound } = await import('../pages/NotFound');
    renderWithRouter(<NotFound />);
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Home/i })).toBeInTheDocument();
  });
});
