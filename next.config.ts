/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'create-images-results.d-id.com',
      'studio.d-id.com',
      'd-id.com'
    ],
  },
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;