import { Router } from 'express';
import healthRouter from './health.router.js';
import authRouter from './auth.router.js';
import profileRouter from './profile.router.js';
import linkRouter from './link.router.js';
import faviconRouter from './favicon.router.js';
import walletRouter from './wallet.router.js';

const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(faviconRouter);
apiRouter.use(authRouter);
apiRouter.use(profileRouter);
apiRouter.use(linkRouter);
apiRouter.use(walletRouter);

export default apiRouter;
