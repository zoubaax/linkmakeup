import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import AnalyticsController from '../controllers/analytics.controller.js';
import { requireAdminAccess } from '../middlewares/admin.middleware.js';

const router = Router();

router.use('/admin', requireAdminAccess);
router.get('/admin/stats', AdminController.getStats);
router.get('/admin/analytics/export', AnalyticsController.exportPageStats);
router.get('/admin/analytics/pages', AnalyticsController.listPageStats);
router.get('/admin/analytics', AnalyticsController.getAdminAnalytics);
router.get('/admin/audit-logs', AdminController.listAuditLogs);
router.get('/admin/audit-logs/export', AdminController.exportAuditLogs);
router.get('/admin/users/export', AdminController.exportUsers);
router.get('/admin/users', AdminController.listUsers);
router.get('/admin/users/:userId', AdminController.getUserDetail);
router.get('/admin/profiles/export', AdminController.exportProfiles);
router.get('/admin/profiles', AdminController.listProfiles);
router.get('/admin/links/export', AdminController.exportLinks);
router.get('/admin/links', AdminController.listLinks);
router.patch('/admin/links/:linkId', AdminController.patchLink);
router.delete('/admin/links/:linkId', AdminController.deleteLink);
router.patch('/admin/profiles/:profileId/suspension', AdminController.patchProfileSuspension);
router.post('/admin/users/:userId/remind-onboarding', AdminController.sendOnboardingReminder);
router.post('/admin/users/remind-all-onboarding', AdminController.sendBulkOnboardingReminders);

export default router;
