import { serverEnv } from '@/lib/config/env';

const GITHUB_REST_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'portfolio-backend-service',
  };

  try {
    const token = serverEnv.githubToken;
    if (token && token.trim().length > 0) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }
  } catch {
    // Unauthenticated mode
  }

  return headers;
}

function checkRateLimit(response: Response): number {
  const remainingHeader = response.headers.get('x-ratelimit-remaining');
  if (remainingHeader !== null) {
    const parsed = parseInt(remainingHeader, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return Number.POSITIVE_INFINITY;
}

function isRateLimitedResponse(response: Response): boolean {
  if (response.status === 429) {
    return true;
  }
  const remaining = checkRateLimit(response);
  if (response.status === 403 && remaining === 0) {
    return true;
  }
  return false;
}

export async function githubFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null; rateLimited: boolean }> {
  const normalizedEndpoint = endpoint.startsWith('http')
    ? endpoint
    : `${GITHUB_REST_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const defaultHeaders = getHeaders();

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options?.headers || {}),
    },
    next: {
      revalidate: 3600,
    },
  };

  try {
    const response = await fetch(normalizedEndpoint, fetchOptions);
    const rateLimited = isRateLimitedResponse(response);

    if (rateLimited) {
      console.warn(`[GitHub Client] Rate limit exceeded on endpoint: ${endpoint}`);
      return { data: null, error: 'GitHub rate limit exceeded', rateLimited: true };
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown network error');
      console.error(
        `[GitHub Client] REST error on ${endpoint}: ${response.status} ${response.statusText} - ${errorText}`
      );
      return {
        data: null,
        error: `GitHub REST API error (${response.status}): ${response.statusText}`,
        rateLimited: false,
      };
    }

    const json = (await response.json()) as T;
    return { data: json, error: null, rateLimited: false };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown network failure';
    console.error(`[GitHub Client] Network failure fetching ${endpoint}:`, error);
    return { data: null, error: `GitHub network request failed: ${message}`, rateLimited: false };
  }
}

export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<{ data: T | null; error: string | null; rateLimited: boolean }> {
  const defaultHeaders = getHeaders();

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate: 3600,
    },
  };

  try {
    const response = await fetch(GITHUB_GRAPHQL, fetchOptions);
    const rateLimited = isRateLimitedResponse(response);

    if (rateLimited) {
      console.warn('[GitHub Client] Rate limit exceeded on GraphQL query');
      return { data: null, error: 'GitHub GraphQL rate limit exceeded', rateLimited: true };
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown network error');
      console.error(
        `[GitHub Client] GraphQL HTTP error: ${response.status} ${response.statusText} - ${errorText}`
      );
      return {
        data: null,
        error: `GitHub GraphQL HTTP error (${response.status}): ${response.statusText}`,
        rateLimited: false,
      };
    }

    const result = (await response.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };

    if (result.errors && result.errors.length > 0) {
      const errorMsg = result.errors.map((e) => e.message).join('; ');
      console.error('[GitHub Client] GraphQL query error:', errorMsg);
      return { data: null, error: `GraphQL query error: ${errorMsg}`, rateLimited: false };
    }

    return { data: result.data ?? null, error: null, rateLimited: false };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown network failure';
    console.error('[GitHub Client] Network failure executing GraphQL query:', error);
    return { data: null, error: `GitHub GraphQL network failed: ${message}`, rateLimited: false };
  }
}
