import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { requireAdminAccess } from '../middlewares/admin.middleware.js';

const router = Router();

router.use('/admin', requireAdminAccess);

// Stats & Search
router.get('/admin/stats', AdminController.getStats);
router.get('/admin/search', AdminController.search);

// Notes
router.get('/admin/notes', AdminController.listNotes);
router.post('/admin/notes', AdminController.createNote);
router.delete('/admin/notes/:noteId', AdminController.deleteNote);

// Audit logs
router.get('/admin/audit-logs', AdminController.listAuditLogs);
router.get('/admin/audit-logs/export', AdminController.exportAuditLogs);

// Admin analytics
router.get('/admin/analytics/summary', AnalyticsController.getSummary);
router.get('/admin/analytics/pages', AnalyticsController.listPages);
router.get('/admin/analytics/export', AnalyticsController.exportPages);
router.get('/admin/analytics', AnalyticsController.getSummary);

// Users
router.get('/admin/users', AdminController.listUsers);
router.get('/admin/users/export', AdminController.exportUsers);
router.get('/admin/users/:userId', AdminController.getUserDetail);
router.post('/admin/users/:userId/remind-onboarding', AdminController.sendOnboardingReminder);
router.post('/admin/users/remind-all-onboarding', AdminController.sendBulkOnboardingReminders);

// Profiles
router.get('/admin/profiles/export', AdminController.exportProfiles);
router.get('/admin/profiles', AdminController.listProfiles);
router.patch('/admin/profiles/:profileId/suspension', AdminController.patchProfileSuspension);

// Links
router.get('/admin/links/export', AdminController.exportLinks);
router.get('/admin/links', AdminController.listLinks);
router.patch('/admin/links/:linkId', AdminController.patchLink);
router.delete('/admin/links/:linkId', AdminController.deleteLink);

export default router;