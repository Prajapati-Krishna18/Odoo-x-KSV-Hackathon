// ============================================
// Server Entry Point
// ============================================
// Why: Separating server.js from app.js means the Express
// app can be imported for testing without starting a server.
// This file only handles: env loading, port binding, graceful shutdown.
// ============================================

require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/config/logger');
const prisma = require('./src/config/database');
const redis = require('./src/config/redis');
const { createTransporter } = require('./src/config/email');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected');
    process.env.DB_CONNECTED = 'true';

    // Connect to Redis (lazy connect)
    try {
      if (redis.connect) await redis.connect();
    } catch (err) {
      logger.warn(`⚠️ Redis: ${err.message} — running without cache`);
    }

    // Initialize email transporter
    await createTransporter();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 VendorBridge ERP running on port ${PORT}`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      logger.info(`❤️ Health: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    });

    // ──────────── Graceful Shutdown ────────────

    const shutdown = async (signal) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await prisma.$disconnect();
        logger.info('PostgreSQL disconnected');

        try {
          await redis.quit();
          logger.info('Redis disconnected');
        } catch (err) {
          // Redis may already be disconnected
        }

        logger.info('Server shut down complete');
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Unhandled rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err);
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (err) {
    logger.error(`❌ Failed to connect to database: ${err.message}`);
    logger.warn('⚠️ Server will start without database. All DB-dependent endpoints will return 503.');
    process.env.DB_CONNECTED = 'false';

    // Attempt to start HTTP server anyway so health check can report DB status
    const server = app.listen(PORT, () => {
      logger.info(`🚀 VendorBridge ERP running on port ${PORT} (NO DATABASE)`);
      logger.info(`❤️ Health: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    });

    // Still attach graceful shutdown handlers for the no-DB case
    const shutdown = async (signal) => {
      logger.info(`\n${signal} received. Shutting down...`);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (err) => logger.error('Unhandled Rejection:', err));
    process.on('uncaughtException', (err) => { logger.error('Uncaught Exception:', err); process.exit(1); });
  }
};

startServer();
