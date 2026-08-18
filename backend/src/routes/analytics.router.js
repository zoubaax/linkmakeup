import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { createRateLimiter } from '../utils/rateLimit.js';

const router = Router();

// Public first-party analytics beacon (page views & link clicks), rate-limited per IP.
const trackRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30 });

router.post('/analytics/track', trackRateLimiter, AnalyticsController.track);
router.post('/analytics/page-view', AnalyticsController.recordPageView);
router.post('/analytics/link-click', AnalyticsController.recordLinkClick);

// Authenticated creator analytics (scoped to the logged-in user's profile).
router.get('/analytics/me/summary', requireAuth, AnalyticsController.getMySummary);
router.get('/analytics/me/links', requireAuth, AnalyticsController.getMyLinks);

export default router;