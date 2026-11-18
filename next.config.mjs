/** @type {import('next').NextConfig} */
// Keep existing Cloudflare VITE_* environment names working during the
// transition. The canonical build is Next.js static export; new deployments
// may use NEXT_PUBLIC_* names without losing the existing account settings.
const envBridge = {};
for (const [viteName, publicName] of [
  ['VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'],
  ['VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  ['VITE_YOUTUBE_API_KEY', 'NEXT_PUBLIC_YOUTUBE_API_KEY'],
]) {
  envBridge[publicName] =
    process.env[publicName] || process.env[viteName] || '';
}

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  env: envBridge,
};

export default nextConfig;
