export const ROLES = Object.freeze({
  ADMIN:   'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT:  'parent',
});

export const PORTAL_ROUTES = Object.freeze({
  LOGIN:   '/portal/login',
  ADMIN:   '/portal/admin',
  TEACHER: '/portal/teacher',
  STUDENT: '/portal/student',
});

export const ROLE_DASHBOARD = Object.freeze({
  [ROLES.ADMIN]:   PORTAL_ROUTES.ADMIN,
  [ROLES.TEACHER]: PORTAL_ROUTES.TEACHER,
  [ROLES.STUDENT]: PORTAL_ROUTES.STUDENT,
  [ROLES.PARENT]:  PORTAL_ROUTES.STUDENT,
});
