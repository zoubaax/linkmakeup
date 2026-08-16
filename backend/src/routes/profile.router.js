import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/v1/profiles/check-availability?username=mohammed (Public)
router.get('/profiles/check-availability', ProfileController.checkUsernameAvailability);

// GET /api/v1/profiles/:username (Public profile view)
router.get('/profiles/check-og', ProfileController.checkOgRoute);
router.get('/profiles/:username', ProfileController.getPublicProfile);
router.get('/profiles/:username/og', ProfileController.getPublicProfileOgHtml);

// Protected routes
router.post('/profiles', requireAuth, ProfileController.createProfile);
router.patch('/profiles/me', requireAuth, ProfileController.updateProfile);
router.post('/profiles/avatar-upload-signature', requireAuth, ProfileController.getAvatarUploadSignature);

export default router;
