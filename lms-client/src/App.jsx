import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthRehydrate } from './features/auth/useAuthRehydrate.js';
import RequireRole from './shared/components/RequireRole.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';
import TeacherPanel from './pages/teacher/TeacherPanel.jsx';
import StudentPanel from './pages/student/StudentPanel.jsx';
import { ROLES, ROUTES } from './shared/theme/constants.js';

const ADMIN_ROLES   = [ROLES.ADMIN];
const TEACHER_ROLES = [ROLES.TEACHER];
const STUDENT_ROLES = [ROLES.STUDENT, ROLES.PARENT];

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-8 h-8 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  const { ready } = useAuthRehydrate();

  if (!ready) return <FullPageSpinner />;

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route
        path="/admin/*"
        element={
          <RequireRole allowedRoles={ADMIN_ROLES}>
            <AdminPanel />
          </RequireRole>
        }
      />

      <Route
        path="/teacher/*"
        element={
          <RequireRole allowedRoles={TEACHER_ROLES}>
            <TeacherPanel />
          </RequireRole>
        }
      />

      <Route
        path="/student/*"
        element={
          <RequireRole allowedRoles={STUDENT_ROLES}>
            <StudentPanel />
          </RequireRole>
        }
      />

      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
