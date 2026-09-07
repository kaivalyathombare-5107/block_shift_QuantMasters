export const serverEnv = {
  get githubUsername(): string {
    return process.env.GITHUB_USERNAME || '';
  },
  get githubToken(): string {
    return process.env.GITHUB_TOKEN || '';
  },
  get resendApiKey(): string {
    return process.env.RESEND_API_KEY || '';
  },
  get contactEmail(): string {
    return process.env.CONTACT_EMAIL || '';
  },
  get upstashRedisUrl(): string {
    return process.env.UPSTASH_REDIS_REST_URL || '';
  },
  get upstashRedisToken(): string {
    return process.env.UPSTASH_REDIS_REST_TOKEN || '';
  },
  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  },
};

export const publicEnv = {
  get siteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  },
};
