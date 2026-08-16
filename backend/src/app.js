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
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan('dev'));
app.use(corsMiddleware);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

import { ProfileController } from './controllers/profile.controller.js';
import { SeoController } from './controllers/seo.controller.js';

// SEO Endpoints (Googlebot / Bingbot Crawlers)
app.get('/sitemap.xml', SeoController.getSitemapXml);
app.get('/robots.txt', SeoController.getRobotsTxt);

// Social Scraper & Subdomain OG Preview Middleware (WhatsApp, iMessage, Twitter, Telegram, LinkedIn)
app.use(async (req, res, next) => {
  const host = req.headers.host || '';
  const userAgent = req.headers['user-agent'] || '';
  const isSocialScraper = /facebookexternalhit|WhatsApp|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Applebot/i.test(userAgent);

  // Check if request is for a user profile via subdomain (e.g. "mee.linkmakeup.com") or path "/u/:username" or "/:username"
  const domainParts = host.split('.');
  let targetUsername = null;

  if (domainParts.length >= 3 && !['www', 'api', 'app'].includes(domainParts[0])) {
    targetUsername = domainParts[0].toLowerCase();
  } else {
    // Check path for /u/username or /username if scraper
    const match = req.path.match(/^\/(?:u\/)?([a-zA-Z0-9_-]+)$/);
    if (match && !['api', 'dashboard', 'login', 'register', 'settings'].includes(match[1].toLowerCase())) {
      targetUsername = match[1].toLowerCase();
    }
  }

  if (targetUsername && (isSocialScraper || req.headers.accept?.includes('text/html'))) {
    req.params = { username: targetUsername };
    return ProfileController.getPublicProfileOgHtml(req, res, next);
  }

  next();
});

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
