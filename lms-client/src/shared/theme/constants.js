export const ROLES = Object.freeze({
  ADMIN:   'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT:  'parent',
});

export const ROUTES = Object.freeze({
  LOGIN:   '/login',
  ADMIN:   '/admin',
  TEACHER: '/teacher',
  STUDENT: '/student',
});

export const ROLE_DASHBOARD = Object.freeze({
  [ROLES.ADMIN]:   ROUTES.ADMIN,
  [ROLES.TEACHER]: ROUTES.TEACHER,
  [ROLES.STUDENT]: ROUTES.STUDENT,
  [ROLES.PARENT]:  ROUTES.STUDENT,
});
