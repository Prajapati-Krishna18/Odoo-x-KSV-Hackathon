// ============================================
// Redis Client Configuration
// ============================================
// Why: Redis is used for rate limiting, caching dashboard metrics,
// and session-adjacent data. IoRedis provides auto-reconnect,
// cluster support, and Lua scripting.
// ============================================

const Redis = require('ioredis');
const logger = require('./logger');

let redis;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true,
  });

  redis.on('connect', () => {
    logger.info('✅ Redis connected');
  });

  redis.on('error', (err) => {
    logger.warn(`⚠️ Redis connection error: ${err.message}. Caching disabled.`);
  });
} catch (err) {
  logger.warn(`⚠️ Redis not available: ${err.message}. Running without cache.`);
  // Provide a no-op fallback so the app doesn't crash without Redis
  redis = {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 0,
    setex: async () => 'OK',
    exists: async () => 0,
    quit: async () => {},
    status: 'disconnected',
  };
}

module.exports = redis;
