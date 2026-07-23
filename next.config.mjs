import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root: a lockfile in the home directory otherwise wins
  // the inference and Next resolves assets from the wrong tree.
  turbopack: { root: path.resolve(process.cwd()) },
  images: {
    // Client videos are served from the DigitalOcean CDN, never from public/.
    // See ASSETS.md — the raw sources live in _source/ and are not deployed.
    remotePatterns: [
      { protocol: 'https', hostname: 'tgox-production-bucket.nyc3.cdn.digitaloceanspaces.com' },
    ],
  },
};
export default nextConfig;
