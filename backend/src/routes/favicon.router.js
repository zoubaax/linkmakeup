import { Router } from 'express';
import { FaviconController } from '../controllers/favicon.controller.js';

const router = Router();

router.get('/favicon', FaviconController.getFavicon);

export default router;
