export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface InMemoryRateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, InMemoryRateLimitRecord>();

function pruneExpiredMemoryStore(now: number): void {
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetAt) {
      memoryStore.delete(key);
    }
  }
}

export function checkInMemoryRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  pruneExpiredMemoryStore(now);

  const existing = memoryStore.get(identifier);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    memoryStore.set(identifier, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const normalizedUrl = upstashUrl.replace(/\/$/, '');
      const key = `rate_limit:${identifier}`;

      const response = await fetch(`${normalizedUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSeconds, 'NX'],
          ['TTL', key],
        ]),
        next: { revalidate: 0 },
      });

      if (response.ok) {
        const results = (await response.json()) as Array<{ result?: unknown }>;
        const incrCount = typeof results[0]?.result === 'number' ? results[0].result : 1;
        const ttlSeconds =
          typeof results[2]?.result === 'number' && results[2].result > 0
            ? results[2].result
            : windowSeconds;

        const now = Date.now();
        return {
          allowed: incrCount <= limit,
          remaining: Math.max(0, limit - incrCount),
          resetAt: now + ttlSeconds * 1000,
        };
      }
    } catch {
      // fallback
    }
  }

  return checkInMemoryRateLimit(identifier, limit, windowSeconds);
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}
