import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAdminAccess } from '../middlewares/admin.middleware.js';

const router = Router();

router.use('/admin', requireAdminAccess);
router.get('/admin/stats', AdminController.getStats);
router.get('/admin/audit-logs', AdminController.listAuditLogs);
router.get('/admin/users', AdminController.listUsers);
router.get('/admin/users/:userId', AdminController.getUserDetail);
router.get('/admin/profiles', AdminController.listProfiles);
router.get('/admin/links', AdminController.listLinks);
router.patch('/admin/links/:linkId', AdminController.patchLink);
router.delete('/admin/links/:linkId', AdminController.deleteLink);
router.patch('/admin/profiles/:profileId/suspension', AdminController.patchProfileSuspension);

export default router;
