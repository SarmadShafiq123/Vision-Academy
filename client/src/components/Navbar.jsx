import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/vision.png';

const navLinks = [
  { name: 'Home',    path: '/' },
  { name: 'About',   path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Contact', path: '/contact' },
];

/** Sun/Moon toggle button — shared between desktop and mobile */
function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
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
      {isDark
        ? <Sun  size={18} strokeWidth={1.75} />
        : <Moon size={18} strokeWidth={1.75} />}
    </button>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location                    = useLocation();
  const prefersReduced              = useReducedMotion();

  // Glassmorphism kicks in once the user scrolls past 10px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-[#0d1425]/85 backdrop-blur-md shadow-[0_4px_24px_rgba(26,58,143,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
          : 'bg-white dark:bg-[#0d1425] shadow-sm dark:shadow-[0_1px_0_rgba(42,51,82,0.8)]',
      ].join(' ')}
      initial={prefersReduced ? false : { y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo — dark mode wrapper only in dark */}
          <Link
            to="/"
            className="flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            {/* Light mode: no wrapper. Dark mode: white pill so dark-blue logo stays readable */}
            <div className="rounded-xl px-2 py-1 dark:bg-white dark:rounded-xl dark:px-2 dark:py-1">
              <img src={logo} alt="Vision Academy" className="h-12" />
            </div>
          </Link>

          {/* Desktop Navigation + Theme Toggle */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
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
                      transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Desktop theme toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + hamburger */}
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

        {/* Mobile Navigation */}
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
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="pb-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={[
                        'block py-2 px-2 rounded-xl font-semibold transition-colors',
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
