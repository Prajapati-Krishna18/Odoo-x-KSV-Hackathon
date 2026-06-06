// ============================================
// Redis Cache Service
// ============================================
// Why: Dashboard metrics, vendor lists, and analytics queries
// are expensive. Cache results in Redis to reduce DB load.
// TTL-based invalidation with manual invalidation support.
// ============================================

const redis = require('../config/redis');
const logger = require('../config/logger');

class CacheService {
  /**
   * Get cached value
   * @param {string} key
   * @returns {Promise<object|null>}
   */
  static async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.warn(`Cache GET failed for key: ${key}`, { error: err.message });
      return null;
    }
  }

  /**
   * Set cache value with TTL
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds - Time to live in seconds (default: 5 min)
   */
  static async set(key, value, ttlSeconds = 300) {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
      logger.warn(`Cache SET failed for key: ${key}`, { error: err.message });
    }
  }

  /**
   * Delete a cached key
   */
  static async del(key) {
    try {
      await redis.del(key);
    } catch (err) {
      logger.warn(`Cache DEL failed for key: ${key}`, { error: err.message });
    }
  }

  /**
   * Invalidate all keys matching a pattern
   * @param {string} pattern - e.g. 'analytics:*'
   */
  static async invalidatePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      logger.warn(`Cache invalidation failed for pattern: ${pattern}`, { error: err.message });
    }
  }
}

module.exports = CacheService;
