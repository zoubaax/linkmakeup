import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/v1/profiles/check-availability?username=mohammed (Public)
router.get('/profiles/check-availability', ProfileController.checkUsernameAvailability);

// GET /api/v1/profiles/:username (Public profile view)
router.get('/profiles/:username', ProfileController.getPublicProfile);

// POST /api/v1/profiles (Protected - Create profile username during onboarding)
router.post('/profiles', requireAuth, ProfileController.createProfile);

export default router;
