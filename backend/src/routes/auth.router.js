import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Public auth endpoints
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);
router.get('/auth/google', AuthController.getGoogleAuthUrl);
router.get('/auth/google/callback', AuthController.handleGoogleCallback);
router.post('/auth/mock-login', AuthController.handleGoogleCallback);

// Protected auth status endpoints
router.get('/auth/me', requireAuth, AuthController.getCurrentUser);
router.post('/auth/logout', requireAuth, AuthController.logout);

export default router;
