import cors from 'cors';
import { env } from '../config/env.js';

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  env.clientUrl,
  'https://linkmakeup.com',
  'https://app.linkmakeup.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);

    // Allow static origin list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow wildcard subdomains: *.linkmakeup.com (user pages are username.linkmakeup.com)
    // Usernames allow [a-zA-Z0-9_-], so allow underscore as well
    const subdomainRegex = /^https:\/\/([a-zA-Z0-9_-]+)\.linkmakeup\.com$/;
    if (subdomainRegex.test(origin)) {
      return callback(null, true);
    }
    // Also allow any nested subdomain like username.linkmakeup.com with port implicitly stripped by origin header
    const looseSubdomainRegex = /^https:\/\/.*\.linkmakeup\.com$/;
    if (looseSubdomainRegex.test(origin)) {
      return callback(null, true);
    }

    // Allow localhost wildcard ports in dev mode
    if (env.nodeEnv === 'development' && /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin '${origin}' not allowed by LinkMakeup security policy.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

export const corsMiddleware = cors(corsOptions);
