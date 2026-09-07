/**
 * Centralized environment variable access and validation module.
 * Direct access to process.env is strictly prohibited outside this file.
 */

// Validates and exports all environment variables
// Server-side variables throw at runtime if required and missing
// Client-side variables are safe to export

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getOptionalEnv = (key: string, fallback = ''): string => {
  return process.env[key] ?? fallback;
};

export const serverEnv = {
  get githubUsername(): string {
    return getRequiredEnv('GITHUB_USERNAME');
  },
  get githubToken(): string {
    return getOptionalEnv('GITHUB_TOKEN'); // degraded mode if missing
  },
  get resendApiKey(): string {
    return getOptionalEnv('RESEND_API_KEY');
  },
  get contactEmail(): string {
    return getOptionalEnv('CONTACT_EMAIL');
  },
  get upstashRedisUrl(): string {
    return getOptionalEnv('UPSTASH_REDIS_REST_URL');
  },
  get upstashRedisToken(): string {
    return getOptionalEnv('UPSTASH_REDIS_REST_TOKEN');
  },
  get nodeEnv(): string {
    return getOptionalEnv('NODE_ENV', 'development');
  },
};

export const publicEnv = {
  get siteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  },
};
