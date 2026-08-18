import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
<<<<<<< Updated upstream
import AnalyticsController from '../controllers/analytics.controller.js';
=======
import { AnalyticsController } from '../controllers/analytics.controller.js';
>>>>>>> Stashed changes
import { requireAdminAccess } from '../middlewares/admin.middleware.js';

const router = Router();

router.use('/admin', requireAdminAccess);
router.get('/admin/stats', AdminController.getStats);
<<<<<<< Updated upstream
router.get('/admin/analytics/export', AnalyticsController.exportPageStats);
router.get('/admin/analytics/pages', AnalyticsController.listPageStats);
router.get('/admin/analytics', AnalyticsController.getAdminAnalytics);
router.get('/admin/audit-logs', AdminController.listAuditLogs);
router.get('/admin/audit-logs/export', AdminController.exportAuditLogs);
router.get('/admin/users/export', AdminController.exportUsers);
=======
router.get('/admin/search', AdminController.search);
router.get('/admin/notes', AdminController.listNotes);
router.post('/admin/notes', AdminController.createNote);
router.delete('/admin/notes/:noteId', AdminController.deleteNote);
router.get('/admin/audit-logs', AdminController.listAuditLogs);
router.get('/admin/audit-logs/export', AdminController.exportAuditLogs);

// Admin analytics summary, per-page stats listing, and CSV export.
router.get('/admin/analytics/summary', AnalyticsController.getSummary);
router.get('/admin/analytics/pages', AnalyticsController.listPages);
router.get('/admin/analytics/export', AnalyticsController.exportPages);

>>>>>>> Stashed changes
router.get('/admin/users', AdminController.listUsers);
router.get('/admin/users/export', AdminController.exportUsers);
router.get('/admin/users/:userId', AdminController.getUserDetail);
<<<<<<< Updated upstream
router.get('/admin/profiles/export', AdminController.exportProfiles);
router.get('/admin/profiles', AdminController.listProfiles);
router.get('/admin/links/export', AdminController.exportLinks);
router.get('/admin/links', AdminController.listLinks);
router.patch('/admin/links/:linkId', AdminController.patchLink);
router.delete('/admin/links/:linkId', AdminController.deleteLink);
router.patch('/admin/profiles/:profileId/suspension', AdminController.patchProfileSuspension);
=======
>>>>>>> Stashed changes
router.post('/admin/users/:userId/remind-onboarding', AdminController.sendOnboardingReminder);
router.post('/admin/users/remind-all-onboarding', AdminController.sendBulkOnboardingReminders);

router.get('/admin/profiles', AdminController.listProfiles);
router.get('/admin/profiles/export', AdminController.exportProfiles);
router.patch('/admin/profiles/:profileId/suspension', AdminController.patchProfileSuspension);

router.get('/admin/links', AdminController.listLinks);
router.get('/admin/links/export', AdminController.exportLinks);
router.patch('/admin/links/:linkId', AdminController.patchLink);
router.delete('/admin/links/:linkId', AdminController.deleteLink);

export default router;