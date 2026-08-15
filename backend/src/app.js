import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import apiRouter from './routes/api.router.js';

const app = express();

// Security and utility middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan('dev'));
app.use(corsMiddleware);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Root health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 LinkMakeup API is running',
    version: 'v1',
    docs: '/api/v1/health',
  });
});

// Mount API v1 router
app.use('/api/v1', apiRouter);

// 404 Route handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
