import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';

const router = Router();

// GET /api/v1/profiles/check-availability?username=mohammed
router.get('/profiles/check-availability', ProfileController.checkUsernameAvailability);

// GET /api/v1/profiles/:username (Public Profile view)
router.get('/profiles/:username', ProfileController.getPublicProfile);

export default router;
