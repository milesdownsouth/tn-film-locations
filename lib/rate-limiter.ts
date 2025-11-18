/**
 * Simple in-memory rate limiter
 * Tracks submissions by IP address
 */

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

// Store rate limit data in memory
// In production, consider using Redis or a database
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;

  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.lastRequest > tenMinutes) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No previous requests
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Check if window has expired
  const timeSinceFirst = now - entry.firstRequest;
  if (timeSinceFirst > config.windowMs) {
    // Reset the window
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Within the window - check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.firstRequest + config.windowMs,
    };
  }

  // Increment counter
  entry.count++;
  entry.lastRequest = now;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.firstRequest + config.windowMs,
  };
}

/**
 * Get client IP address from request headers
 * @param headers - Request headers
 * @returns IP address or 'unknown'
 */
export function getClientIp(headers: Headers): string {
  // Check various headers that might contain the real IP
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'unknown';
}
