/**
 * Smoke tests — verify pages render without crashing.
 *
 * jsdom has no WebGL, so we stub @react-three/fiber, @react-three/drei,
 * and three before any component import touches them.
 *
 * motion/react is stubbed to return plain element wrappers so that
 * layout effects and RAF-dependent code don't cause noise in jsdom.
 *
 * CursorField is lazy-imported in App.jsx but tested pages import
 * their own modules directly, so the Three.js stubs below only need
 * to cover any transitive imports that flow through those pages.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── 0. Stub @emailjs/browser (prevents real network calls in tests) ──────────
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

// Import the mock reference once at module level so we can control it per-test
import emailjsMock from '@emailjs/browser';

// ── 1. Stub three (no WebGL in jsdom) ────────────────────────────────────────
vi.mock('three', () => ({
  default: {},
  WebGLRenderer: vi.fn(),
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  BufferGeometry: vi.fn(),
  BufferAttribute: vi.fn(),
  PointsMaterial: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  IcosahedronGeometry: vi.fn(),
  Points: vi.fn(),
  Mesh: vi.fn(),
  AmbientLight: vi.fn(),
  PointLight: vi.fn(),
  Float32Array,
}));

// ── 2. Stub @react-three/fiber ────────────────────────────────────────────────
vi.mock('@react-three/fiber', () => ({
  Canvas:   ({ children, ...props }) => <div data-testid="r3f-canvas" {...props}>{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: { position: { x: 0, y: 0, z: 8 }, lookAt: vi.fn() },
  })),
}));

// ── 3. Stub @react-three/drei ─────────────────────────────────────────────────
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Environment:   () => null,
}));

// ── 4. Stub motion/react — keeps tests fast, no RAF/layout effects ────────────
vi.mock('motion/react', async () => {
  const { forwardRef } = await import('react');

  // Motion-specific props that must NOT be forwarded to DOM elements
  const MOTION_PROPS = new Set([
    'initial', 'animate', 'exit', 'variants', 'transition',
    'whileHover', 'whileTap', 'whileFocus', 'whileInView', 'whileDrag',
    'viewport', 'layoutId', 'layout', 'drag', 'dragConstraints',
    'onAnimationStart', 'onAnimationComplete', 'onUpdate',
  ]);

  return {
    motion: new Proxy({}, {
      get: (_target, prop) => {
        const El = forwardRef(({ children, className, style, ...rest }, ref) => {
          const Tag = prop;
          const domProps = Object.fromEntries(
            Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k)),
          );
          return <Tag ref={ref} className={className} style={style} {...domProps}>{children}</Tag>;
        });
        El.displayName = `motion.${prop}`;
        return El;
      },
    }),
    AnimatePresence: ({ children }) => <>{children}</>,
    useReducedMotion: () => false,
    useInView: () => true,
    useAnimation: () => ({ start: vi.fn() }),
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
// Test 1 — Navbar renders all four nav links
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
// Test 2 — Home page renders without crashing
// ─────────────────────────────────────────────────────────────────────────────
describe('Home page', () => {
  it('renders without crashing', async () => {
    const { default: Home } = await import('../pages/Home');
    renderWithRouter(<Home />);

    expect(
      screen.getByText(/Empowering Minds/i),
    ).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3 — Courses page renders both sections
// ─────────────────────────────────────────────────────────────────────────────
describe('Courses page', () => {
  it('renders Academic Programs section heading', async () => {
    const { default: Courses } = await import('../pages/Courses');
    renderWithRouter(<Courses />);

    expect(
      screen.getByRole('heading', { name: /Academic Programs/i }),
    ).toBeInTheDocument();
  });

  it('renders Skill Development Courses section heading', async () => {
    const { default: Courses } = await import('../pages/Courses');
    renderWithRouter(<Courses />);

    expect(
      screen.getByRole('heading', { name: /Skill Development Courses/i }),
    ).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 4 — Contact page form fields render correctly
// ─────────────────────────────────────────────────────────────────────────────
describe('Contact page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  /** Helper: fill and submit the contact form */
  async function fillAndSubmit() {
    fireEvent.change(screen.getByLabelText(/Your Name/i),     { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Your Message/i),  { target: { value: 'Hello!' } });
    const form = screen.getByLabelText(/Your Name/i).closest('form');
    await act(async () => {
      fireEvent.submit(form);
    });
  }

  it('shows "Sending…" while the form is submitting', async () => {
    emailjsMock.send.mockReturnValueOnce(new Promise(() => {}));

    const { default: Contact } = await import('../pages/Contact');
    renderWithRouter(<Contact />);

    fireEvent.change(screen.getByLabelText(/Your Name/i),     { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Your Message/i),  { target: { value: 'Hello!' } });
    const form = screen.getByLabelText(/Your Name/i).closest('form');
    act(() => { fireEvent.submit(form); });

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
