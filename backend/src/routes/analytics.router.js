import { Router } from 'express';
import AnalyticsController from '../controllers/analytics.controller.js';

const router = Router();

router.post('/analytics/page-view', AnalyticsController.recordPageView);
router.post('/analytics/link-click', AnalyticsController.recordLinkClick);

export default router;