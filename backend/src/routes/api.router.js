import { Router } from 'express';
import healthRouter from './health.router.js';
import profileRouter from './profile.router.js';
import linkRouter from './link.router.js';

const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(profileRouter);
apiRouter.use(linkRouter);

export default apiRouter;
