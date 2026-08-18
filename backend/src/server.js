import app from './app.js';
import { env } from './config/env.js';
import { verifySmtpConnection } from './config/mailer.js';

const server = app.listen(env.port, () => {
  console.log(`
🚀 LinkMakeup REST API Backend running!
📡 Environment: ${env.nodeEnv}
🔗 Server URL: http://localhost:${env.port}
🏥 Health Check: http://localhost:${env.port}/api/v1/health
  `);

  verifySmtpConnection();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
