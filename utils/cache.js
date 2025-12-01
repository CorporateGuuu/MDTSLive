// Simple in-memory cache implementation
// In production, consider using Redis or another caching solution

const cache = new Map();

class Cache {
  constructor() {
    this.cache = new Map();
  }

  // Get data from cache
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if item has expired
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Set data in cache with optional TTL (time to live) in seconds
  set(key, data, ttl = null) {
    const expires = ttl ? Date.now() + (ttl * 1000) : null;
    this.cache.set(key, { data, expires });
  }

  // Delete data from cache
  delete(key) {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Get all cache keys
  keys() {
    return Array.from(this.cache.keys());
  }
}

// Create a global cache instance
const globalCache = new Cache();

// Helper functions for compatibility
const getCachedData = (key) => {
  return globalCache.get(key);
};

const cacheData = (key, data, ttl = null) => {
  globalCache.set(key, data, ttl);
};

const clearCache = (key = null) => {
  if (key) {
    return globalCache.delete(key);
  } else {
    globalCache.clear();
    return true;
  }
};

module.exports = {
  Cache,
  globalCache,
  getCachedData,
  cacheData,
  clearCache
};
