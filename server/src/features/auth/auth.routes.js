import { Router } from 'express';
import { login, register, refresh, logout } from './auth.controller.js';
import { requireAuth } from '../../shared/middleware/requireAuth.js';
import { requireRole } from '../../shared/middleware/requireRole.js';
import { ROLES } from '../../shared/config/constants.js';

const router = Router();

router.post('/login',    login);
router.post('/refresh',  refresh);
router.post('/logout',   logout);
router.post('/register', requireAuth, requireRole([ROLES.ADMIN]), register);

export default router;
