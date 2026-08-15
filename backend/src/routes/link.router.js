import { Router } from 'express';
import { LinkController } from '../controllers/link.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Protected link management endpoints
router.use('/links', requireAuth);

router.get('/links', LinkController.getUserLinks);
router.post('/links', LinkController.createLink);
router.patch('/links/reorder', LinkController.reorderLinks);
router.patch('/links/:id', LinkController.updateLink);
router.delete('/links/:id', LinkController.deleteLink);

export default router;
