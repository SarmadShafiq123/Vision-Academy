export const ROLES = Object.freeze({
  ADMIN:   'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT:  'parent',
});

export const ROLE_LIST = Object.values(ROLES);

export const COOKIE_REFRESH_TOKEN = 'refreshToken';

export const BCRYPT_SALT_ROUNDS = 12;

export const ROUTES = Object.freeze({
  AUTH:    '/api/auth',
  HEALTH:  '/api/health',
});
