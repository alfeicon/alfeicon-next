// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.nintendo.com' },
      { protocol: 'https', hostname: 'www.nintendo.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'cloudfront-eu-central-1.images.arcpublishing.com' },
      { protocol: 'https', hostname: 'www.nintendari.it' },
      { protocol: 'https', hostname: 'www.nintenderos.com' },
    ],
  },
};

export default nextConfig;