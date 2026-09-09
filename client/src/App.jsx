import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home    = lazy(() => import('./pages/Home'));
const About   = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const Contact = lazy(() => import('./pages/Contact'));

/**
 * CursorField — global 3D ambient background.
 * Lazy-loaded so it never delays the first paint of page content.
 * Mounted once here, outside the route tree, so it persists across
 * all page navigations without ever remounting.
 */
const CursorField = lazy(() => import('./components/CursorField'));

/** Page-level fade wrapper — must live inside Router so useLocation works */
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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"        element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about"   element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/courses" element={<PageWrapper><Courses /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      {/*
       * CursorField sits outside the route tree so it never remounts on
       * navigation. fallback={null} — it's purely decorative; its absence
       * during the brief lazy-load window causes no visible layout shift.
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
    </Router>
  );
}
