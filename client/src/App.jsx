import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgressBar from './components/ScrollProgressBar';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen, { isFirstLoad } from './components/LoadingScreen';

const Home     = lazy(() => import('./pages/Home'));
const About    = lazy(() => import('./pages/About'));
const Courses  = lazy(() => import('./pages/Courses'));
const Contact  = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * CursorField — global 3D ambient background.
 * Lazy-loaded so it never delays the first paint of page content.
 * Mounted once here, outside the route tree, so it persists across
 * all page navigations without ever remounting.
 */
const CursorField = lazy(() => import('./components/CursorField'));

// Evaluated once when the module loads — determines first-visit splash
const showSplash = isFirstLoad();

/** Resets scroll position to top on every route change, before the new page fades in. */
function RouteScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Page-level fade wrapper */
function PageWrapper({ children }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReduced ? {} : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      {/* Fires before the fade-in of each new page — no conflict with AnimatePresence */}
      <RouteScrollReset />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/"        element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about"   element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/courses" element={<PageWrapper><Courses /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        {/* 404 catch-all */}
        <Route path="*"        element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(showSplash);

  return (
    <Router>
      {/* ── Branded initial-load splash (first visit only) ── */}
      <LoadingScreen show={loading} onDone={() => setLoading(false)} />

      {/* ── Scroll progress bar (top of viewport) ─────────── */}
      <ScrollProgressBar />

      {/*
       * CursorField: fixed full-viewport 3D ambient background.
       * Outside the route tree so it never remounts on navigation.
       */}
      <Suspense fallback={null}>
        <CursorField />
      </Suspense>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="min-h-screen" />}>
            <AnimatedRoutes />
          </Suspense>
        </main>
        <Footer />
      </div>

      {/* ── Scroll-to-top FAB ────────────────────────────── */}
      <ScrollToTop />
    </Router>
  );
}
