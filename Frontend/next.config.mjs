/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Allow GitHub avatar images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },

  /**
   * Rewrites: proxy /api/* from the Frontend dev server to the Backend.
   *
   * This means during local development you can run:
   *   Backend on  http://localhost:3001   (next dev --port 3001)
   *   Frontend on http://localhost:3000   (next dev)
   *
   * And all fetch('/api/...') calls in the Frontend will transparently
   * route to the Backend — no CORS issues, no env wiring needed in dev.
   *
   * In production (two separate Vercel projects) remove the rewrites block
   * and rely on NEXT_PUBLIC_API_URL in .env.production instead.
   */
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
