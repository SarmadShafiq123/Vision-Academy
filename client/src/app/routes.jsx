import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useSelector } from 'react-redux';
import { selectTheme } from '../store/slices/themeSlice.js';
import { initLenis, destroyLenis, getLenis } from '../lib/lenis.js';
import { isFirstLoad } from '../components/LoadingScreen.jsx';
import { useAuthRehydrate } from '../features/lms/auth/useAuthRehydrate.js';
import RequireRole from '../features/lms/shared/RequireRole.jsx';
import { ROLES } from '../features/lms/shared/constants.js';

import Navbar           from '../components/Navbar.jsx';
import Footer           from '../components/Footer.jsx';
import ScrollProgressBar from '../components/ScrollProgressBar.jsx';
import ScrollToTop      from '../components/ScrollToTop.jsx';
import CursorDot        from '../components/CursorDot.jsx';
import LoadingScreen    from '../components/LoadingScreen.jsx';

const Home       = lazy(() => import('../pages/Home.jsx'));
const About      = lazy(() => import('../pages/About.jsx'));
const Courses    = lazy(() => import('../pages/Courses.jsx'));
const Contact    = lazy(() => import('../pages/Contact.jsx'));
const NotFound   = lazy(() => import('../pages/NotFound.jsx'));
const CursorField = lazy(() => import('../components/CursorField.jsx'));

const LoginPage    = lazy(() => import('../features/lms/auth/LoginPage.jsx'));
const AdminPanel   = lazy(() => import('../features/lms/panels/admin/AdminPanel.jsx'));
const TeacherPanel = lazy(() => import('../features/lms/panels/teacher/TeacherPanel.jsx'));
const StudentPanel = lazy(() => import('../features/lms/panels/student/StudentPanel.jsx'));

const PAGE_TRANSITION_DURATION = 0.3;
const MARKETING_SUSPENSE_CLASS = 'min-h-screen';

const ADMIN_ROLES   = [ROLES.ADMIN];
const TEACHER_ROLES = [ROLES.TEACHER];
const STUDENT_ROLES = [ROLES.STUDENT, ROLES.PARENT];

const showSplash = isFirstLoad();

function ThemeSynchroniser() {
  const theme = useSelector(selectTheme);
  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    try { localStorage.setItem('va_theme', theme); } catch (_e) { void _e; }
  }, [theme]);
  return null;
}

function RouteScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) { lenis.scrollTo(0, { immediate: true }); }
    else { window.scrollTo(0, 0); }
  }, [pathname]);
  return null;
}

function PageWrapper({ children }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReduced ? {} : { opacity: 0 }}
      transition={{ duration: PAGE_TRANSITION_DURATION }}
    >
      {children}
    </motion.div>
  );
}

function MarketingRoutes() {
  const location = useLocation();
  return (
    <>
      <RouteScrollReset />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"        element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about"   element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/courses" element={<PageWrapper><Courses /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="*"        element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function MarketingShell() {
  const [loading, setLoading] = useState(showSplash);

  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  return (
    <>
      <LoadingScreen show={loading} onDone={() => setLoading(false)} />
      <ScrollProgressBar />
      <CursorDot />
      <Suspense fallback={null}>
        <CursorField />
      </Suspense>
      <div className={`${MARKETING_SUSPENSE_CLASS} flex flex-col bg-[#f5f7fa] dark:bg-[#0d1425] transition-colors duration-300`}>
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className={MARKETING_SUSPENSE_CLASS} />}>
            <MarketingRoutes />
          </Suspense>
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  );
}

function PortalSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-8 h-8 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
    </div>
  );
}

function PortalRoutes() {
  const { ready } = useAuthRehydrate();
  if (!ready) return <PortalSpinner />;

  return (
    <Suspense fallback={<PortalSpinner />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          path="admin/*"
          element={<RequireRole allowedRoles={ADMIN_ROLES}><AdminPanel /></RequireRole>}
        />
        <Route
          path="teacher/*"
          element={<RequireRole allowedRoles={TEACHER_ROLES}><TeacherPanel /></RequireRole>}
        />
        <Route
          path="student/*"
          element={<RequireRole allowedRoles={STUDENT_ROLES}><StudentPanel /></RequireRole>}
        />
        <Route path=""    element={<Navigate to="/portal/login" replace />} />
        <Route path="*"   element={<Navigate to="/portal/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <>
      <ThemeSynchroniser />
      <Routes>
        <Route path="/portal/*" element={<PortalRoutes />} />
        <Route path="/*"        element={<MarketingShell />} />
      </Routes>
    </>
  );
}
