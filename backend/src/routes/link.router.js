import { Router } from 'express';
import { LinkController } from '../controllers/link.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { rejectSuspendedAccount } from '../middlewares/suspended.middleware.js';

const router = Router();

// Protected link management endpoints
router.use('/links', requireAuth);

router.get('/links', LinkController.getUserLinks);
router.post('/links', rejectSuspendedAccount, LinkController.createLink);
router.patch('/links/reorder', rejectSuspendedAccount, LinkController.reorderLinks);
router.patch('/links/:id', rejectSuspendedAccount, LinkController.updateLink);
router.delete('/links/:id', rejectSuspendedAccount, LinkController.deleteLink);

export default router;
