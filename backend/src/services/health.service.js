import { env } from '../config/env.js';

export class HealthService {
  static getHealthStatus() {
    return {
      status: 'ok',
      service: 'LinkMakeup REST API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv,
      uptime: process.uptime(),
    };
  }
}
