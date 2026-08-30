/** @type {import('next').NextConfig} */
const nextConfig = {
  // Publishable values only. Anything secret must be set as an environment
  // variable in the hosting dashboard — never here.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      'https://weyxewesdowmknygynys.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleXhld2VzZG93bWtueWd5bnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjY2MTQsImV4cCI6MjA2ODYwMjYxNH0.izfGRHcNwZEHLlXu8QPOgC4qsjtw65Ue6LZFU2nMMgk',
  },
  reactStrictMode: true,
  optimizeFonts: false,
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
      ]
    }];
  }
};
export default nextConfig;
