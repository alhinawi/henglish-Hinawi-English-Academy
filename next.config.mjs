/** @type {import('next').NextConfig} */
// Bridge: Cloudflare Pages sets VITE_* vars for the Vite build; expose the
// same values to the Next static export as NEXT_PUBLIC_* so client bundles
// behave identically under either build command.
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
