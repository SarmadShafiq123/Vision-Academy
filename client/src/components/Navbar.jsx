import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, useTransform } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, toggleTheme } from '../store/slices/themeSlice';
import { useLenisScroll } from '../hooks/useLenisScroll';
import logo from '../assets/vision-logo-transparent.png';

const NAV_LINKS = [
  { name: 'Home',    path: '/' },
  { name: 'About',   path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Contact', path: '/contact' },
];

const SCROLL_GLASS_RANGE_PX      = [0, 120];
const SCROLL_BLUR_MAX_PX         = 14;
const SCROLL_BG_OPACITY_DARK     = [1, 0.88];
const SCROLL_BG_OPACITY_LIGHT    = [1, 0.82];
const SCROLL_SHADOW_OPACITY      = [0.03, 0.14];
const NAV_ENTER_OFFSET_PX        = -64;
const NAV_ENTER_DURATION_S       = 0.4;
const UNDERLINE_SPRING_STIFFNESS = 380;
const UNDERLINE_SPRING_DAMPING   = 30;
const MOBILE_MENU_DURATION_S     = 0.25;

function ThemeToggle({ className = '' }) {
  const theme    = useSelector(selectTheme);
  const dispatch = useDispatch();
  const isDark   = theme === 'dark';

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
        'bg-blue-100 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50',
        'text-[#1a3a8f] dark:text-blue-300',
        'hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
        className,
      ].join(' ')}
    >
      {isDark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
    </button>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location                    = useLocation();
  const prefersReduced              = useReducedMotion();
  const theme                       = useSelector(selectTheme);
  const isDark                      = theme === 'dark';

  const { scrollY } = useLenisScroll();

  const bgOpacity = useTransform(
    scrollY,
    SCROLL_GLASS_RANGE_PX,
    isDark ? SCROLL_BG_OPACITY_DARK : SCROLL_BG_OPACITY_LIGHT,
  );
  const blurPx   = useTransform(scrollY, SCROLL_GLASS_RANGE_PX, [0, SCROLL_BLUR_MAX_PX]);
  const shadowOp = useTransform(scrollY, SCROLL_GLASS_RANGE_PX, SCROLL_SHADOW_OPACITY);

  const bgColorMV  = useTransform(bgOpacity, (v) =>
    isDark ? `rgba(13,20,37,${v})` : `rgba(255,255,255,${v})`
  );
  const backdropMV = useTransform(blurPx,    (v) => `blur(${v}px)`);
  const shadowMV   = useTransform(shadowOp,  (v) =>
    isDark
      ? `0 4px 24px rgba(0,0,0,${v * 2})`
      : `0 4px 24px rgba(26,58,143,${v})`
  );

  return (
    <motion.nav
      className="sticky top-0 z-50 overflow-hidden"
      initial={prefersReduced ? false : { y: NAV_ENTER_OFFSET_PX, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: NAV_ENTER_DURATION_S, ease: 'easeOut' }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor:      bgColorMV,
          backdropFilter:       backdropMV,
          WebkitBackdropFilter: backdropMV,
          boxShadow:            shadowMV,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link
            to="/"
            className="flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            <img src={logo} alt="Vision Academy" className="h-12" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={[
                    'font-semibold transition-colors relative pb-1',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded',
                    isActive
                      ? 'text-[#1a3a8f] dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#1a3a8f] dark:hover:text-blue-300',
                  ].join(' ')}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#1a3a8f] dark:bg-blue-300 rounded-full"
                      transition={
                        prefersReduced
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: UNDERLINE_SPRING_STIFFNESS, damping: UNDERLINE_SPRING_DAMPING }
                      }
                    />
                  )}
                </Link>
              );
            })}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              className={[
                'p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a2540] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
              ].join(' ')}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {isMenuOpen
                  ? <path d="M6 18L18 6M6 6l12 12" />
                  : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-nav"
              role="navigation"
              aria-label="Mobile navigation"
              className="md:hidden overflow-hidden"
              initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={prefersReduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={prefersReduced   ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: MOBILE_MENU_DURATION_S, ease: 'easeInOut' }}
            >
              <div className="pb-4 space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={[
                        'block py-3 px-3 rounded-xl font-semibold transition-colors min-h-[44px] flex items-center',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
                        isActive
                          ? 'text-[#1a3a8f] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40'
                          : 'text-gray-600 dark:text-gray-300 hover:text-[#1a3a8f] dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-[#1a2540]',
                      ].join(' ')}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
